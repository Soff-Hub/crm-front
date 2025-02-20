import { ReactNode } from 'react'
import { useAppSelector } from 'src/store'

export default function DisabledProvider({ children }: { children: ReactNode }) {
  const { isPageDisabled } = useAppSelector(state => state.page)

  return (
    <>
      {children}
      <div style={{ display: isPageDisabled ? 'block' : 'none' }} id='full-page-overlay'></div>
    </>
  )
}
