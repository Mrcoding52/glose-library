
import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery = '', 
  onSearchChange, 
  showSearch = false 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/"  className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">Glose Library</span>
          </Link>

          {/* Search Bar */}
          {showSearch && onSearchChange && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher le livre d'un auteur..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Accueil
            </Link>
            <button className="bg-secondary text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
              Se connecter
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
