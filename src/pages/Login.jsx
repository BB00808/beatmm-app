import { useState } from 'react'
import { Phone, MessageSquare } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('phone') // 'phone' | 'code'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const sendCode = async () => {
    if (!phone || phone.length < 11) {
      setError('请输入有效的手机号码')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // 使用 Supabase Auth 发送 OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          shouldCreateUser: true
        }
      })

      if (error) {
        console.error('Error sending OTP:', error)
        setError('发送验证码失败，请重试')
      } else {
        setStep('code')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setError('发送验证码失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!code || code.length < 4) {
      setError('请输入验证码')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // 使用 Supabase Auth 验证 OTP
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: code,
        type: 'sms'
      })

      if (error) {
        console.error('Error verifying OTP:', error)
        setError('验证码错误或已过期')
      } else if (data.user) {
        // 登录成功，导航到首页
        navigate('/')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setError('验证失败，请重试')
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

        {step === 'phone' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              onClick={sendCode}
              disabled={!phone || phone.length < 11 || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '发送中...' : '获取验证码'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                验证码
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入验证码"
                  className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                验证码已发送至 {phone}
              </p>
            </div>

            <button
              onClick={verifyCode}
              disabled={!code || code.length < 4 || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '验证中...' : '登录'}
            </button>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-gray-400 text-sm"
            >
              返回修改手机号
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

