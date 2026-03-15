import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'ar' || saved === 'en' ? saved : 'ar') as 'ar' | 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    i18n.changeLanguage(language)
    
    const html = document.documentElement
    html.lang = language
    html.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language, i18n])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }

  return { language, setLanguage, toggleLanguage }
}
