'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchUserShelves, Shelf } from '@/lib/api'
import Header from '@/components/Header'
import ShelfCard from '@/components/ShelfCard'
import LoadingSpinner from '@/components/LoadingSpinner'

const DEMO_USER_ID = '5a8411b53ed02c04187ff02a'

export default function HomePage() {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadShelves()
  }, [])

  const loadShelves = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchUserShelves(DEMO_USER_ID)
      setShelves(data)
    } catch (err) {
      setError('Impossible de charger les étagères. Veuillez réessayer.')
      console.error('Error loading shelves:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingSpinner text="Chargement des étagères..." />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oups ! Une erreur s\'est produite</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadShelves}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez des 
            <span className="text-primary"> étagères </span>
            de livres
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez les collections de livres partagées par notre communauté de lecteurs passionnés.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary mb-2">{shelves.length}</div>
            <div className="text-gray-600">Étagères disponibles</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-secondary mb-2">∞</div>
            <div className="text-gray-600">Livres à découvrir</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary mb-2">1</div>
            <div className="text-gray-600">Communauté active</div>
          </div>
        </motion.div>

        {shelves.length > 0 ? (
          <>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-8"
            >
              Étagères de livres ({shelves.length})
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelves.map((shelf, index) => (
                <ShelfCard 
                  key={shelf.id} 
                  shelf={shelf} 
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucune étagère trouvée
            </h3>
            <p className="text-gray-600">
              Il semble qu\'il n\'y ait pas d\'étagères disponibles pour le moment.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
