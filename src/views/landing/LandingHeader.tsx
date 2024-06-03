import React from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function LandingHeader() {

    const { i18n } = useTranslation()

    return (
        <div style={{ backgroundColor: '#2d3945', padding: '10px 0' }}>
            <div className="container">
                <Box sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Link href={'/'}>
                        <Image
                            alt='logo'
                            src={'https://soffstudy.uz/assets/imgs/page/logo/Soff%20Study%20white%20logo.png'}
                            width={170}
                            height={40}
                        /></Link>
                    <div>
                        {
                            i18n.language === 'uz' ? <span>RU</span> : <span>UZ</span>
                        }
                    </div>
                </Box>
            </div>
        </div>
    )
}