import {
  useState,
  useRef,
  ChangeEvent,
  BaseSyntheticEvent,
  useEffect,
  useContext
} from 'react'
import ReactPlayer from 'react-player'

import VideoController from './ProgressBar'
import {
  VideoPlayer,
  ControlButton,
  VideoBoundary,
  VideoContainer,
  ButtonPanelContainer,
  ControlPanelContainer,
  PauseOverlay,
  StyledDiv,
  ContentContainer
} from './Video.styled'
import { useSockets } from '../../state/SocketContext'
import NextImage from '../../components/NextImage'
import play from '../../public/play.png'
import pause from '../../public/pause.png'
import next from '../../public/next.png'
import previous from '../../public/previous.png'
import { apiSaveNewPlaylistOrder } from '../../utils/api'
import VolumeController from './VolumeController'
import { GlobalContext } from '../../state/GlobalState'
import { PlaylistItemData, User } from '../../types'

type VideoProps = {
  room: string
  user: User | null
}

export default function Video({ room, user }: VideoProps) {
  const {
    playlist,
    socket,
    status,
    timestamp,
    itemToMove,
    setTimestamp,
    setPlaylist,
    updatePlaylistOrder,
    host
  } = useSockets()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFadingIn, setIsFadingIn] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [urlPlaying, setUrlPlaying] = useState<PlaylistItemData>({
    url: '',
    _id: '',
    title: ''
  })
  const ref = useRef<ReactPlayer>(null)
  const player = ref.current ? ref.current.getInternalPlayer() : undefined

  const { state } = useContext(GlobalContext)
  const [reorderPlaylistTimeout, setReorderPlaylistTimeout] = useState<
    NodeJS.Timeout | undefined
  >()

  useEffect(() => {
    isFadingIn && setIsPlaying(false)
  }, [isFadingIn])

  function handleAnimationEnd() {
    !isFadingIn && setIsPlaying(true)
  }

  function reorderPlaylist() {
    const { item, newIndex } = itemToMove

    if (!item || !playlist || typeof newIndex === 'undefined') return

    const newPlaylist = [...playlist.filter((it) => it._id !== item._id)]
    newPlaylist.splice(newIndex, 0, item)
    setPlaylist(newPlaylist)
  }

  useEffect(() => {
    if (!playlist || playlist.length < 1) return
    if (urlPlaying._id !== playlist?.[0]._id) {
      setUrlPlaying(playlist?.[0])
      setIsPlaying(true)
    }
  }, [playlist])

  useEffect(() => {
    if (!status) return
    switch (status.type) {
      case 'player':
        if (status.event == 1) {
          setIsFadingIn(true)
          player?.pauseVideo()
        } else if (status.event == 2) {
          setIsFadingIn(false)
          player?.playVideo()
        }
        status.timestamp && setTimestamp(status.timestamp)
        player?.seekTo && player.seekTo(status?.timestamp)
        break
      case 'time':
        status.timestamp && setTimestamp(status.timestamp)
        player?.seekTo && player.seekTo(status.timestamp)
        break
    }
  }, [status])

  useEffect(() => {
    reorderPlaylist()
  }, [itemToMove])

  useEffect(() => {
    reorderPlaylistTimeout && clearTimeout(reorderPlaylistTimeout)
    setReorderPlaylistTimeout(
      setTimeout(() => {
        socket?.emit('playlist', {
          type: 'movedItem',
          room,
          movedItemInfo: state.movedItemInfo
        })
      }, 300)
    )
  }, [state.movedItemInfo])

  const handleStartStop = () => {
    isPlaying ? player?.pauseVideo() : player?.playVideo()
    setIsPlaying((prev) => !prev)
    setIsFadingIn((prev) => !prev)

    const playerStatus = {
      room,
      status: {
        type: 'player',
        event: isPlaying ? 1 : 2,
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

  const handleUserVideoChange = async (value: 'next' | 'previous') => {
    if (user?.username !== host && state.defaultUsername !== host) {
      setIsGuest(true)
      setTimeout(() => {
        setIsGuest(false)
      }, 2000)
      return
    }
    if (!playlist || playlist.length < 2 || !player) return

    const item = value === 'next' ? playlist[0] : playlist[playlist.length - 1]

    await apiSaveNewPlaylistOrder(room, {
      ...item,
      position: value === 'next' ? playlist.length : 0
    })

    updatePlaylistOrder(value)
    socket?.emit('playlist', {
      type: value,
      room
    })

    player.nextVideo()
  }

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
  }

  const autoPlayNextVideo = async () => {
    if (!playlist || playlist?.length < 2) return
    if (user?.username !== host && state.defaultUsername !== host) return

    await apiSaveNewPlaylistOrder(room, {
      ...urlPlaying,
      position: playlist.length
    })

    socket?.emit('playlist', {
      type: 'autoPlay',
      room
    })
  }
  if (player) player.allowFullscreen = 0

  return (
    <ContentContainer>
      <VideoBoundary>
        <VideoContainer>
          {urlPlaying && (
            <VideoPlayer
              url={urlPlaying.url}
              ref={ref}
              playing={true}
              config={youtubeConfig}
              onProgress={handleProgress}
              width={'100%'}
              height={'100%'}
              volume={volume}
              mute={`${isMuted}`}
              onEnded={autoPlayNextVideo}
              onPlay={() => setIsMuted(false)}
            />
          )}
          {!isPlaying && (
            <PauseOverlay
              onAnimationEnd={handleAnimationEnd}
              isFadingIn={isFadingIn}
            >
              The video has been paused...
            </PauseOverlay>
          )}
        </VideoContainer>
      </VideoBoundary>
      <ControlPanelContainer>
        <VideoController
          duration={player?.getDuration ? player.getDuration() : 100}
          currentTimestamp={timestamp}
          onChange={handleTimestampChange}
          syncTimestamp={handleBroadCastSync}
        />
        <ButtonPanelContainer>
          <div>
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
          <div>
            <VolumeController
              setVolume={setVolume}
              volume={volume}
              handleVolumeChange={handleVolumeChange}
            />
          </div>
        </ButtonPanelContainer>
        {isGuest ? (
          <StyledDiv>Only host can change video</StyledDiv>
        ) : (
          <StyledDiv />
        )}
      </ControlPanelContainer>
    </ContentContainer>
  )
}
