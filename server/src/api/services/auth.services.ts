import { BadRequest } from '../../errors'
import { encrypt } from '../../util'
import { registerSchema, validate } from '../../validation'
import { User } from '../models'
import { IUser } from '../../interfaces'

export const loginUserService = async ({
  email,
  password
}: IUser): Promise<IUser> => {
  if (!email || !password) {
    throw new BadRequest('Missing params')
  }
  const user = await User.findOne({ email })
  if (!user || !user.matchesPassword(password)) {
    throw new BadRequest('Bad credentials')
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { password: pwd, createdAt, updatedAt, __v, ...userDTO } = user._doc
  return userDTO
}

export const registerUserService = async (body: IUser): Promise<IUser> => {
  await validate(registerSchema, body)
  const { username, password, email, color } = body

  const found = await User.exists({ email })
  if (found) {
    throw new BadRequest('Invalid email')
  }
  const user = new User({
    username,
    password: encrypt(password),
    email,
    color
  })

  const savedUser = await user.save()
  return savedUser
}

export const whoamiService = async (
  userId: string | undefined
): Promise<IUser | Partial<IUser>> => {
  try {
    const user = await User.findOne({ _id: userId })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { password, createdAt, updatedAt, __v, ...userDTO } = user._doc
    return { id: userDTO._id, ...userDTO }
  } catch (error) {
    return {}
  }
}
