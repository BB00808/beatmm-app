import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Top from './pages/Top'
import Wallet from './pages/Wallet'
import Login from './pages/Login'
import { Home as HomeIcon, Trophy, Wallet as WalletIcon } from 'lucide-react'
import { supabase } from './services/supabase'

function App() {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // 检查 Supabase 认证状态
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        // 从本地存储获取余额，或设置默认值
        setBalance(parseInt(localStorage.getItem('beatmm_balance') || '100'))
      }
      setLoading(false)
    }

    checkAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        setBalance(parseInt(localStorage.getItem('beatmm_balance') || '100'))
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setBalance(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateBalance = (newBalance) => {
    setBalance(newBalance)
    localStorage.setItem('beatmm_balance', newBalance.toString())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { path: '/', icon: HomeIcon, label: '播放' },
    { path: '/top', icon: Trophy, label: '排行' },
    { path: '/wallet', icon: WalletIcon, label: '钱包' }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />
          } />
          <Route path="/" element={
            user ? <Home balance={balance} updateBalance={updateBalance} /> : <Navigate to="/login" replace />
          } />
          <Route path="/top" element={
            user ? <Top /> : <Navigate to="/login" replace />
          } />
          <Route path="/wallet" element={
            user ? <Wallet balance={balance} updateBalance={updateBalance} /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </main>

      {user && (
        <nav className="glass-effect border-t border-white/10 px-4 py-2 safe-area-inset-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => (
              <a
                key={path}
                href={path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === path 
                    ? 'text-primary' 
                    : 'text-gray-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{label}</span>
              </a>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default App
