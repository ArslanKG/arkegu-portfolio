"use client"

import { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  strings: string[]
  speed?: number
  deleteSpeed?: number
  delay?: number
  loop?: boolean
}

const TypewriterEffect = ({ 
  strings, 
  speed = 100, 
  deleteSpeed = 50, 
  delay = 1000,
  loop = true 
}: TypewriterEffectProps) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!strings || strings.length === 0) return
    
    const currentString = strings[currentIndex] || ''
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentString.length) {
          setCurrentText(currentString.slice(0, currentText.length + 1))
        } else {
          // Start deleting after delay
          setTimeout(() => setIsDeleting(true), delay)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentString.slice(0, currentText.length - 1))
        } else {
          // Move to next string
          setIsDeleting(false)
          if (loop) {
            setCurrentIndex((prev) => (prev + 1) % strings.length)
          }
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, strings, speed, deleteSpeed, delay, loop])

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className="font-mono">
      {currentText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        |
      </span>
    </span>
  )
}

export default TypewriterEffect