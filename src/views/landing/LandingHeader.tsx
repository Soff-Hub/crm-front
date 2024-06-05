import React, { CSSProperties, useEffect, useState } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from 'src/@core/landing/LanguageDropdown'

export default function LandingHeader() {

    const { i18n } = useTranslation()
    const [stickyHeader, setStickyHeader] = useState<boolean>(false)


    let headerStyles: CSSProperties = {
        padding: '10px 0',
        backdropFilter: 'blur(30px)',
        position: 'fixed',
        width: '100%',
        borderBottom: '1px solid',
        zIndex: 10000,
        backgroundColor: stickyHeader ? '#666CFF' : 'transparent',
        transition: 'all 0.3s ease'
    }


    useEffect(() => {
        window.addEventListener("scroll", sticky);
        return () => {
            window.removeEventListener("scroll", sticky);
        };
    });

    const sticky = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 680) {
            setStickyHeader(true)
        } else {
            setStickyHeader(false)
        }
    };


    return (
        <div style={headerStyles} id='header-sticky'>
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
                        />
                    </Link>
                    <div>
                        {/* {
                            i18n.language === 'uz' ? <span>RU</span> : <span>UZ</span>
                        } */}
                        <LanguageDropdown />
                    </div>
                </Box>
            </div>
        </div>
    )
}