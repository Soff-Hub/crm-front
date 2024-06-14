export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  phone: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  phone: string
  username: string
  password: string
}

export type UserDataType = {
  id: number
  role: string[]
  fullName: string
  username: string
  password: string
  avatar: string,
  balance?: number
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
