import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import NFTCard from '@/components/NFTCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const mockNFTs = [
  { id: 1, emoji: '🎉', name: 'Party Gift', price: 100, rarity: 'common' as const, gradient: 'bg-gradient-to-br from-pink-400 to-purple-500' },
  { id: 2, emoji: '🎂', name: 'Birthday Cake', price: 250, rarity: 'rare' as const, gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: 3, emoji: '💎', name: 'Diamond', price: 500, rarity: 'epic' as const, gradient: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
  { id: 4, emoji: '👑', name: 'Crown', price: 1000, rarity: 'legendary' as const, gradient: 'bg-gradient-to-br from-yellow-300 to-yellow-600' },
  { id: 5, emoji: '🚀', name: 'Rocket', price: 150, rarity: 'common' as const, gradient: 'bg-gradient-to-br from-indigo-400 to-purple-600' },
  { id: 6, emoji: '🌟', name: 'Star', price: 300, rarity: 'rare' as const, gradient: 'bg-gradient-to-br from-yellow-400 to-pink-500' },
  { id: 7, emoji: '🎨', name: 'Art Palette', price: 400, rarity: 'epic' as const, gradient: 'bg-gradient-to-br from-red-400 to-pink-500' },
  { id: 8, emoji: '🏆', name: 'Trophy', price: 800, rarity: 'legendary' as const, gradient: 'bg-gradient-to-br from-amber-400 to-orange-600' },
];

