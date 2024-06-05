import React, { CSSProperties, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../components/icon'


const languages: string[] = ['uz', 'ru', 'en']

export default function LanguageDropdown() {

    const { i18n } = useTranslation()
    const [hover, setHover] = useState<null | string>(null)



    const styles: CSSProperties = {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        maxWidth: hover === 'div' ? '200px' : '70px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        padding: '3px 5px',
        // border: '1px solid',
        borderRadius: '8px',
        objectPosition: 'right'
    }

    const flagStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: hover === 'div' ? '0' : '70px',
        overflow: hover === 'div' ? 'hidden' : 'visible',
        transition: 'all 0.3s ease'
    }

    const dropdownStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    }

    const visible: CSSProperties = {
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
    }

    const langItemStyles: CSSProperties = {
        textTransform: 'uppercase'
    }

    const langItemStylesActive: CSSProperties = {
        ...langItemStyles,
        color: 'white',
        fontWeight: 'bold'
    }

    return (
        <div style={styles} onMouseEnter={() => setHover('div')} onMouseLeave={() => setHover(null)}>
            <div style={flagStyles}>
                <IconifyIcon icon={i18n.language === 'ar' ? 'openmoji:flag-united-arab-emirates' : `circle-flags:${i18n.language}`} />
                <span style={langItemStylesActive}>{i18n.language}</span>
            </div>
            <div style={visible}>
                <span style={{ marginRight: '5px' }}>
                    Language:
                </span>
                <div style={dropdownStyles}>
                    {
                        languages.map(el => <span style={i18n.language === el ? langItemStylesActive : langItemStyles} key={el}>{el}</span>)
                    }
                </div>
            </div>
        </div>
    )
}