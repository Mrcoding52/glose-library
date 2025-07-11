
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Book } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, index }) => {
  const displayPrice = book.price ? `${book.price}€` : 'Gratuit';
  const displayRating = book.averageRating ? book.averageRating.toFixed(1) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <Link href={`/book/${book.id}`}>
      <div key={book.id} className="relative">
        {/* Book Cover */}
        <div className="aspect-[3/4] relative bg-gray-100">
          {book.image ? (
            <Image
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
              </Image>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-lg">📚</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">Pas de couverture</p>
              </div>
            </div>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            book.price 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-gray-900'
          }`}>
            {displayPrice}
          </div>
        </div>

        {/* Rating Badge */}
        {displayRating && (
          <div className="absolute top-2 left-2">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-3 w-3 text-secondary fill-current" />
              <span className="text-xs font-medium text-gray-900">{displayRating}</span>
            </div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        
        {book.authors && book.authors.length > 0 && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {book.authors.join(', ')}
          </p>
        )}

        {book.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}
      </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
