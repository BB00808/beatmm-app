// Telegram 通知服务
export const sendTelegramNotification = async (message) => {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID
  
  if (!botToken || !chatId) {
    console.warn('Telegram 配置未完成')
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })

    if (response.ok) {
      console.log('Telegram 通知发送成功')
      return true
    } else {
      console.error('Telegram 通知发送失败:', response.statusText)
      return false
    }
  } catch (error) {
    console.error('Telegram 通知发送错误:', error)
    return false
  }
}

// 格式化充值通知消息
export const formatRechargeNotification = (data) => {
  const { method, amount, myanmarAmount, kbzInfo, timestamp } = data
  
  let message = `🔔 <b>新的充值申请</b>\n\n`
  message += `💰 <b>金额:</b> ${amount} Beat币 (${myanmarAmount?.toLocaleString()} 缅币)\n`
  message += `💳 <b>支付方式:</b> ${method === 'kpay' ? 'KPay 扫码支付' : 'KBZ Pay 银行转账'}\n`
  message += `⏰ <b>时间:</b> ${new Date(timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Yangon' })}\n`
  
  if (method === 'kbz' && kbzInfo) {
    message += `\n<b>转账信息:</b>\n`
    message += `👤 <b>转账人:</b> ${kbzInfo.senderName}\n`
    if (kbzInfo.transactionId) {
      message += `🔢 <b>交易号:</b> ${kbzInfo.transactionId}\n`
    }
    if (kbzInfo.transactionTime) {
      message += `📅 <b>转账时间:</b> ${kbzInfo.transactionTime}\n`
    }
  }
  
  message += `\n⚠️ <b>请及时处理充值申请</b>`
  
  return message
}

// 格式化大额打赏通知
export const formatGiftNotification = (data) => {
  const { amount, djName, userName, timestamp } = data
  
  let message = `🎁 <b>大额打赏提醒</b>\n\n`
  message += `💰 <b>金额:</b> ${amount} Beat币\n`
  message += `🎵 <b>DJ:</b> ${djName}\n`
  message += `👤 <b>打赏用户:</b> ${userName}\n`
  message += `⏰ <b>时间:</b> ${new Date(timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Yangon' })}\n`
  
  return message
}

// 格式化提现申请通知
export const formatWithdrawNotification = (data) => {
  const { amount, userName, method, accountInfo, timestamp } = data
  
  let message = `💸 <b>提现申请</b>\n\n`
  message += `💰 <b>金额:</b> ${amount} Beat币\n`
  message += `👤 <b>用户:</b> ${userName}\n`
  message += `💳 <b>提现方式:</b> ${method}\n`
  message += `📋 <b>账户信息:</b> ${accountInfo}\n`
  message += `⏰ <b>时间:</b> ${new Date(timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Yangon' })}\n`
  message += `\n⚠️ <b>请及时处理提现申请</b>`
  
  return message
}

