import {
  useState,
  useRef,
  ChangeEvent,
  BaseSyntheticEvent,
  useEffect
} from 'react'
import ReactPlayer from 'react-player/lazy'

import VideoController from './VideoController'
import {
  VideoPlayer,
  ControlButton,
  VideoBoundary,
  VideoContainer
} from './Video.styled'
import { useSockets } from '../../state/SocketContext'
import NextImage from '../NextImage'
import play from '../../public/play.png'
import pause from '../../public/pause.png'
import { PlayItem } from '../Playlist'
import next from '../../public/next.png'
import previous from '../../public/previous.png'
import { apiSaveNewPlaylistOrder } from '../../utils/api'
import { ContentContainer } from './Video.styled'

type VideoProps = {
  room: string
}

export default function Video({ room }: VideoProps) {
  const { playlist, setPlaylist, socket, status, timestamp, setTimestamp } =
    useSockets()
  const [isPlaying, setIsPlaying] = useState(true)
  const ref = useRef<ReactPlayer>(null)
  const player = ref.current ? ref.current.getInternalPlayer() : undefined
  const urls = playlist?.map((item) => item.url)

  useEffect(() => {
    switch (status?.type) {
      case 'player':
        if (status?.event == 1) setIsPlaying(false)
        else if (status?.event == 2) setIsPlaying(true)
        status.timestamp && setTimestamp(status.timestamp)
        player && player.seekTo(status?.timestamp)
        break
      case 'time':
        status.timestamp && setTimestamp(status.timestamp)
        player && player.seekTo(status?.timestamp)
        break
    }
  }, [status])

  const handleStartStop = () => {
    setIsPlaying((prev) => !prev)
    const status = player?.getPlayerState()
    const event = status ?? 2

    const playerStatus = {
      room,
      status: {
        type: 'player',
        event: event === -1 ? 2 : event,
        timestamp
      }
    }
    socket?.emit('status', playerStatus)
  }

  const youtubeConfig = {
    youtube: {
      playerVars: {
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        loop: 0,
        controls: 0
      }
    }
  }

  const handleProgress = (e: { [key: string]: number }) => {
    setTimestamp(e.playedSeconds)
  }

  const handleTimestampChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTimestamp(Number(e.target.value))
    player && player.seekTo(e.target.value)
  }

  const handleBroadCastSync = (e: BaseSyntheticEvent): void => {
    socket?.emit('status', {
      room,
      status: { type: 'time', timestamp: e.target.value }
    })
  }

  const handleUserVideoChange = async (value: string) => {
    if (!playlist || playlist.length < 2 || !player) return

    const item = value === 'next' ? playlist[0] : playlist[playlist.length - 1]
    setPlaylist((old) => sortPlaylist(old, value))

    await apiSaveNewPlaylistOrder(room, {
      ...item,
      position: value === 'next' ? playlist.length : 0
    })

    // emit new order

    player.nextVideo()
  }

  function sortPlaylist(previousList: PlayItem[], event: string) {
    let newList: PlayItem[]
    if (event === 'next') {
      newList = [...previousList]
      const item = newList.shift()
      item && newList.push(item)
    } else {
      newList = [...previousList]
      const item = newList.pop()
      item && newList.unshift(item)
    }
    return newList
  }

  if (player) player.allowFullscreen = 0
  return (
    <ContentContainer>
      <VideoBoundary>
        <VideoContainer>
          <VideoPlayer
            url={urls}
            ref={ref}
            playing={isPlaying}
            config={youtubeConfig}
            onProgress={handleProgress}
            width={'100%'}
            height={'100%'}
          />
        </VideoContainer>
      </VideoBoundary>

      {/* {!isPlaying && (
          <PauseOverlay>The host has paused this video</PauseOverlay>
        )} */}
      <div>
        <VideoController
          duration={player?.getDuration ? player.getDuration() : 100}
          currentTimestamp={timestamp}
          onChange={handleTimestampChange}
          syncTimestamp={handleBroadCastSync}
        />
        <ControlButton onClick={handleStartStop}>
          {isPlaying ? (
            <NextImage src={pause} width={30} height={30} />
          ) : (
            <NextImage src={play} width={30} height={30} />
          )}
        </ControlButton>
        <ControlButton
          value={'previous'}
          onClick={() => handleUserVideoChange('previous')}
        >
          <NextImage height={30} width={30} src={previous} />
        </ControlButton>
        <ControlButton
          value={'next'}
          onClick={() => handleUserVideoChange('next')}
        >
          <NextImage height={30} width={30} src={next} />
        </ControlButton>
      </div>
    </ContentContainer>
  )
}
