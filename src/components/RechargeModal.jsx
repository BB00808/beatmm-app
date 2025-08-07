import { useState } from 'react'
import { X, QrCode, CreditCard, Upload, Check } from 'lucide-react'
import { sendTelegramNotification, formatRechargeNotification } from './TelegramNotification'

export default function RechargeModal({ onClose, onRecharge }) {
  const [amount, setAmount] = useState(100)
  const [paymentMethod, setPaymentMethod] = useState('kpay') // 'kpay' or 'kbz'
  const [step, setStep] = useState(1) // 1: 选择方式, 2: 支付信息, 3: 确认
  const [paymentProof, setPaymentProof] = useState(null)
  const [kbzInfo, setKbzInfo] = useState({
    senderName: '',
    transactionId: '',
    transactionTime: ''
  })

  // 缅甸语金额显示
  const getMyanmarAmount = (beatCoins) => {
    const rate = 100 // 1 Beat币 = 100 缅币 (可配置)
    return beatCoins * rate
  }

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
    setStep(2)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPaymentProof(file)
    }
  }

  const handleKbzSubmit = () => {
    if (kbzInfo.senderName && amount > 0) {
      setStep(3)
    }
  }

  const handleKPaySubmit = () => {
    if (paymentProof) {
      setStep(3)
    }
  }

  const handleFinalConfirm = async () => {
    // 准备通知数据
    const notificationData = {
      method: paymentMethod,
      amount,
      myanmarAmount: getMyanmarAmount(amount),
      kbzInfo: paymentMethod === 'kbz' ? kbzInfo : null,
      timestamp: new Date().toISOString()
    }

    // 发送 Telegram 通知给管理员
    const message = formatRechargeNotification(notificationData)
    await sendTelegramNotification(message)

    // 这里应该发送到后端处理
    onRecharge(amount)
    
    console.log('Payment submitted for review:', {
      method: paymentMethod,
      amount,
      myanmarAmount: getMyanmarAmount(amount),
      proof: paymentProof,
      kbzInfo
    })
  }

  const renderPaymentMethodSelection = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">选择充值方式</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">充值金额</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="w-full bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          min="1"
        />
        <p className="text-gray-400 text-sm mt-1">
          约 {getMyanmarAmount(amount).toLocaleString()} 缅币
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handlePaymentMethodSelect('kpay')}
          className="w-full p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-medium flex items-center justify-between hover:from-green-700 hover:to-green-800 transition-all"
        >
          <div className="flex items-center space-x-3">
            <QrCode size={24} />
            <div className="text-left">
              <div className="font-bold">KPay 扫码支付</div>
              <div className="text-sm opacity-90">适合小额充值 (1,000-50,000 缅币)</div>
            </div>
          </div>
          <div className="text-sm">推荐</div>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('kbz')}
          className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-medium flex items-center justify-between hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <div className="flex items-center space-x-3">
            <CreditCard size={24} />
            <div className="text-left">
              <div className="font-bold">KBZ Pay 银行转账</div>
              <div className="text-sm opacity-90">适合大额充值 (50,000+ 缅币)</div>
            </div>
          </div>
          <div className="text-sm">安全</div>
        </button>
      </div>
    </div>
  )

  const renderKPayPayment = () => (
    <div className="space-y-4">
      <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm">
        ← 返回选择支付方式
      </button>
      
      <h2 className="text-xl font-bold text-white text-center">KPay 扫码支付</h2>
      
      <div className="bg-dark-200 rounded-xl p-4 text-center">
        <div className="text-lg font-bold text-white mb-2">
          充值金额: {amount} Beat币
        </div>
        <div className="text-gray-400 text-sm">
          约 {getMyanmarAmount(amount).toLocaleString()} 缅币
        </div>
      </div>

      <div className="text-center">
        <img 
          src="/kpay-qr.png" 
          alt="KPay 收款二维码" 
          className="w-48 h-48 mx-auto rounded-lg mb-4 bg-white p-2"
          onError={(e) => {
            e.target.src = "/qr-recharge.png" // 备用图片
          }}
        />
        <p className="text-gray-400 text-sm mb-4">
          请使用 KPay App 扫描上方二维码完成支付
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          上传支付截图 *
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="payment-proof"
          />
          <label
            htmlFor="payment-proof"
            className="w-full bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 text-gray-400 cursor-pointer hover:border-primary transition-colors flex items-center justify-center space-x-2"
          >
            <Upload size={20} />
            <span>{paymentProof ? paymentProof.name : '选择支付截图'}</span>
          </label>
        </div>
        {paymentProof && (
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <Check size={16} />
            <span>截图已上传</span>
          </div>
        )}
      </div>

      <button
        onClick={handleKPaySubmit}
        disabled={!paymentProof}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        提交充值申请
      </button>
    </div>
  )

  const renderKbzPayment = () => (
    <div className="space-y-4">
      <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm">
        ← 返回选择支付方式
      </button>
      
      <h2 className="text-xl font-bold text-white text-center">KBZ Pay 银行转账</h2>
      
      <div className="bg-dark-200 rounded-xl p-4">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-white mb-2">
            充值金额: {amount} Beat币
          </div>
          <div className="text-gray-400 text-sm">
            约 {getMyanmarAmount(amount).toLocaleString()} 缅币
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">收款账户:</span>
            <span className="text-white font-mono">09-123-456-789</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">户名:</span>
            <span className="text-white">BeatMM Myanmar</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">银行:</span>
            <span className="text-white">KBZ Bank</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-3">
        <p className="text-yellow-400 text-sm">
          ⚠️ 请确保转账金额准确，并在下方填写转账信息
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            您的姓名 *
          </label>
          <input
            type="text"
            value={kbzInfo.senderName}
            onChange={(e) => setKbzInfo({...kbzInfo, senderName: e.target.value})}
            className="w-full bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            placeholder="请输入转账人姓名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            交易号 (可选)
          </label>
          <input
            type="text"
            value={kbzInfo.transactionId}
            onChange={(e) => setKbzInfo({...kbzInfo, transactionId: e.target.value})}
            className="w-full bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            placeholder="KBZ Pay 交易号"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            转账时间 (可选)
          </label>
          <input
            type="datetime-local"
            value={kbzInfo.transactionTime}
            onChange={(e) => setKbzInfo({...kbzInfo, transactionTime: e.target.value})}
            className="w-full bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <button
        onClick={handleKbzSubmit}
        disabled={!kbzInfo.senderName}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        确认转账信息
      </button>
    </div>
  )

  const renderConfirmation = () => (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
        <Check size={32} className="text-white" />
      </div>
      
      <h2 className="text-xl font-bold text-white">充值申请已提交</h2>
      
      <div className="bg-dark-200 rounded-xl p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">支付方式:</span>
          <span className="text-white">{paymentMethod === 'kpay' ? 'KPay 扫码' : 'KBZ Pay 转账'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">充值金额:</span>
          <span className="text-white">{amount} Beat币</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">缅币金额:</span>
          <span className="text-white">{getMyanmarAmount(amount).toLocaleString()} 缅币</span>
        </div>
        {paymentMethod === 'kbz' && kbzInfo.senderName && (
          <div className="flex justify-between">
            <span className="text-gray-400">转账人:</span>
            <span className="text-white">{kbzInfo.senderName}</span>
          </div>
        )}
      </div>

      <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-3">
        <p className="text-blue-400 text-sm">
          💡 管理员将在 5-30 分钟内处理您的充值申请，请耐心等待
        </p>
      </div>

      <button
        onClick={handleFinalConfirm}
        className="w-full btn-primary"
      >
        完成
      </button>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <X size={24} />
        </button>
        
        {step === 1 && renderPaymentMethodSelection()}
        {step === 2 && paymentMethod === 'kpay' && renderKPayPayment()}
        {step === 2 && paymentMethod === 'kbz' && renderKbzPayment()}
        {step === 3 && renderConfirmation()}
      </div>
    </div>
  )
}