const API_URL = 'https://functions.poehali.dev/5d77d8b7-4f38-4cfd-bda5-d4d3725aa24c';

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [nfts, setNfts] = useState(mockNFTs);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
    fetchStats();
    fetchUserData();
  }, []);

  const fetchNFTs = async () => {
    try {
      const response = await fetch(`${API_URL}?action=nfts`);
      const data = await response.json();
      if (data.nfts) setNfts(data.nfts);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}?action=stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}?action=user&userId=1`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || nft.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-3">NFT Gifts Market</h1>
        <p className="text-muted-foreground text-lg">Покупайте, дарите и коллекционируйте уникальные NFT подарки</p>
        <div className="flex gap-4 justify-center mt-6">
          <Button size="lg" onClick={() => setCurrentPage('marketplace')}>
            <Icon name="Store" size={20} className="mr-2" />
            Открыть маркет
          </Button>
          <Button size="lg" variant="outline" onClick={() => setCurrentPage('profile')}>
            <Icon name="User" size={20} className="mr-2" />
            Мой профиль
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Популярные подарки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nfts.slice(0, 4).map((nft) => (
            <NFTCard key={nft.id} {...nft} />
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border">
        <h3 className="text-xl font-bold mb-4">Статистика платформы</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats?.total_sales || 0}</div>
            <div className="text-sm text-muted-foreground">NFT продано</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats?.total_users || 0}</div>
            <div className="text-sm text-muted-foreground">Пользователей</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats?.total_nfts || 0}</div>
            <div className="text-sm text-muted-foreground">Типов подарков</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats?.total_transactions || 0}</div>
            <div className="text-sm text-muted-foreground">Транзакций</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Маркетплейс</h1>
        <p className="text-muted-foreground">Изучите все доступные NFT подарки</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск NFT подарков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedRarity} onValueChange={setSelectedRarity}>
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Редкость" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все редкости</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredNFTs.map((nft) => (
          <NFTCard key={nft.id} {...nft} />
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              <Icon name="User" size={32} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Мой профиль</h2>
            <p className="text-muted-foreground">@user123</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{userData?.owned_nfts?.length || 0}</div>
            <div className="text-sm text-muted-foreground">NFT в коллекции</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <Icon name="Sparkles" size={20} className="text-primary" />
              {userData?.user?.balance || 0}
            </div>
            <div className="text-sm text-muted-foreground">Баланс</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{userData?.transactions?.filter((t: any) => t.transaction_type === 'transfer').length || 0}</div>
            <div className="text-sm text-muted-foreground">Подарков отправлено</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Icon name="Plus" size={20} className="mr-2" />
                Пополнить баланс
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Пополнение баланса</DialogTitle>
                <DialogDescription>
                  Переведите средства на указанный номер карты
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="bg-muted rounded-lg p-6 text-center space-y-3">
                  <div className="text-sm text-muted-foreground">Номер карты для пополнения</div>
                  <div className="text-2xl font-mono font-bold tracking-wider">
                    2200 7019 7410 1922
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText('2200701974101922');
                      setCopiedCard(true);
                      setTimeout(() => setCopiedCard(false), 2000);
                    }}
                  >
                    <Icon name={copiedCard ? "Check" : "Copy"} size={16} className="mr-2" />
                    {copiedCard ? 'Скопировано!' : 'Скопировать номер'}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма пополнения (₽)</Label>
                  <Input id="amount" type="number" placeholder="1000" />
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100">
                  <div className="flex gap-2">
                    <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      После перевода средства зачислятся на баланс автоматически в течение 5 минут. 
                      1 ₽ = 1 монета в системе.
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex-1">
            <Icon name="Send" size={20} className="mr-2" />
            Отправить подарок
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4">Моя коллекция</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userData?.owned_nfts && userData.owned_nfts.length > 0 ? (
            userData.owned_nfts.map((nft: any) => (
              <NFTCard key={nft.id} {...nft} owned />
            ))
          ) : (
            <div className="col-span-4 text-center py-12 text-muted-foreground">
              <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
              <p>У вас пока нет NFT в коллекции</p>
            </div>
          )}
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">История транзакций</h3>
        <div className="space-y-3">
          {userData?.transactions && userData.transactions.length > 0 ? (
            userData.transactions.map((transaction: any) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  transaction.transaction_type === 'purchase' ? 'bg-red-100 dark:bg-red-950' :
                  transaction.transaction_type === 'deposit' ? 'bg-green-100 dark:bg-green-950' :
                  transaction.transaction_type === 'gift' ? 'bg-purple-100 dark:bg-purple-950' :
                  'bg-blue-100 dark:bg-blue-950'
                }`}>
                  <Icon 
                    name={
                      transaction.transaction_type === 'purchase' ? 'ShoppingCart' :
                      transaction.transaction_type === 'deposit' ? 'ArrowDownToLine' :
                      transaction.transaction_type === 'gift' ? 'Gift' :
                      'ArrowRightLeft'
                    } 
                    size={20} 
                    className={
                      transaction.transaction_type === 'purchase' ? 'text-red-600 dark:text-red-400' :
                      transaction.transaction_type === 'deposit' ? 'text-green-600 dark:text-green-400' :
                      transaction.transaction_type === 'gift' ? 'text-purple-600 dark:text-purple-400' :
                      'text-blue-600 dark:text-blue-400'
                    }
                  />
                </div>
                <div>
                  <div className="font-semibold">
                    {transaction.transaction_type === 'purchase' && 'Покупка NFT'}
                    {transaction.transaction_type === 'deposit' && 'Пополнение баланса'}
                    {transaction.transaction_type === 'gift' && 'Получен подарок'}
                    {transaction.transaction_type === 'transfer' && 'Отправлен подарок'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.emoji && `${transaction.emoji} ${transaction.nft_name}`} • {new Date(transaction.created_at).toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>
              {transaction.amount && transaction.amount !== 0 && (
                <div className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  <Icon name="Sparkles" size={16} className="inline ml-1" />
                </div>
              )}
            </div>
          ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="History" size={48} className="mx-auto mb-4 opacity-50" />
              <p>История транзакций пуста</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
        <p className="text-muted-foreground">Управление NFT маркетплейсом</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">567</div>
              <div className="text-sm text-muted-foreground">Пользователи</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="Package" size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-muted-foreground">NFT типов</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="TrendingUp" size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-muted-foreground">Продаж</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="DollarSign" size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">45.6K</div>
              <div className="text-sm text-muted-foreground">Выручка</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Управление NFT</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить NFT
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новый NFT</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="emoji">Эмодзи</Label>
                  <Input id="emoji" placeholder="🎁" />
                </div>
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input id="name" placeholder="Gift Box" />
                </div>
                <div>
                  <Label htmlFor="price">Цена</Label>
                  <Input id="price" type="number" placeholder="100" />
                </div>
                <div>
                  <Label htmlFor="rarity">Редкость</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите редкость" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea id="description" placeholder="Описание NFT..." />
                </div>
                <Button className="w-full">Создать NFT</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {mockNFTs.slice(0, 5).map((nft) => (
            <Card key={nft.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${nft.gradient}`}>
                    {nft.emoji}
                  </div>
                  <div>
                    <div className="font-semibold">{nft.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{nft.rarity}</Badge>
                      <span className="flex items-center gap-1">
                        <Icon name="Sparkles" size={14} className="text-primary" />
                        {nft.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return renderHome();
      case 'marketplace':
        return renderMarketplace();
      case 'profile':
        return renderProfile();
      case 'admin':
        return renderAdmin();
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}