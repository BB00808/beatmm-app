import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true) // true: 登录, false: 注册
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAuth = async () => {
    if (!email || !password) {
      setError('请输入邮箱和密码')
      return
    }

    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6位')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        // 登录
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        })

        if (error) {
          console.error('Error signing in:', error)
          setError('登录失败，请检查邮箱和密码')
        } else if (data.user) {
          // 登录成功，导航到首页
          navigate('/')
        }
      } else {
        // 注册
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              nickname: `DJ_${email.split('@')[0]}`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            }
          }
        })

        if (error) {
          console.error('Error signing up:', error)
          setError('注册失败，请重试')
        } else if (data.user) {
          // 注册成功，自动登录
          navigate('/')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError(isLogin ? '登录失败，请重试' : '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">B</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BeatMM</h1>
          <p className="text-gray-400">音乐打赏平台</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* 登录/注册切换 */}
          <div className="flex bg-dark-200 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-primary text-white'
                  : 'text-gray-400'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-primary text-white'
                  : 'text-gray-400'
              }`}
            >
              注册
            </button>
          </div>

          {/* 邮箱输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* 密码输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? '请输入密码' : '请设置密码（至少6位）'}
                className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            onClick={handleAuth}
            disabled={!email || !password || loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isLogin ? '登录中...' : '注册中...') : (isLogin ? '登录' : '注册')}
          </button>

          {/* 提示信息 */}
          {!isLogin && (
            <p className="text-xs text-gray-400 text-center">
              注册即表示您同意我们的服务条款和隐私政策
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

