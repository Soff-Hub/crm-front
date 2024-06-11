import React, { CSSProperties, useEffect, useState } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from 'src/@core/landing/LanguageDropdown'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import toast from 'react-hot-toast'

export default function LandingHeader() {

    const { i18n } = useTranslation()
    const [stickyHeader, setStickyHeader] = useState<boolean>(false)
    const { isMobile } = useResponsive()


    let headerStyles: CSSProperties = {
        padding: '10px 0',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        position: 'fixed',
        width: '100%',
        borderBottom: !stickyHeader ? '1px solid' : '1px solid white',
        zIndex: 10000,
        backgroundColor: stickyHeader ? '#FFFFFF' : 'transparent',
        transition: 'all 0.3s ease',
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
                    justifyContent: 'unset'
                }}>
                    <Link href={'/'}>
                        <Image
                            alt='logo'
                            src={'https://soffstudy.uz/assets/imgs/page/logo/Soff%20Study%20white%20logo.png'}
                            width={isMobile ? 100 : 170}
                            style={{ height: 'auto' }}
                            height={40}
                        />
                    </Link>
                    {!isMobile && <div style={{ marginLeft: 'auto', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                        <IconifyIcon icon="ic:twotone-phone" style={{ color: stickyHeader ? 'black' : 'white', fontSize: isMobile ? '14px' : '22px' }} />
                        <a href='tel:+998931231177' style={{ color: stickyHeader ? 'black' : 'white', fontSize: isMobile ? '12px' : '16px', textDecoration: 'none' }}>+998 71 311 32 32</a>
                    </div>}
                    <div style={{ marginLeft: isMobile ? 'auto' : 0 }}>
                        <LanguageDropdown sticky={stickyHeader} />
                    </div>
                </Box>
            </div>
        </div>
    )
}