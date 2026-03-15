import { useEffect } from 'react'

interface KeyboardShortcuts {
  onNewSale?: () => void
  onNewClient?: () => void
  onPrint?: () => void
  onEscape?: () => void
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // N key - New Sale
      if (e.key === 'n' || e.key === 'N') {
        shortcuts.onNewSale?.()
      }

      // C key - Clients
      if (e.key === 'c' || e.key === 'C') {
        shortcuts.onNewClient?.()
      }

      // Ctrl+P - Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        shortcuts.onPrint?.()
      }

      // ESC - Close modal
      if (e.key === 'Escape') {
        shortcuts.onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
