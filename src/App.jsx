import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Top from './pages/Top'
import Wallet from './pages/Wallet'
import Login from './pages/Login'
import { Home as HomeIcon, Trophy, Wallet as WalletIcon } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const location = useLocation()

  useEffect(() => {
    // 检查本地存储的用户信息
    const savedUser = localStorage.getItem('beatmm_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setBalance(parseInt(localStorage.getItem('beatmm_balance') || '100'))
    }
  }, [])

  const updateBalance = (newBalance) => {
    setBalance(newBalance)
    localStorage.setItem('beatmm_balance', newBalance.toString())
  }

  if (!user) {
    return <Login onLogin={setUser} />
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
          <Route path="/" element={<Home balance={balance} updateBalance={updateBalance} />} />
          <Route path="/top" element={<Top />} />
          <Route path="/wallet" element={<Wallet balance={balance} updateBalance={updateBalance} />} />
        </Routes>
      </main>

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
    </div>
  )
}

export default App
