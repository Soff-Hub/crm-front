// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Typography } from '@mui/material'
import api from 'src/@core/utils/api'

import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'


const BranchDropdown = () => {
    // ** Hook
    const { user, initAuth } = useContext(AuthContext)


    const handleLangItemClick = async (id: number) => {
        try {
            if (user?.active_branch !== id) {
                await api.post('auth/branch-update/', { branch: id })
                await initAuth()
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        user && user?.branches ? <OptionsMenu
            iconButtonProps={{ sx: { borderRadius: '5px' } }}
            icon={<Typography>{user?.branches.find((el: any) => Number(el.id) === Number(user.active_branch))?.name} <Icon icon='ep:arrow-down-bold' fontSize={12} /></Typography>}
            options={
                user?.branches.filter((item: any) => item.exists === true).map((el: any) => (
                    {
                        text: el.name,
                        menuItemProps: {
                            sx: { py: 2 },
                            selected: Number(el.id) === Number(user.active_branch),
                            onClick: () => {
                                handleLangItemClick(el.id)
                            }
                        }
                    }
                ))
            }
        /> : <></>
    )
}

export default BranchDropdown
