import { Button } from '@mui/material'
import React from 'react'


export default function LandingFooter() {
    return (
        <footer className='site-footer' style={{ background: 'rgb(20, 20, 21)', color: 'white', padding: '50px 0' }}>
            <div className="container">
                <div className="footer-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '24px' }}>
                        SOFF CRM
                    </p>
                    <Button variant='outlined' onClick={() => window.scrollTo(0, 0)}>
                        Demo uchun ariza
                    </Button>
                </div>
            </div>
        </footer>
    )
}