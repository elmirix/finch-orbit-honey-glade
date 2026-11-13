import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Page } from "@/components/ui"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string, email: string, joinedAt?: string } | null>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('click_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
        setEditName(parsed.name)
        setEditEmail(parsed.email)
      } catch (e) {
        navigate({ to: '/' })
      }
    } else {
      navigate({ to: '/' })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('click_user')
    navigate({ to: '/' })
  }

  const handleSave = () => {
    if (!user) return
    const updatedUser = { ...user, name: editName, email: editEmail }
    localStorage.setItem('click_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <Page className="pt-8 pb-20 md:pt-12">
      <div className="max-w-2xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard" className="text-slate hover:text-teal transition-colors text-sm font-medium mb-4 inline-block">
            ← Назад в кабинет
          </Link>
          <h1 className="text-3xl font-semibold text-mist">Мой профиль</h1>
        </motion.div>

        <div className="card p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-teal flex items-center justify-center text-4xl font-bold text-ink shadow-lg shadow-teal/20 uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-mist">{user.name}</h2>
              <p className="text-slate mt-1">{user.email}</p>
              <span className="inline-block mt-3 bg-ok/20 text-ok px-3 py-1 rounded-full text-xs font-semibold border border-ok/20">
                Бесплатный аккаунт
              </span>
            </div>
          </div>

          <div className="space-y-5 border-t border-line-dark pt-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate">Имя</label>
              {isEditing ? (
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 bg-ink border border-line-dark text-mist rounded-xl focus:ring-2 focus:ring-teal outline-none transition-all" />
              ) : (
                <div className="p-3 bg-ink/50 border border-transparent rounded-xl text-mist">{user.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate">Email</label>
              {isEditing ? (
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full p-3 bg-ink border border-line-dark text-mist rounded-xl focus:ring-2 focus:ring-teal outline-none transition-all" />
              ) : (
                <div className="p-3 bg-ink/50 border border-transparent rounded-xl text-mist">{user.email}</div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-line-dark flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="flex-1 bg-teal text-ink font-semibold py-3 rounded-xl hover:brightness-110 transition-all">
                  Сохранить
                </button>
                <button onClick={() => setIsEditing(false)} className="px-6 bg-line-dark text-mist font-semibold py-3 rounded-xl hover:bg-slate/20 transition-all">
                  Отмена
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex-1 bg-ink border border-line-dark text-mist font-semibold py-3 rounded-xl hover:border-teal transition-colors">
                Редактировать профиль
              </button>
            )}
          </div>
        </div>

        <button onClick={handleLogout} className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm">
          Выйти из аккаунта
        </button>
        
      </div>
    </Page>
  )
}