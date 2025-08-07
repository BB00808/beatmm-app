import { useState, useEffect } from 'react'
import { Trophy, Crown, Medal } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function Top() {
  const [topList, setTopList] = useState([])
  const [timeRange, setTimeRange] = useState('week') // 'week' | 'month' | 'all'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopList = async () => {
      setLoading(true)
      try {
        // 根据时间范围构建查询条件
        let query = supabase
          .from('donations')
          .select('song_name, sum(amount) as total')
          .group('song_name')
          .order('total', { ascending: false })
          .limit(10)

        // 根据时间范围添加过滤条件
        if (timeRange === 'week') {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          query = query.gte('created_at', weekAgo.toISOString())
        } else if (timeRange === 'month') {
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          query = query.gte('created_at', monthAgo.toISOString())
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching top list:', error)
          // 使用模拟数据作为后备
          setTopList(getMockData())
        } else if (data && data.length > 0) {
          // 转换数据格式
          const formattedData = data.map((item, index) => ({
            rank: index + 1,
            name: item.song_name,
            amount: item.total || 0,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.song_name}`
          }))
          setTopList(formattedData)
        } else {
          // 如果没有数据，使用模拟数据
          setTopList(getMockData())
        }
      } catch (error) {
        console.error('Error fetching top list:', error)
        setTopList(getMockData())
      } finally {
        setLoading(false)
      }
    }

    fetchTopList()
  }, [timeRange])

  const getMockData = () => [
    { rank: 1, name: '夜的钢琴曲', amount: 15200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    { rank: 2, name: 'Canon in D', amount: 12800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { rank: 3, name: 'River Flows In You', amount: 9600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    { rank: 4, name: '天空之城', amount: 7400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    { rank: 5, name: '梦中的婚礼', amount: 6200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />
      case 2:
        return <Trophy className="text-gray-400" size={24} />
      case 3:
        return <Medal className="text-orange-400" size={24} />
      default:
        return <span className="text-gray-500 font-bold text-lg w-6 text-center">{rank}</span>
    }
  }

  const timeRanges = [
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' },
    { key: 'all', label: '总榜' }
  ]

  return (
    <div className="flex flex-col h-full bg-black">
      {/* 头部 */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-6">打赏排行榜</h1>
        
        {/* 时间选择 */}
        <div className="flex bg-dark-200 rounded-full p-1">
          {timeRanges.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                timeRange === key
                  ? 'bg-primary text-white'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">加载排行榜...</p>
          </div>
        </div>
      ) : (
        <>
          {/* 前三名特殊展示 */}
          {topList.length >= 3 && (
            <div className="px-6 mb-6">
              <div className="flex justify-center items-end space-x-4">
                {topList.slice(0, 3).map((item, index) => (
                  <div key={item.rank} className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
                    <div className={`relative ${index === 0 ? 'w-20 h-20' : 'w-16 h-16'}`}>
                      <img 
                        src={item.avatar} 
                        alt={item.name}
                        className="w-full h-full rounded-full border-2 border-yellow-400"
                      />
                      <div className={`absolute -top-2 -right-2 ${index === 0 ? 'w-8 h-8' : 'w-6 h-6'} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center`}>
                        {getRankIcon(item.rank)}
                      </div>
                    </div>
                    <p className="text-white font-medium mt-2 text-sm">{item.name}</p>
                    <p className="text-primary text-xs">{item.amount} 币</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 排行列表 */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 px-6">
              {topList.map((item) => (
                <div key={item.rank} className="glass-effect rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(item.rank)}
                  </div>
                  
                  <img 
                    src={item.avatar} 
                    alt={item.name}
                    className="w-12 h-12 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">收到打赏</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-primary font-bold">{item.amount}</p>
                    <p className="text-gray-400 text-xs">Beat币</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-20" /> {/* 底部安全区域 */}
          </div>
        </>
      )}
    </div>
  )
}

