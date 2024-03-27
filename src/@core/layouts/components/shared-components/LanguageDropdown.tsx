// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useRouter } from 'next/router'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  const router = useRouter();
  const { locales, locale: activeLocale, pathname, query, asPath } = router;

  const otherLocales = (locales || []).filter(
      (locale) => locale !== activeLocale,
  );

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = (lang: 'uz' | 'ru' | 'en') => {
    i18n.changeLanguage(lang)
    saveSettings({ ...settings, locale: lang })
    router.push({ pathname, query }, asPath, { locale: lang })
  }

  return (
    <OptionsMenu
      icon={<Icon icon={`circle-flags:${i18n.language}`} />}
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
          text: 'Russian',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'ru',
            onClick: () => {
              handleLangItemClick('ru')
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
