import { useState } from 'react'
import { X, QrCode } from 'lucide-react'

export default function RechargeModal({ onClose, onRecharge }) {
  const [amount, setAmount] = useState(100)

  const handleRecharge = () => {
    if (amount > 0) {
      onRecharge(amount)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">充值 Beat币</h2>

        <div className="mb-6 text-center">
          <img src="/qr-recharge.png" alt="充值二维码" className="w-48 h-48 mx-auto rounded-lg mb-4" />
          <p className="text-gray-400 text-sm">请使用微信/支付宝扫描二维码充值</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">充值金额 (Beat币)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            min="1"
          />
        </div>

        <button
          onClick={handleRecharge}
          className="w-full btn-primary"
        >
          确认充值 {amount} Beat币
        </button>
      </div>
    </div>
  )
}


