import { FC, Fragment, PropsWithChildren } from 'react'
import { ProtectedGuard, PublicGuard } from 'src/@core/components/auth'

type Props = {
  authGuard: boolean
  guestGuard: boolean
}

export const Guard: FC<PropsWithChildren<Props>> = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) return <PublicGuard>{children}</PublicGuard>
  if (authGuard) return <ProtectedGuard>{children}</ProtectedGuard>

  return <Fragment>{children}</Fragment>
}

Guard.displayName = 'Guard'
