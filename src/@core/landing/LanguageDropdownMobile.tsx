import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconifyIcon from '../components/icon';
import { useTranslation } from 'react-i18next';
import { setCookie, getCookie } from 'cookies-next';



export default function LanguageDropdownMobile() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const languages: string[] = ['uz', 'ru', 'en']
    const { i18n } = useTranslation()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lang: string | undefined) => {
        setAnchorEl(null);
        if (lang) {
            i18n.changeLanguage(lang)
            setCookie('lang', lang);

        }
    };

    React.useEffect(() => {
        const lang = getCookie('lang')

        if (lang) {
            i18n.changeLanguage(lang)
        }
    }, [])

    return (
        <div>
            <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color='inherit'
            >
                <IconifyIcon icon={`circle-flags:${i18n.language}`} />
                <span style={{ marginLeft: '4px' }}>{i18n.language.toUpperCase()}</span>
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(undefined)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                style={{ zIndex: 10000000000 }}
            >
                {
                    languages.filter(el => el !== i18n.language).map(el => (
                        <MenuItem key={el} sx={{ bgcolor: 'transparent', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleClose(el)}>
                            <IconifyIcon icon={`circle-flags:${el}`} />
                            <span>{el.toUpperCase()}</span>
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    );
}