import { ReactNode } from 'react'

// Главная обертка для страниц (Page)
export function Page({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`relative w-full min-h-screen ${className}`}>
      {children}
    </div>
  )
}

// Базовая карточка (на случай, если используется в других файлах)
export function Card({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-[#0a192f]/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  )
}

// Базовая кнопка (на случай, если используется в других файлах)
export function Button({ children, className = "", onClick, type = "button" }: { children: ReactNode, className?: string, onClick?: () => void, type?: "button" | "submit" }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full bg-teal text-ink font-semibold hover:brightness-110 transition-all ${className}`}
    >
      {children}
    </button>
  )
}