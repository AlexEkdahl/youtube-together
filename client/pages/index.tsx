import { GetServerSideProps } from 'next'

import { FlexContainerColumn } from '../components/Chat/Chat.styled'
import TeaserChatMessageList from '../components/Chat/ChatMessage.teaser'
import Header from '../components/Header'
import MaxWidthContainer from '../components/MaxWidthContainer'
import RoomSlider from '../components/RoomSlider'
import StartHero from '../components/StartHero'
import { MessageData } from '../state/SocketContext'
import { apiGetRandomMessages } from '../utils/api'

type Props = {
  messages: MessageData[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  let messages: MessageData[]

  try {
    messages = await apiGetRandomMessages({ random: 5 })
  } catch (error) {
    messages = []
  }

  return {
    props: {
      messages: messages
    }
  }
}

const Home = ({ messages }: Props) => {
  return (
    <>
      <StartHero />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MaxWidthContainer size="small">
          <FlexContainerColumn>
            <Header title={'Random messages'} />
            <RoomSlider />
            <Header title={'Random messages'} />
            <TeaserChatMessageList messages={messages} />
          </FlexContainerColumn>
        </MaxWidthContainer>
      </div>
    </>
  )
}

export default Home
