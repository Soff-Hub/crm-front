import { Button, TextField } from '@mui/material'
import React, { CSSProperties } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const HeroStyles: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    // alignItems: 'center'
}

const ContentStyles: CSSProperties = {
    maxWidth: '500px',
    width: '100%',
    color: 'white !important',
}

const formStyles: CSSProperties = {
    maxWidth: '400px',
    width: '100%',
    color: 'white !important',
    backdropFilter: 'blur(10px)',
    padding: '40px 30px 70px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    border: '1px solid'
}

const ContainerStyles: CSSProperties = {
    backgroundImage: "url('https://i.pinimg.com/originals/2d/21/3d/2d213d36f66c318754bd4b78ab9361f1.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
}

export default function LandingHero() {


    return (
        <section
            className='landing-hero'
            style={{ padding: '240px 0 150px', ...ContainerStyles }}
        >
            <div className="container">
                <div className="hero-inner" style={HeroStyles}>
                    <div className="hero-content" style={ContentStyles}>
                        <h1 style={{ color: 'white', marginBottom: '40px' }}>
                            SOFF CRM - ta'lim markazlarni tizimlashtirish platformasi
                        </h1>
                        <Button variant='outlined' color='success' size='large' endIcon={<IconifyIcon icon={'nimbus:telephone'} />}>Qo'ng'iroq</Button>
                    </div>
                    <div style={formStyles}>
                        <h3 style={{ color: 'white' }}>Demo olish uchun ariza yuboring</h3>
                        <form style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <input type="text" placeholder='Ismingiz' />
                            <input type="text" placeholder='Telefon raqamingiz' />
                            <Button variant='outlined' color='success'>Yuborish</Button>
                        </form>
                    </div>
                    <div className="play-circle">
                        <div id="circle">
                            <svg version="1.1" x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" enable-background="new 0 0 300 300" xmlSpace="preserve">
                                <defs>
                                    <path id="circlePath" d="M 150, 150 m -50, 0 a 50,50 0 0,1 100,0 a 50,50 0 0,1 -100,0 " />
                                </defs>
                                <circle cx="150" cy="100" r="50" fill="none" />
                                <g>
                                    <use xlinkHref="#circlePath" fill="none" />
                                    <text fill="#000">
                                        <textPath fontSize="17px" letterSpacing="3px" xlinkHref="#circlePath">TO'LIQ  VIDEO KO'RISH</textPath>
                                    </text>
                                </g>
                            </svg>
                            <div id="play-button">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}