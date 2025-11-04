CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nfts (
    id SERIAL PRIMARY KEY,
    emoji VARCHAR(10) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    rarity VARCHAR(50) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    gradient VARCHAR(200) NOT NULL,
    total_supply INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_nfts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    nft_id INTEGER NOT NULL REFERENCES nfts(id),
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, nft_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    nft_id INTEGER NOT NULL REFERENCES nfts(id),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('purchase', 'transfer', 'gift')),
    amount INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, balance) VALUES 
    ('user123', 2500),
    ('admin', 10000)
ON CONFLICT (username) DO NOTHING;

INSERT INTO nfts (emoji, name, description, price, rarity, gradient) VALUES
    ('🎉', 'Party Gift', 'Celebrate any occasion with this festive gift', 100, 'common', 'bg-gradient-to-br from-pink-400 to-purple-500'),
    ('🎂', 'Birthday Cake', 'Perfect for birthday celebrations', 250, 'rare', 'bg-gradient-to-br from-yellow-400 to-orange-500'),
    ('💎', 'Diamond', 'A precious and rare gem', 500, 'epic', 'bg-gradient-to-br from-blue-400 to-cyan-500'),
    ('👑', 'Crown', 'The ultimate symbol of royalty', 1000, 'legendary', 'bg-gradient-to-br from-yellow-300 to-yellow-600'),
    ('🚀', 'Rocket', 'Blast off to new adventures', 150, 'common', 'bg-gradient-to-br from-indigo-400 to-purple-600'),
    ('🌟', 'Star', 'Shine bright like a star', 300, 'rare', 'bg-gradient-to-br from-yellow-400 to-pink-500'),
    ('🎨', 'Art Palette', 'For the creative souls', 400, 'epic', 'bg-gradient-to-br from-red-400 to-pink-500'),
    ('🏆', 'Trophy', 'Champion achievement award', 800, 'legendary', 'bg-gradient-to-br from-amber-400 to-orange-600')
ON CONFLICT DO NOTHING;