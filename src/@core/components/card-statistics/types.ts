// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { OptionsMenuType } from '../option-menu/types'

export type CardStatsHorizontalProps = {
  title: string
  stats: string
  icon: ReactNode
  color?: ThemeColor
  trendNumber?: string
  trend?: 'positive' | 'negative'
  id?: string,
  bgColor?:string
}

export type CardStatsVerticalProps = {
  title: string
  stats: string | undefined
  icon?: ReactNode
  chipText?: string
  color?: ThemeColor
  trendNumber?: string
  trend?: 'positive' | 'negative'
  optionsMenuProps?: OptionsMenuType
  id?: string
}

export type CardStatsCharacterProps = {
  src: string
  title: string
  stats: string
  chipText: string
  trendNumber?: string
  chipColor?: ThemeColor
  trend?: 'positive' | 'negative'
}

export type KanbarItemProps = {
  title: string
  id: any
  phone: string
  status: 'pending' | 'new' | 'success'
  is_view: boolean
  trend?: 'positive' | 'negative'
  handleEditLead?: any
  reRender?: any
  last_activity?: string
}
