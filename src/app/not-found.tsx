'use client'

import Link from 'next/link'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
            Aradığınız sayfa bulunamadı. Sayfa taşınmış, silinmiş olabilir veya yanlış bir URL girmiş olabilirsiniz.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <FiHome size={20} />
            Ana Sayfaya Dön
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
          >
            <FiArrowLeft size={20} />
            Geri Git
          </button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Hala sorun yaşıyorsanız, <Link href="/#contact" className="text-purple-400 hover:text-purple-300 underline">iletişime geçin</Link>.</p>
        </div>
      </div>
    </div>
  )
}