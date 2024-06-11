import { Button, TextField } from '@mui/material'
import React, { CSSProperties } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { motion } from "framer-motion";
import useResponsive from 'src/@core/hooks/useResponsive';
import { useTranslation } from 'react-i18next';

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
    WebkitBackdropFilter: 'blur(10px)',
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

const InputStyles: CSSProperties = {
    // backgroundImage: "url('https://i.pinimg.com/originals/2d/21/3d/2d213d36f66c318754bd4b78ab9361f1.jpg')",
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    // backgroundRepeat: 'no-repeat',
    position: 'relative',
    padding: '10px',
    outline: 'none',
    borderRadius: '12px',
    border: 0,
}

export default function LandingHero() {
    const { isMobile } = useResponsive()
    const { t } = useTranslation()


    return (
        <section
            className='landing-hero'
            style={{ padding: isMobile ? '150px 0 50px' : '240px 0 150px', ...ContainerStyles, textAlign: isMobile ? 'center' : 'start' }}
        >
            <div className="container">
                <div className="hero-inner" style={{ ...HeroStyles, flexDirection: isMobile ? 'column' : 'row' }}>
                    <div className="hero-content" style={ContentStyles}>
                        <h1 style={{ color: 'white', marginBottom: '40px' }}>
                            {t("SOFF CRM - ta'lim markazlari uchun tizimli boshqaruv platformasi")}
                        </h1>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.8 }} style={{ display: 'inline-block' }} >
                            <a href="tel:+998910086789">
                                <Button variant='outlined' color='success' size='large' endIcon={<IconifyIcon icon={'nimbus:telephone'} />}>{t("Qo'ng'iroq")}</Button>
                            </a>
                        </motion.div>
                    </div>
                    {isMobile ? <div style={{ ...formStyles, marginTop: isMobile ? '40px' : 0 }}>
                        <h3 style={{ color: 'white' }}>{t("Tekin variantini sinab ko'rmoqchimisiz? Biz bilan bog'laning")}</h3>
                        <form style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <input style={InputStyles} type="text" placeholder='Ismingiz' />
                            <input style={InputStyles} type="text" placeholder='Telefon raqamingiz' />
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} style={{}} >
                                <Button variant='outlined' color='success' fullWidth>{t("Yuborish")}</Button>
                            </motion.div>
                        </form>
                    </div> : <div style={{ ...formStyles, marginTop: isMobile ? '40px' : 0 }} data-aos="zoom-out">
                        <h3 style={{ color: 'white' }}>{t("Tekin variantini sinab ko'rmoqchimisiz? Biz bilan bog'laning")}</h3>
                        <form style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <input style={InputStyles} type="text" placeholder={t('Ism')} />
                            <input style={InputStyles} type="text" placeholder={t('phone')} />
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} style={{}} >
                                <Button variant='outlined' color='success' fullWidth>{t("Yuborish")}</Button>
                            </motion.div>
                        </form>
                    </div>}
                    <div className="play-circle">
                        {
                            isMobile ? <div id="circle">
                                <svg version="1.1" x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" enable-background="new 0 0 300 300" xmlSpace="preserve">
                                    <defs>
                                        <path id="circlePath" d="M 150, 150 m -50, 0 a 50,50 0 0,1 100,0 a 50,50 0 0,1 -100,0 " />
                                    </defs>
                                    <circle cx="150" cy="100" r="50" fill="none" />
                                    <g>
                                        <use xlinkHref="#circlePath" fill="none" />
                                        <text fill="#000">
                                            <textPath fontSize="16px" letterSpacing="3px" xlinkHref="#circlePath">{t("~ SOFF CRM HAQIDA BATAFSIL")}</textPath>
                                        </text>
                                    </g>
                                </svg>
                                <div id="play-button">
                                </div>
                            </div> : <div id="circle" data-aos="zoom-out">
                                <svg version="1.1" x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" enable-background="new 0 0 300 300" xmlSpace="preserve">
                                    <defs>
                                        <path id="circlePath" d="M 150, 150 m -50, 0 a 50,50 0 0,1 100,0 a 50,50 0 0,1 -100,0 " />
                                    </defs>
                                    <circle cx="150" cy="100" r="50" fill="none" />
                                    <g>
                                        <use xlinkHref="#circlePath" fill="none" />
                                        <text fill="#000">
                                            <textPath fontSize="16px" letterSpacing="3px" xlinkHref="#circlePath">{t("~ SOFF CRM HAQIDA BATAFSIL")}</textPath>
                                        </text>
                                    </g>
                                </svg>
                                <div id="play-button">
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}