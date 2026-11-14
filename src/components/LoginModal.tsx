import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '../supabaseClient'

export function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim())
        .single()

      if (error || !data) {
        alert("Пользователь с таким Email не найден. Попробуйте зарегистрироваться.")
        return
      }

      const user = { name: data.name, email: data.email }
      localStorage.setItem('click_user', JSON.stringify(user))
      
      onClose()
      navigate({ to: '/dashboard' })
    } catch (err) {
      console.error(err)
      alert("Ошибка входа. Проверьте интернет.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Фон окна сделали чуть светлее, добавили рамку */}
      <div className="bg-[#0a192f] border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl">✕</button>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Вход в систему</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="w-full p-3.5 bg-[#020c1b] border border-gray-600 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" 
              placeholder="Введите ваш Email" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-teal text-black font-bold py-3.5 rounded-xl hover:brightness-110 transition-all mt-6 disabled:opacity-70 flex justify-center"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}