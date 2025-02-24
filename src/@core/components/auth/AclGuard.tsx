import { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import type { ACLObj, AppAbility } from 'src/configs/acl'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { buildAbilityFor } from 'src/configs/acl'
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'

type AclGuardProps = {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  const { aclAbilities, children, guestGuard } = props
  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)
  const auth = useAuth()
  const router = useRouter()

  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  if (auth.user && auth.user.role && !ability) {
    setAbility(buildAbilityFor(auth.user.role, aclAbilities.subject))
  }

  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
