// ** React Imports
import { useState, useEffect, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  children: ReactNode
}

const WindowWrapper = ({ children }: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        setWindowReadyFlag(true)
      }
   
    },

    [router.route]
  )

  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    return null
  }
}

export default WindowWrapper
