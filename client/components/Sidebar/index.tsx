import { useState } from 'react'

import {
  Button,
  ButtonContainer,
  Container,
  UsersButton
} from './Sidebar.styled'
import ActiveUsers from '../ActiveUsers/index'
import { User } from '../../state/GlobalState'
import Playlist from '../Playlist'
import { PlaylistContainer } from '../Playlist/Playlist.styled'
import { PlaylistItemData } from '../../types'
import { useSockets } from '../../state/SocketContext'

type SidebarProp = {
  users: User[] | undefined
  onEndDrag: (
    item: PlaylistItemData | undefined,
    playlist: PlaylistItemData[]
  ) => Promise<void>
  onVideoAdd: (item: PlaylistItemData) => Promise<boolean>
}

function Sidebar({ users, onEndDrag, onVideoAdd }: SidebarProp) {
  const [display, setDisplay] = useState(true)
  const { playlist, setPlaylist } = useSockets()
  return (
    <Container>
      <ButtonContainer>
        <UsersButton onClick={() => setDisplay(true)}>Users</UsersButton>
        <Button onClick={() => setDisplay(false)}>Playlist</Button>
      </ButtonContainer>
      {display && <ActiveUsers users={users} />}
      {!display && playlist && (
        <PlaylistContainer>
          <Playlist
            onVideoAdd={onVideoAdd}
            playlist={playlist}
            setPlaylist={setPlaylist}
            onEndDrag={onEndDrag}
          />
        </PlaylistContainer>
      )}
    </Container>
  )
}

export default Sidebar
