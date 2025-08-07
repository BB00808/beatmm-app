import { useState, useRef } from 'react'
import { Upload, Check, X, QrCode, Settings } from 'lucide-react'

export default function AdminPanel({ isOpen, onClose }) {
  const [kpayQR, setKpayQR] = useState(null)
  const [kbzAccount, setKbzAccount] = useState({
    accountNumber: '09-123-456-789',
    accountName: 'BeatMM Myanmar',
    bankName: 'KBZ Bank'
  })
  const [exchangeRate, setExchangeRate] = useState(100) // 1 Beat币 = 100 缅币
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef(null)

  const handleQRUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setKpayQR(e.target.result)
          setUploadStatus('KPay 二维码上传成功')
          // 这里应该上传到服务器
          console.log('KPay QR uploaded:', file.name)
        }
        reader.readAsDataURL(file)
      } else {
        setUploadStatus('请选择图片文件')
      }
    }
  }

  const handleSaveSettings = () => {
    // 保存设置到后端
    const settings = {
      kpayQR,
      kbzAccount,
      exchangeRate
    }
    console.log('Saving admin settings:', settings)
    setUploadStatus('设置已保存')
    
    // 这里应该调用 API 保存设置
    // await saveAdminSettings(settings)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <X size={24} />
        </button>
        
        <div className="flex items-center space-x-3 mb-6">
          <Settings size={28} className="text-primary" />
          <h2 className="text-2xl font-bold text-white">管理员设置</h2>
        </div>

        <div className="space-y-6">
          {/* KPay 二维码上传 */}
          <div className="bg-dark-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <QrCode size={20} />
              <span>KPay 收款二维码</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  上传新的 KPay 二维码
                </label>
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQRUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-primary hover:bg-primary/80 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Upload size={20} />
                    <span>选择二维码图片</span>
                  </button>
                  
                  {uploadStatus && (
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <Check size={16} />
                      <span>{uploadStatus}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  当前二维码预览
                </label>
                <div className="bg-white rounded-lg p-2 aspect-square flex items-center justify-center">
                  {kpayQR ? (
                    <img 
                      src={kpayQR} 
                      alt="KPay QR Code" 
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <QrCode size={48} className="mx-auto mb-2" />
                      <p className="text-sm">暂无二维码</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KBZ Pay 账户设置 */}
          <div className="bg-dark-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">KBZ Pay 收款账户</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  账户号码
                </label>
                <input
                  type="text"
                  value={kbzAccount.accountNumber}
                  onChange={(e) => setKbzAccount({...kbzAccount, accountNumber: e.target.value})}
                  className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="09-123-456-789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  账户名称
                </label>
                <input
                  type="text"
                  value={kbzAccount.accountName}
                  onChange={(e) => setKbzAccount({...kbzAccount, accountName: e.target.value})}
                  className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="BeatMM Myanmar"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  银行名称
                </label>
                <input
                  type="text"
                  value={kbzAccount.bankName}
                  onChange={(e) => setKbzAccount({...kbzAccount, bankName: e.target.value})}
                  className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="KBZ Bank"
                />
              </div>
            </div>
          </div>

          {/* 汇率设置 */}
          <div className="bg-dark-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">汇率设置</h3>
            
            <div className="grid md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  1 Beat币 = ? 缅币
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseInt(e.target.value))}
                  className="w-full bg-dark-300 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  min="1"
                />
              </div>
              
              <div className="text-gray-400 text-sm">
                <p>示例：100 Beat币 = {(100 * exchangeRate).toLocaleString()} 缅币</p>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex space-x-3">
            <button
              onClick={handleSaveSettings}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              保存所有设置
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-dark-300 hover:bg-dark-400 text-white rounded-xl font-medium transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

