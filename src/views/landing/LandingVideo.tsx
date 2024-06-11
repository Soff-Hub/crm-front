import React, { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'

export default function LandingVideo() {

    const { isMobile, isTablet } = useResponsive()
    const { t } = useTranslation()

    const iframeStyles: CSSProperties = {
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        display: 'block',
        minHeight: isMobile ? '250px' : isTablet ? '350px' : '600px'
    }


    return (
        <section className='landing-video'>
            <div className="container">
                <div className="lading-video-inner" style={{ padding: '90px 0 40px' }}>
                    <div className="landing-video-inner" style={{ maxWidth: '700px', textAlign: 'center', margin: '0 auto' }}>
                        <h2>{t('Biz haqimizda')}</h2>
                        <p>
                            {t("Soff CRM tizimining maqsadi o'quv markazlarining ish faoliyatini tizimlashtirish orqali ish jarayonlarini tizim orqali boshqarish orqali har tamonlama rivojlanishiga hissa qo'shishdir.")}
                        </p>
                    </div>
                    {isMobile ? <div>
                        <iframe
                            style={iframeStyles}
                            src="https://www.youtube.com/embed/1HnJvwco4Gc?si=723REQcoeUQE2H4X"
                            title="Soff CRM"
                            allowFullScreen></iframe>
                    </div> : <div
                        data-aos="fade-up"
                    >
                        <iframe
                            style={iframeStyles}
                            src="https://www.youtube.com/embed/1HnJvwco4Gc?si=723REQcoeUQE2H4X"
                            title="Soff CRM haqida"
                            allowFullScreen></iframe>
                    </div>}
                </div>
            </div>
        </section>
    )
}