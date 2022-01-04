import { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

import { User } from './GlobalState'

type Context = {
  socket: Socket
  username?: string
  messages?: MessageData[]
  setMessages: (data: MessageData) => void
  roomId?: string
  rooms: object
}

export type MessageData = {
  username: string
  message: string
  timestamp: number
  id?: string
  color?: string
  room?: string
}

type RoomStateData = {
  messages: MessageData[]
  users: User[]
}

const socket = io('http://localhost:8080')

const SocketContext = createContext<Context>({
  socket,
  setMessages: () => null,
  rooms: {},
  messages: []
})

function SocketsProvider(props: any) {
  const [messages, setMessages] = useState<MessageData[]>([])

  useEffect(() => {
    socket.on('chat', (data: MessageData) => {
      setMessages((messages) => [...messages, data])
    })
    socket.on('state', (data: RoomStateData) => {
      console.log('data', data)
      setMessages((messages) => [...messages, ...data.messages])
    })
  }, [socket])

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        setMessages
      }}
      {...props}
    />
  )
}

export const useSockets = () => useContext(SocketContext)

export default SocketsProvider