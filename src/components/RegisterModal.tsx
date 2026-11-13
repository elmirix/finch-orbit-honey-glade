import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function RegisterModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Сохраняем имя в память браузера (если пустое, пишем "Студент")
    localStorage.setItem('click_user_name', name.trim() || 'Студент')
    onClose()
    navigate({ to: '/dashboard' }) 
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-navy border border-line-dark p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-mist transition-colors text-xl">✕</button>
        
        <h2 className="text-2xl font-semibold mb-6 text-center text-mist">Создать аккаунт</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate">Имя</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 bg-ink border border-line-dark text-mist rounded-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="Айгерим" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-ink border border-line-dark text-mist rounded-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="aigerim@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate">Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-ink border border-line-dark text-mist rounded-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-teal text-ink font-semibold py-3 rounded-full hover:brightness-105 transition-all mt-6">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  )
}