import { useState, useEffect } from 'react'
import { Wallet as WalletIcon, Plus, Minus, CreditCard, QrCode, History, Settings } from 'lucide-react'
import RechargeModal from '../components/RechargeModal'
import WithdrawForm from '../components/WithdrawForm'
import AdminPanel from '../components/AdminPanel'
import { supabase } from '../services/supabase'

export default function Wallet({ balance, updateBalance }) {
  const [showRecharge, setShowRecharge] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // 简单的管理员状态，实际应该从认证系统获取
  const [userBalance, setUserBalance] = useState(balance)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // 获取用户余额和交易记录
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 尝试从 user_balance 表获取余额
        const { data: balanceData, error: balanceError } = await supabase
          .from('user_balance')
          .select('balance')
          .eq('user_id', user.id)
          .single()

        if (balanceError && balanceError.code !== 'PGRST116') {
          console.error('Error fetching user balance:', balanceError)
        }

        // 如果有余额数据，使用数据库中的余额，否则使用传入的余额
        if (balanceData) {
          setUserBalance(balanceData.balance)
          updateBalance(balanceData.balance)
        } else {
          // 如果没有余额记录，创建一个
          const { error: insertError } = await supabase
            .from('user_balance')
            .insert({ user_id: user.id, balance: balance })

          if (insertError) {
            console.error('Error creating user balance:', insertError)
          }
        }

        // 获取交易记录
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (transactionError) {
          console.error('Error fetching transactions:', transactionError)
          // 使用模拟数据作为后备
          setTransactions(getMockTransactions())
        } else {
          setTransactions(transactionData || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setTransactions(getMockTransactions())
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [balance, updateBalance])

  const getMockTransactions = () => [
    { id: 1, type: 'gift', amount: -20, description: '打赏 夜的钢琴曲', created_at: '2024-01-15T14:30:00Z' },
    { id: 2, type: 'recharge', amount: +100, description: '充值', created_at: '2024-01-15T10:15:00Z' },
    { id: 3, type: 'gift', amount: -5, description: '打赏 Canon in D', created_at: '2024-01-14T22:45:00Z' },
    { id: 4, type: 'gift', amount: -100, description: '打赏 River Flows In You', created_at: '2024-01-14T20:20:00Z' },
    { id: 5, type: 'recharge', amount: +200, description: '充值', created_at: '2024-01-14T18:00:00Z' },
  ]

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'recharge':
        return <Plus className="text-green-400" size={20} />
      case 'gift':
        return <Minus className="text-red-400" size={20} />
      case 'withdraw':
        return <Minus className="text-orange-400" size={20} />
      default:
        return <CreditCard className="text-gray-400" size={20} />
    }
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* 头部 */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">我的钱包</h1>
        
        {/* 余额卡片 */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <WalletIcon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400">Beat币余额</p>
                <p className="text-3xl font-bold text-white">{userBalance}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <QrCode className="text-gray-400" size={24} />
              {isAdmin && (
                <button
                  onClick={() => setShowAdmin(true)}
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="管理员设置"
                >
                  <Settings size={24} />
                </button>
              )}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowRecharge(true)}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>充值</span>
            </button>
            <button 
              onClick={() => setShowWithdraw(true)}
              className="flex-1 bg-dark-300 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <Minus size={20} />
              <span>提现</span>
            </button>
          </div>
        </div>

        {/* 快捷充值 */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">快捷充值</h3>
          <div className="grid grid-cols-3 gap-3">
            {[50, 100, 200].map(amount => (
              <button
                key={amount}
                onClick={() => setShowRecharge(true)}
                className="glass-effect rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
              >
                <p className="text-primary font-bold text-lg">{amount}</p>
                <p className="text-gray-400 text-sm">Beat币</p>
              </button>
            ))}
          </div>
        </div>

        {/* 交易记录 */}
        <div>
          <h3 className="text-white font-medium mb-3">交易记录</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">加载交易记录...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="glass-effect rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-dark-300 flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{tx.description || tx.desc}</p>
                    <p className="text-gray-400 text-sm">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString('zh-CN') : tx.time}
                    </p>
                  </div>
                  <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} Beat币
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">暂无交易记录</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 临时管理员激活按钮 - 仅用于演示 */}
      {!isAdmin && (
        <div className="fixed bottom-20 right-4">
          <button
            onClick={() => setIsAdmin(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs"
          >
            激活管理员
          </button>
        </div>
      )}

      {showRecharge && (
        <RechargeModal 
          onClose={() => setShowRecharge(false)}
          onRecharge={(amount) => {
            updateBalance(balance + amount)
            setShowRecharge(false)
          }}
        />
      )}

      {showWithdraw && (
        <WithdrawForm 
          balance={balance}
          onClose={() => setShowWithdraw(false)}
          onWithdraw={(amount) => {
            updateBalance(balance - amount)
            setShowWithdraw(false)
          }}
        />
      )}

      {showAdmin && (
        <AdminPanel 
          isOpen={showAdmin}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}

