import { useState } from 'react'
import { Gift } from 'lucide-react'

export default function GiftButtons({ onGift, balance }) {
  const giftAmounts = [1, 5, 10, 50, 100]
  const [customAmount, setCustomAmount] = useState('')

  const handleCustomGift = () => {
    const amount = parseInt(customAmount)
    if (!isNaN(amount) && amount > 0) {
      onGift(amount)
      setCustomAmount('')
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-4">
      <h3 className="text-white font-medium mb-3">打赏 Beat币</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {giftAmounts.map(amount => (
          <button
            key={amount}
            onClick={() => onGift(amount)}
            disabled={balance < amount}
            className="glass-effect rounded-xl p-3 text-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="text-primary font-bold text-lg">{amount}</p>
            <p className="text-gray-400 text-sm">Beat币</p>
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="自定义金额"
          className="flex-1 bg-dark-200 border border-dark-400 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleCustomGift}
          disabled={!customAmount || parseInt(customAmount) <= 0 || balance < parseInt(customAmount)}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Gift size={20} />
        </button>
      </div>
    </div>
  )
}


