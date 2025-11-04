import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'marketplace', label: 'Маркет', icon: 'Store' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'admin', label: 'Админ', icon: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:top-0 md:bottom-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8 py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${
                currentPage === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={24} />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
