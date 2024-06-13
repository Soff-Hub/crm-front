import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React, { CSSProperties, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'


export default function LandingDocs() {

    const [open, setOpen] = useState<any>(null)


    const { isMobile, isTablet } = useResponsive()
    const { t } = useTranslation()

    const iframeStyles: CSSProperties = {
        minWidth: isMobile ? '300px' : isTablet ? '600px' : '1000px',
        width: '100%',
        margin: '0 auto',
        display: 'block',
        minHeight: isMobile ? '250px' : isTablet ? '350px' : '600px'
    }


    return (
        <div className='doc-videos' style={{ padding: '50px 0' }}>
            <div className="container">
                <h2
                    style={{
                        marginBottom: '34px',
                        color: '#050d1a',
                        textAlign: 'center',
                        fontWeight: 700
                    }}
                >
                    Tizimdan foydalanish haqida to'liq video qo'llanmalar
                </h2>

                <div className="docs-inner" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', flexDirection: isMobile ? "column" : 'row' }}>
                    {
                        [1, 2, 3, 4, 5, 6].map(el => (
                            <div
                                key={el}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px',
                                    width: isMobile ? '100%' : '40%',
                                    justifyContent: 'center',
                                }}>
                                <div
                                    style={{
                                        backgroundImage: `url('/images/video-icon-1.jpeg')`,
                                        borderRadius: '50%',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <img
                                        width={60}
                                        height={60}
                                        src='https://cdn-icons-png.flaticon.com/128/4255/4255214.png'
                                        alt="video poster"
                                        style={{
                                            cursor: 'pointer',
                                            borderRadius: '50%'
                                        }}
                                        onClick={() => setOpen(el)}
                                    />
                                </div>
                                <span
                                    onClick={() => setOpen(el)}
                                    style={{ cursor: 'pointer', fontSize: '18px', color: '#050d1a' }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipisicing.
                                </span>
                            </div>
                        ))
                    }
                </div>
            </div>

            <Dialog maxWidth={isMobile ? "sm" : isTablet ? "md" : "lg"} open={open} onClose={() => setOpen(null)}>
                <iframe
                    style={iframeStyles}
                    src="https://www.youtube.com/embed/1HnJvwco4Gc?si=723REQcoeUQE2H4X"
                    title="Soff CRM haqida"
                    allowFullScreen
                >
                </iframe>
            </Dialog>
        </div>
    )
}