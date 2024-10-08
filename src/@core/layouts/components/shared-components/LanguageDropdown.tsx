// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useRouter } from 'next/router'
import { disablePage } from 'src/store/apps/page'
import { useAppDispatch } from 'src/store'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const router = useRouter();
  const { locales, locale: activeLocale, pathname, query, asPath } = router;

  const otherLocales = (locales || []).filter(
    (locale) => locale !== activeLocale,
  );

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = async (lang: 'uz' | 'ru' | 'en' | 'fr' | 'ar') => {
    i18n.changeLanguage(lang)

    if (lang === 'ar') {
      saveSettings({ ...settings, locale: lang, direction: 'rtl' })
    } else {
      saveSettings({ ...settings, locale: lang, direction: 'ltr' })
    }
    dispatch(disablePage(false))
    router.push({ pathname, query }, asPath, { locale: lang })
    dispatch(disablePage(false))
  }

  return (
    <OptionsMenu
      icon={<Icon icon={i18n.language === 'ar' ? 'openmoji:flag-united-arab-emirates' : `circle-flags:${i18n.language}`} />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={[
        {
          text: 'O\'zbekcha',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'uz',
            onClick: () => {
              handleLangItemClick('uz')
            }
          }
        },
        {
          text: 'Русский',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'ru',
            onClick: () => {
              handleLangItemClick('ru')
            }
          }
        },
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
