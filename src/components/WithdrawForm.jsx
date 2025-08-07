import { useState } from 'react'
import { X, Banknote, User, MessageSquare } from 'lucide-react'

export default function WithdrawForm({ balance, onClose, onWithdraw }) {
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0 || withdrawAmount > balance) {
      setMessage('提现金额无效或超出余额')
      return
    }
    if (!account || !name) {
      setMessage('提现账户和姓名不能为空')
      return
    }

    setLoading(true)
    setMessage('')

    // 模拟提现请求
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 假设提现成功
    onWithdraw(withdrawAmount)
    setMessage('提现请求已提交，请等待审核。')
    setLoading(false)
    onClose() // 提现成功后关闭弹窗
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">提现 Beat币</h2>

        <div className="mb-4">
          <p className="text-gray-400 text-center">当前余额: <span className="text-primary font-bold">{balance}</span> Beat币</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">提现金额</label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="输入提现金额"
                className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">提现账户 (支付宝/微信/银行卡)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="输入提现账户"
                className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">账户姓名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入账户姓名"
                className="w-full bg-dark-200 border border-dark-400 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {message && (
          <p className="text-center text-red-400 text-sm mb-4">{message}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !amount || !account || !name || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '提交中...' : '提交提现申请'}
        </button>
      </div>
    </div>
  )
}


