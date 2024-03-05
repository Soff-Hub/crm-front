// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import api from 'src/@core/utils/api'

import authConfig from 'src/configs/auth'
import { useEffect, useState } from 'react'


const BranchDropdown = () => {
    // ** Hook
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)

    const getProfile = async () => {
        try {
            const resp = await api.get(authConfig.meEndpoint)
            setProfile(resp.data)

        } catch (err) {
            console.log(err);
        }
    }



    const handleLangItemClick = async (id: number) => {
        try {
            if (profile.active_branch.branch !== id) {
                await api.post('auth/branch-update/', { branch: id })
                router.push('/')
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <OptionsMenu
            icon={<Typography>{profile ? profile.branches.find((el: any) => el.id === profile.active_branch.branch)?.name : " "} <Icon icon='ep:arrow-down-bold' fontSize={12} /></Typography>}
            options={
                profile ? profile?.branches.filter((item: any) => item.exists === true).map((el: any) => (
                    {
                        text: el.name,
                        menuItemProps: {
                            sx: { py: 2 },
                            selected: el.id === profile.active_branch.branch,
                            onClick: () => {
                                handleLangItemClick(el.id)
                            }
                        }
                    }
                )) :
                    []
            }
        />
    )
}

export default BranchDropdown
