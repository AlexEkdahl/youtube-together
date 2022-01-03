import { useState } from 'react'

import { TextAreaInput } from '../inputs/TextAreaInput'
import ChatMessage from './ChatMessage'
import { StyledChat, MessageListContainer, ChatButton } from './Chat.styled'
import { useSockets } from '../../state/SocketContext'

type ChatProps = {
  room?: string | string[]
}

const Chat = ({ room }: ChatProps) => {
  const { socket, messages } = useSockets()
  const [message, setMessage] = useState('')

  const onClickHandler = () => {
    const obj = {
      room,
      message
    }
    socket.emit('chat', obj)
  }

  return (
    <StyledChat>
      <MessageListContainer>
        {messages?.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
      </MessageListContainer>
      <TextAreaInput
        name={'chat'}
        placeholder="Enter message..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
        }}
      />
      <ChatButton onClick={onClickHandler}>Send</ChatButton>
    </StyledChat>
  )
}

export default Chat
