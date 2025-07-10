'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import BookCard from '@/components/BookCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { fetchShelfBooks, fetchBooksWithPagination, Book } from '@/lib/api'

const BOOKS_PER_PAGE = 10

export default function ShelfDetailPage() {
  const params = useParams()
  const router = useRouter()
  const shelfId = params.id as string
  
  const [books, setBooks] = useState<Book[]>([])
  const [allBookIds, setAllBookIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [totalBooks, setTotalBooks] = useState(0)

  const filteredBooks = useMemo(() => {
  if (!searchQuery.trim()) return books;

  return books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors.some(author =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
}, [books, searchQuery]);


  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE)

  useEffect(() => {
    if (shelfId) {
      loadShelfBooks()
    }
  }, [shelfId])

  useEffect(() => {
    if (allBookIds.length > 0) {
      loadBooksForPage(currentPage)
    }
  }, [currentPage, allBookIds])

  const loadShelfBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const bookIds = await fetchShelfBooks(shelfId)
      setAllBookIds(bookIds)
      setTotalBooks(bookIds.length)
      setCurrentPage(1)
    } catch (err) {
      setError('Impossible de charger les livres de cette étagère.')
      console.error('Error loading shelf books:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadBooksForPage = async (page: number) => {
    try {
      setLoadingBooks(true)
      const { books: pageBooks } = await fetchBooksWithPagination(
        allBookIds,
        page,
        BOOKS_PER_PAGE
      )
      setBooks(pageBooks)
    } catch (err) {
      console.error('Error loading books for page:', err)
    } finally {
      setLoadingBooks(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }
  console.log(BookCard);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingSpinner text="Chargement des livres..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux étagères
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        showSearch={true} 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link 
            href="/"
            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux étagères
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Livres de l'étagère
          </h1>
          <p className="text-gray-600">
            {searchQuery ? (
              <>
                {filteredBooks.length} résultat{filteredBooks.length !== 1 ? 's' : ''} pour "{searchQuery}"
              </>
            ) : (
              <>
                {totalBooks} livre{totalBooks !== 1 ? 's' : ''} au total
              </>
            )}
          </p>
        </motion.div>

        {loadingBooks ? (
          <LoadingSpinner text="Chargement des livres..." />
        ) : filteredBooks.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8"
            >
              {filteredBooks.map((book, index) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  index={index}
                />
              ))}
            </motion.div>
            

            {!searchQuery && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loadingBooks}
                />
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">
              {searchQuery ? '🔍' : '📚'}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucun résultat trouvé' : 'Aucun livre dans cette étagère'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés.' 
                : 'Cette étagère semble être vide pour le moment.'
              }
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
