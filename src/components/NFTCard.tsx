import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NFTCardProps {
  id: number;
  emoji: string;
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  gradient: string;
  owned?: boolean;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

export default function NFTCard({ emoji, name, price, rarity, gradient, owned }: NFTCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className={`h-48 flex items-center justify-center text-7xl ${gradient}`}>
        {emoji}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge className={`${rarityColors[rarity]} mt-1 text-xs`}>
              {rarity.toUpperCase()}
            </Badge>
          </div>
          {owned && (
            <Badge variant="outline" className="text-primary border-primary">
              <Icon name="Check" size={14} className="mr-1" />
              Owned
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xl font-bold">
            <Icon name="Sparkles" size={20} className="text-primary" />
            {price}
          </div>
          <Button size="sm" className="rounded-full">
            <Icon name="ShoppingCart" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
