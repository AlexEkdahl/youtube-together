import { Request, Response } from 'express'

import { getAllRooms, getRoomByName, postRoom } from '../services'

interface IQueryProps {
  limit?: string
  page?: string
}

const apiGetAllRooms = async (req: Request, res: Response): Promise<void> => {
  const { limit, page }: IQueryProps = req.query
  const rooms = await getAllRooms({ limit, page })
  res.json(rooms)
}

const apiGetRoom = async (req: Request, res: Response): Promise<void> => {
  const name = req.params.id
  const room = await getRoomByName(name)
  res.json(room)
}

const apiPostRoom = async (req: Request, res: Response): Promise<void> => {
  await postRoom(req.body)
  res.status(200).json({ message: 'Ok!' })
}

const RoomController = { apiGetAllRooms, apiPostRoom, apiGetRoom }

export default RoomController
