import { GetServerSideProps } from 'next'

import { FlexContainerColumn } from '../features/Chat/Chat.styled'
import TeaserChatMessageList from '../features/Chat/ChatMessage.teaser'
import Header from '../features/Header'
import MaxWidthContainer from '../components/MaxWidthContainer'
import { FlexWrapper } from '../features/RoomContent/RoomContent.styled'
import RoomSlider from '../features/RoomSlider'
import { NoRooms } from '../features/RoomSlider/RoomSlider.styled'
import StartHero from '../features/StartHero'
import { MessageData, Room } from '../types'
import { apiGetRandomMessages, apiGetRooms } from '../utils/api'

type Props = {
  messages: MessageData[]
  rooms: Room[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  let messages: MessageData[]
  let rooms: Room[]

  try {
    messages = await apiGetRandomMessages({ random: 5 })
    rooms = await apiGetRooms()
  } catch (error) {
    messages = []
    rooms = []
  }

  return {
    props: {
      messages,
      rooms
    }
  }
}

const Home = ({ messages, rooms }: Props) => {
  return (
    <>
      <StartHero />
      <FlexWrapper>
        <MaxWidthContainer size={'medium'}>
          <FlexContainerColumn>
            <Header title={'Selection of rooms'} />
            {rooms.length > 0 ? (
              <RoomSlider rooms={rooms} />
            ) : (
              <NoRooms>No rooms, go ahead and create one</NoRooms>
            )}
            <Header title={'Random messages'} />

            <MaxWidthContainer size={'medium'}>
              <FlexContainerColumn>
                <TeaserChatMessageList messages={messages} />
              </FlexContainerColumn>
            </MaxWidthContainer>
          </FlexContainerColumn>
        </MaxWidthContainer>
      </FlexWrapper>
    </>
  )
}

export default Home
