import { useState, useRef } from 'react'
import AudioPlayer from '../components/AudioPlayer'
import GiftButtons from '../components/GiftButtons'
import { Heart, Share, MessageCircle } from 'lucide-react'

export default function Home({ balance, updateBalance }) {
  const [currentSong, setCurrentSong] = useState({
    title: "夜的钢琴曲",
    artist: "石进",
    cover: "https://picsum.photos/400/400?random=1",
    url: "/demo-song.mp3"
  })
  
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(2847)

  const playlist = [
    {
      title: "夜的钢琴曲",
      artist: "石进",
      cover: "https://picsum.photos/400/400?random=1",
      url: "/demo-song.mp3"
    },
    {
      title: "Canon in D",
      artist: "Pachelbel",
      cover: "https://picsum.photos/400/400?random=2",
      url: "/demo-song.mp3"
    },
    {
      title: "River Flows In You",
      artist: "Yiruma",
      cover: "https://picsum.photos/400/400?random=3",
      url: "/demo-song.mp3"
    }
  ]

  const handleGift = (amount) => {
    if (balance >= amount) {
      updateBalance(balance - amount)
      // 这里可以添加动画效果
      console.log(`打赏 ${amount} Beat币`)
    }
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
      {/* 专辑封面区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm w-full">
          <div className="relative mb-8">
            <div className="w-72 h-72 mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentSong.title}
            </h2>
            <p className="text-gray-400 text-lg">
              {currentSong.artist}
            </p>
          </div>

          {/* 互动按钮 */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <button 
              onClick={toggleLike}
              className="flex flex-col items-center space-y-1 transition-transform active:scale-95"
            >
              <Heart 
                size={28} 
                className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
              <span className="text-xs text-gray-400">{likes}</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 transition-transform active:scale-95">
              <MessageCircle size={28} className="text-gray-400" />
              <span className="text-xs text-gray-400">186</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 transition-transform active:scale-95">
              <Share size={28} className="text-gray-400" />
              <span className="text-xs text-gray-400">分享</span>
            </button>
          </div>

          {/* 打赏按钮 */}
          <GiftButtons onGift={handleGift} balance={balance} />
        </div>
      </div>

      {/* 播放器 */}
      <div className="p-4">
        <AudioPlayer 
          song={currentSong}
          playlist={playlist}
          onSongChange={setCurrentSong}
        />
      </div>
    </div>
  )
}

