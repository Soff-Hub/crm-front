import { useEffect, useState } from 'react'
import axios from 'axios'
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const ServerSideNavItems = () => {
  const [menuItems, setMenuItems] = useState<HorizontalNavItemsType>([])

  useEffect(() => {
    axios.get('/api/horizontal-nav/data').then(response => {
      const menuArray = response.data

      setMenuItems(menuArray)
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
