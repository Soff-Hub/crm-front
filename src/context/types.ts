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
  phone?:number,
  id?: number
  last_login?:string,
  gpa?:number,
  role: any,
  fullName?: string
  username?: string
  password?: string
  avatar?: string
  payment_page?: boolean
  balance?: number
  branches?: any[]
  active_branch?: any,
  qr_code?:string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: any | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  initAuth: () => void
}
