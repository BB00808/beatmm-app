import { useState } from 'react'
import { Wallet as WalletIcon, Plus, Minus, CreditCard, QrCode, History } from 'lucide-react'
import RechargeModal from '../components/RechargeModal'
import WithdrawForm from '../components/WithdrawForm'

export default function Wallet({ balance, updateBalance }) {
  const [showRecharge, setShowRecharge] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  
  const [transactions] = useState([
    { id: 1, type: 'gift', amount: -20, desc: '打赏 DJ_音乐人', time: '2024-01-15 14:30' },
    { id: 2, type: 'recharge', amount: +100, desc: '充值', time: '2024-01-15 10:15' },
    { id: 3, type: 'gift', amount: -5, desc: '打赏 DJ_夜猫', time: '2024-01-14 22:45' },
    { id: 4, type: 'gift', amount: -100, desc: '打赏 DJ_王者', time: '2024-01-14 20:20' },
    { id: 5, type: 'recharge', amount: +200, desc: '充值', time: '2024-01-14 18:00' },
  ])

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
                <p className="text-3xl font-bold text-white">{balance}</p>
              </div>
            </div>
            <QrCode className="text-gray-400" size={24} />
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
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="glass-effect rounded-xl p-4 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-dark-300 flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{tx.desc}</p>
                  <p className="text-gray-400 text-sm">{tx.time}</p>
                </div>
                <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} Beat币
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
    </div>
  )
}

