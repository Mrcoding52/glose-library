
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, BookOpen } from 'lucide-react';
import { Shelf } from '@/lib/api';
import Image from 'next/image';

interface ShelfCardProps {
  shelf: Shelf;
  index: number;
}

const ShelfCard: React.FC<ShelfCardProps> = ({ shelf, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <Link href={`/shelf/${shelf.id}`}>
        <div key={shelf.id} className="p-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {shelf.user.image ? (
                <Image 
                
                src={shelf.user.image}
                  alt={shelf.user.name}
                  className="w-10 h-10 rounded-full object-cover"

                >
                </Image>
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{shelf.user.name}</p>
              {shelf.slug && (
                <p className="text-sm text-gray-500">@{shelf.slug}</p>
              )}
            </div>
          </div>

          {/* Shelf Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {shelf.title}
          </h3>

          {/* Books Count */}
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>
              {shelf.booksCount ? `${shelf.booksCount} livres` : 'Étagère'}
            </span>
          </div>

          {/* Hover Arrow */}
          <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium">Voir les livres</span>
            <svg 
              className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ShelfCard;
