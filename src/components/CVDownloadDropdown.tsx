"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDownload, FiChevronDown, FiFileText } from 'react-icons/fi'

interface CVDownloadDropdownProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

const CVDownloadDropdown = ({ variant = 'primary', className = '' }: CVDownloadDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Reset focused index when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  const cvOptions = [
    {
      label: 'Türkçe CV',
      file: '/pdf/CV_TR.pdf',
      filename: 'Arslan_Kemal_Gunduz_CV_TR.pdf',
      gradient: 'from-blue-500 to-purple-500',
      hoverClass: 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
    },
    {
      label: 'English CV',
      file: '/pdf/CV_EN.pdf',
      filename: 'Arslan_Kemal_Gunduz_CV_EN.pdf',
      gradient: 'from-green-500 to-teal-500',
      hoverClass: 'hover:bg-gradient-to-r hover:from-green-600 hover:to-teal-600'
    }
  ]

  const buttonStyles = variant === 'primary'
    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500'
    : 'border border-gray-400 hover:border-blue-400 text-gray-300 hover:text-blue-400 bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500'

  const handleItemFocus = (index: number) => setFocusedIndex(index)
  const handleItemBlur = () => setFocusedIndex(-1)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${buttonStyles}`}
      >
        <FiDownload />
        CV İndir
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl z-50 overflow-hidden min-w-48 sm:min-w-52"
          >
            {cvOptions.map((option, index) => (
              <motion.a
                key={option.label}
                href={option.file}
                download={option.filename}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsOpen(false)}
                onFocus={() => handleItemFocus(index)}
                onBlur={handleItemBlur}
                className={`flex items-center gap-3 px-4 py-3 text-white ${option.hoverClass} focus:outline-none focus:bg-gray-700/50 transition-all duration-300 text-sm ${
                  focusedIndex === index ? 'bg-gray-700/50 ring-1 ring-cyan-500' : ''
                } ${index === 0 ? '' : 'border-t border-gray-700/50'}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${option.gradient} shrink-0`} />
                <FiFileText className="text-base shrink-0" />
                <span className="font-medium whitespace-nowrap">{option.label}</span>
                <FiDownload className="ml-auto text-gray-400 text-base shrink-0" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CVDownloadDropdown