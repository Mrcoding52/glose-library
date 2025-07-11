'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Calendar, Globe, Tag, User, Eye, Download } from 'lucide-react'
import { fetchBookDetails, Book } from '@/lib/api'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading details for book ID: ${bookId}`);
      const bookData = await fetchBookDetails(bookId);
      console.log(`Book details loaded successfully for ID: ${bookId}`);
      setBook(bookData);
    } catch (err) {
      setError('Impossible de charger les détails de ce livre.');
      console.error(`Error loading book details for ID: ${bookId}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`Book ID from URL: ${bookId}`); // Log pour vérifier l'ID du livre extrait de l'URL
    if (bookId) {
      loadBookDetails();
    } else {
      // Testez avec un ID codé en dur pour isoler le problème
      loadBookDetailsWithHardcodedId();
    }
  }, [bookId]);

  const loadBookDetailsWithHardcodedId = async () => {
    const hardcodedId = '5b27a9b016786c5a860f957e'; // Remplacez par un ID de livre valide
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading details for hardcoded book ID: ${hardcodedId}`);
      const bookData = await fetchBookDetails(hardcodedId);
      console.log(`Book details loaded successfully for hardcoded ID: ${hardcodedId}`);
      setBook(bookData);
    } catch (err) {
      setError('Impossible de charger les détails de ce livre.');
      console.error(`Error loading book details for hardcoded ID: ${hardcodedId}`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingSpinner text="Chargement du livre..." />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Livre non trouvé</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.back()} className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        </motion.div>
        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  )}

                  {/* Free Badge */}
                  {book.is_free && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Gratuit
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {book.can.access && (
                <Button className="w-full" size="lg">
                  <Eye className="h-4 w-4 mr-2" />
                  Lire le livre
                </Button>
              )}

              {book.can.print && (
                <Button variant="outline" className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              )}
            </div>
          </motion.div>
          {/* Book Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title and Authors */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>

              {book.authors.length > 0 && (
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <User className="h-5 w-5 mr-2" />
                  <span>
                    {book.authors.map(author => author.name).join(', ')}
                  </span>
                </div>
              )}
              {book.short_title && book.short_title !== book.title && (
                <p className="text-gray-500 mb-4">
                  Titre court : {book.short_title}
                </p>
              )}
            </div>
            {/* Description */}
            {book.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
            )}
            {/* Book Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {book.publisher && (
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Éditeur :</span>
                      <span className="font-medium">{book.publisher}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">ISBN :</span>
                      <span className="font-medium">{book.isbn}</span>
                    </div>
                  )}
                  {book.language && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Langue :</span>
                      <span className="font-medium">{book.language}</span>
                    </div>
                  )}
                  {book.form && (
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Format :</span>
                      <span className="font-medium uppercase">{book.form}</span>
                    </div>
                  )}
                  {book.extents?.gl_pages && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pages :</span>
                      <span className="font-medium">{book.extents.gl_pages}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
