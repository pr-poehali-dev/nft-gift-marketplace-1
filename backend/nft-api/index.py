'''
Business: API for NFT marketplace - manage NFTs, users, purchases, and transfers
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with NFT data or operation results
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any

def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('queryStringParameters', {}).get('action', '')
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            if path == 'nfts':
                rarity = event.get('queryStringParameters', {}).get('rarity', '')
                if rarity and rarity != 'all':
                    cur.execute("SELECT * FROM nfts WHERE rarity = %s ORDER BY id", (rarity,))
                else:
                    cur.execute("SELECT * FROM nfts ORDER BY id")
                nfts = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'nfts': nfts}, default=json_serial),
                    'isBase64Encoded': False
                }
            
            elif path == 'user':
                user_id = event.get('queryStringParameters', {}).get('userId', '1')
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                
                cur.execute("""
                    SELECT n.*, un.acquired_at 
                    FROM user_nfts un 
                    JOIN nfts n ON un.nft_id = n.id 
                    WHERE un.user_id = %s
                """, (user_id,))
                owned_nfts = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'user': user, 'owned_nfts': owned_nfts}, default=json_serial),
                    'isBase64Encoded': False
                }
            
            elif path == 'stats':
                cur.execute("SELECT COUNT(*) as total_users FROM users")
                total_users = cur.fetchone()['total_users']
                
                cur.execute("SELECT COUNT(*) as total_nfts FROM nfts")
                total_nfts = cur.fetchone()['total_nfts']
                
                cur.execute("SELECT COUNT(*) as total_sales FROM transactions WHERE transaction_type = 'purchase'")
                total_sales = cur.fetchone()['total_sales']
                
                cur.execute("SELECT COUNT(*) as total_transactions FROM transactions")
                total_transactions = cur.fetchone()['total_transactions']
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'total_users': total_users,
                        'total_nfts': total_nfts,
                        'total_sales': total_sales,
                        'total_transactions': total_transactions
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if path == 'purchase':
                user_id = body_data.get('userId')
                nft_id = body_data.get('nftId')
                
                cur.execute("SELECT price FROM nfts WHERE id = %s", (nft_id,))
                nft = cur.fetchone()
                if not nft:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'NFT not found'}),
                        'isBase64Encoded': False
                    }
                
                price = nft['price']
                
                cur.execute("SELECT balance FROM users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                if not user or user['balance'] < price:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Insufficient balance'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE users SET balance = balance - %s WHERE id = %s", (price, user_id))
                
                cur.execute("""
                    INSERT INTO user_nfts (user_id, nft_id) 
                    VALUES (%s, %s) 
                    ON CONFLICT (user_id, nft_id) DO NOTHING
                """, (user_id, nft_id))
                
                cur.execute("""
                    INSERT INTO transactions (to_user_id, nft_id, transaction_type, amount) 
                    VALUES (%s, %s, 'purchase', %s)
                """, (user_id, nft_id, price))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'message': 'NFT purchased successfully'}),
                    'isBase64Encoded': False
                }
            
            elif path == 'create-nft':
                emoji = body_data.get('emoji')
                name = body_data.get('name')
                description = body_data.get('description', '')
                price = body_data.get('price')
                rarity = body_data.get('rarity')
                gradient = body_data.get('gradient', 'bg-gradient-to-br from-blue-400 to-purple-500')
                
                cur.execute("""
                    INSERT INTO nfts (emoji, name, description, price, rarity, gradient) 
                    VALUES (%s, %s, %s, %s, %s, %s) 
                    RETURNING *
                """, (emoji, name, description, price, rarity, gradient))
                
                new_nft = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'nft': new_nft}, default=json_serial),
                    'isBase64Encoded': False
                }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }