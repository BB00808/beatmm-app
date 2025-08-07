import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react'

export default function AudioPlayer({ song, playlist, onSongChange }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = song.url
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [song.url])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
    setDuration(audioRef.current.duration)
  }

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value
    setCurrentTime(e.target.value)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const playNext = () => {
    const currentIndex = playlist.findIndex(s => s.url === song.url)
    const nextIndex = (currentIndex + 1) % playlist.length
    onSongChange(playlist[nextIndex])
  }

  const playPrevious = () => {
    const currentIndex = playlist.findIndex(s => s.url === song.url)
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    onSongChange(playlist[prevIndex])
  }

  return (
    <div className="glass-effect rounded-2xl p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      />
      <div className="flex items-center space-x-4">
        <img src={song.cover} alt={song.title} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="text-white font-medium text-lg truncate">{song.title}</p>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={playPrevious} className="text-white active:scale-95 transition-transform">
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlayPause} className="text-white active:scale-95 transition-transform">
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button onClick={playNext} className="text-white active:scale-95 transition-transform">
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-4"
        style={{ backgroundSize: `${(currentTime / duration) * 100}% 100%` }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <button onClick={toggleMute} className="text-white active:scale-95 transition-transform">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{ backgroundSize: `${(isMuted ? 0 : volume) * 100}% 100%` }}
        />
      </div>
    </div>
  )
}

