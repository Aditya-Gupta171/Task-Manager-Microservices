export interface IUser {
  id: number
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface IUserCreate {
  email: string
  password: string
  name: string
}
