import { Direction } from '@mui/material'

import {
  Skin,
  Mode,
  AppBar,
  Footer,
  ContentWidth,
  VerticalNavToggle,
  HorizontalMenuToggle
} from 'src/@core/layouts/types'

type ThemeConfig = {
  skin: Skin
  mode: Mode
  appBar: AppBar
  footer: Footer
  navHidden: boolean
  appBarBlur: boolean
  direction: Direction
  templateName: string
  navCollapsed: boolean
  routingLoader: boolean
  disableRipple: boolean
  navigationSize: number
  navSubItemIcon: string
  menuTextTruncate: boolean
  contentWidth: ContentWidth
  disableCustomizer: boolean
  responsiveFontSizes: boolean
  collapsedNavigationSize: number
  horizontalMenuAnimation: boolean
  layout: 'vertical' | 'horizontal'
  verticalNavToggleType: VerticalNavToggle
  horizontalMenuToggle: HorizontalMenuToggle
  afterVerticalNavMenuContentPosition: 'fixed' | 'static'
  beforeVerticalNavMenuContentPosition: 'fixed' | 'static'
  toastPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

const themeConfig: ThemeConfig = {
  templateName: 'SOFF CRM',
  layout: 'horizontal',
  mode: 'light' as Mode,
  direction: 'ltr',
  skin: 'default',
  contentWidth: 'boxed',
  footer: 'static',

  routingLoader: true,

  navHidden: false,
  menuTextTruncate: true,
  navSubItemIcon: 'mdi:circle',
  verticalNavToggleType: 'accordion',
  navCollapsed: false,
  navigationSize: 260,
  collapsedNavigationSize: 68,
  afterVerticalNavMenuContentPosition: 'fixed',
  beforeVerticalNavMenuContentPosition: 'fixed',
  horizontalMenuToggle: 'hover',
  horizontalMenuAnimation: true,

  appBar: 'fixed',
  appBarBlur: true,

  // ** Other Configs
  responsiveFontSizes: true,
  disableRipple: false,
  disableCustomizer: false,
  toastPosition: 'top-center'
}

export default themeConfig
