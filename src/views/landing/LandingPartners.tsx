import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'

export default function LandingPartners() {
    const url = 'https://uic.group/media/Partners/Asakabank.svg'
    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    const effect: string[] = [
        'fade-down',
        'fade-right',
        'fade-left',
        'fade-up-right',
        'fade-up-left',
        'fade-down-right',
        'fade-down-left',
        'flip-left',
        'flip-right',
        'flip-up',
        'flip-down',
        'zoom-in',
        'zoom-in-up',
        'zoom-in-down',
        'zoom-in-left',
        'zoom-in-right',
        'zoom-out',
        'zoom-out-up',
        'zoom-out-down',
        'zoom-out-right',
        'zoom-out-left',
        'fade-up'
    ]



    return (
        <div
            style={{ backgroundColor: 'rgb(20, 20, 21, 1)', padding: '70px 0 80px' }}
        >
            <div className="container">
                <h2 style={{
                    marginBottom: '34px',
                    color: 'white',
                    maxWidth: '800px',
                    fontSize: isMobile ? '22px' : '44px',
                    fontWeight: '700',
                }}>
                    {t('Bizga ishonch bildirgan mijozlar')}
                </h2>
                <div
                    style={{
                        gap: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: isMobile ? 'space-evenly' : 'space-between'
                    }}
                >
                    {
                        Array(15).fill(url).map((el, i) => (
                            isMobile ? <div
                                style={{
                                    backgroundColor: 'rgba(37, 37, 39, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    padding: '10px 0',
                                    minWidth: isMobile ? '140px' : '220px',
                                    objectFit: 'cover'
                                }}
                            >
                                <Image src={el} alt='brands' width={isMobile ? 120 : 170} height={115} style={{ height: 'auto' }} />
                            </div> : <div
                                data-aos={'zoom-out'}
                                data-aos-offset="0"
                                data-aos-delay={(i + 1) * 50}
                                style={{
                                    backgroundColor: 'rgba(37, 37, 39, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    padding: '10px 0',
                                    minWidth: isMobile ? '160px' : '220px',
                                }}
                            >
                                {/* {i + 1} */}
                                <Image src={el} alt='brands' width={170} height={115} style={{ height: 'auto' }} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}