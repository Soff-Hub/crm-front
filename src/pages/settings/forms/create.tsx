import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Form from 'src/@core/components/form'
import IconifyIcon from 'src/@core/components/icon'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import { AuthContext } from 'src/context/AuthContext'
import { useAppSelector } from 'src/store'

type Props = {}

export function CreatedComponent({
  type,
  label,
  variants
}: {
  type: 'varchar' | 'description' | 'single' | 'multiple'
  label: string
  variants: any[]
}) {
  if (type === 'varchar') {
    return (
      <FormControl fullWidth>
        <TextField label={label} size='small' variant='filled' />
      </FormControl>
    )
  } else if (type === 'description') {
    return (
      <FormControl fullWidth>
        <TextField multiline label={label} rows={4} size='small' variant='filled' />
      </FormControl>
    )
  } else if (type === 'single' || type === 'multiple') {
    return (
      <FormControl fullWidth>
        <Typography>{label}</Typography>
        <Box>
          {variants.map((el, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox />
              <Typography>{el.value}</Typography>
            </Box>
          ))}
        </Box>
      </FormControl>
    )
  } else {
    return <></>
  }
}

export default function CreateForm({}: Props) {
  const { isMobile } = useResponsive()
  const { t } = useTranslation()

  const [open, setOpen] = useState<any>(null)
  const [fields, setFields] = useState<any>(t('Aloqa uchun kontakt qoldiring'))
  const [components, setComponents] = useState<any>([])
  const [variants, setVariants] = useState<any>([])
  const [name, setName] = useState<any>(null)
  const [successText,setSuccessText] = useState<string|null>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [sourceData, setSourceData] = useState<any>([])
  const [addSource, setAddSource] = useState<boolean>(false)
  const [department, setDepartment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectType, setSelectType] = useState<'single' | 'multiple'>('single')
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const { push } = useRouter()
  const { user } = useContext(AuthContext)

  const handleClose = () => {
    setOpen(null)
    setVariants([])
    setName('')
  }

  const createComponent = (input_type: 'varchar' | 'description' | 'single' | 'multiple', title: string) => {
    setComponents((c: any[]) => [
      ...c,
      {
        input_type,
        title,
        id: new Date().getTime(),
        question_variants: [...variants],
        oreder: components.length + 1,
        required: true
      }
    ])
    handleClose()
  }

  const deleteComponent = (id: any) => {
    setComponents((c: any[]) => [...c.filter(el => el.id !== id)])
  }

  const createForm = async () => {
    setLoading(true)
    try {
      await api.post(`leads/forms/create/`, {
        title: fields,
        department,
        success_text:successText,
        source: addSource,
        type: 'lead_form',
        application_form_types: [...components]
      })
      push('/settings/forms')
      toast.success('Forma yaratildi')
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.msg || "Ma'lumotlarni to'liq kiriting")
    }
    setLoading(false)
  }

  async function getDepartments() {
    const resp = await api.get(`leads/department/list/?lead=true`)
    setDepartments(resp.data)
  }

  const getSources = async () => {
    const resp = await api.get('leads/source/')
    if (resp?.data) {
      setSourceData(resp.data.results)
    }
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    getDepartments()
    getSources()
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.forms} />

      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{ flex: 0.4 }}>
          <Box sx={{ display: 'block', maxWidth: 400, mx: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                py: '20px'
              }}
            >
              {/* <FormControl fullWidth>
                                <InputLabel size='small' id='user-view-language-label'>{t("Bo'lim")}</InputLabel>
                                <Select
                                    size='small'
                                    label={t("Bo'lim")}

                                    id='user-view-language'
                                    labelId='user-view-language-label'
                                    name='departmentParent'
                                    defaultValue={''}
                                    onChange={(e: any) => setSelectedDepartment(e.target.value)}
                                >
                                    {
                                        departments.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl> */}

              {
                <FormControl fullWidth>
                  <InputLabel size='small' id='user-view-language-label'>
                    {t("Quyi bo'lim")}
                  </InputLabel>
                  <Select
                    size='small'
                    label={t("Quyi bo'lim")}
                    id='user-view-language'
                    labelId='user-view-language-label'
                    name='department'
                    defaultValue={''}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    {departments[0]?.children?.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }

              <FormControl fullWidth>
                <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>
                  {t('Manba')}
                </InputLabel>
                <Select
                  size='small'
                  label={t('Manba')}
                  id='fsdgsdgsgsdfsd'
                  labelId='fsdgsdgsgsdfsd-label'
                  name='source'
                  onChange={(e: any) => setAddSource(e?.target?.value)}
                  sx={{ mb: 1 }}
                >
                  {sourceData.map((lead: any) => (
                    <MenuItem key={lead.id} value={lead.id}>
                      {lead.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <TextField
                  label={t('Nomi')}
                  size='small'
                  onChange={e =>
                    e.target.value === '' ? setFields('Aloqa uchun kontakt qoldiring') : setFields(e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <TextField
                  label={t('Yakuniy text')}
                  size='small'
                  onChange={e =>
                    setSuccessText(e.target.value)
                  }
                />
              </FormControl>

              {components.map((el: any, i: number) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <CreatedComponent type={el.input_type} label={el.title} variants={el.question_variants} />
                  <button
                    style={{ margin: 0, border: 'unset', backgroundColor: 'unset', position: 'absolute', right: 0 }}
                  >
                    <IconifyIcon icon={'line-md:remove'} onClick={() => deleteComponent(el.id)} />
                  </button>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant='outlined'
                size='small'
                onClick={() => setOpen('input')}
                startIcon={<IconifyIcon icon={'ic:baseline-add'} />}
              >
                Input
              </Button>
              <Button
                variant='outlined'
                size='small'
                onClick={() => setOpen('single')}
                startIcon={<IconifyIcon icon={'ic:baseline-add'} />}
              >
                {t('Savol')}
              </Button>
              <Button
                variant='outlined'
                size='small'
                onClick={() => setOpen('description')}
                startIcon={<IconifyIcon icon={'ic:baseline-add'} />}
              >
                {t('Matn')}
              </Button>
              <LoadingButton loading={loading} variant='contained' size='small' onClick={createForm}>
                {t('Yaratish')}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 0.5 }}>
          <Box
            sx={{
              maxWidth: 500,
              mx: 'auto',
              minWidth: isMobile ? 350 : 400,
              p: isMobile ? '40px 25px' : '40px 50px',
              // backgroundColor: 'white',
              borderRadius: '0'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexDirection: 'column',
                marginBottom: '20px'
              }}
            >
              <img src={companyInfo.logo} width={40} />
              <h3>{companyInfo?.training_center_name}</h3>
            </Box>

            <Typography align='center' mb={isMobile ? 1 : 2} sx={{ fontSize: isMobile ? '20px' : '24px' }}>
              {fields}
            </Typography>

            <Form
              id='resuf0dshfsid'
              onSubmit={() => null}
              sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <FormControl>
                <TextField label={t('first_name')} size='small' variant='filled' />
              </FormControl>

              <FormControl fullWidth>
                <TextField label={t('phone')} size='small' variant='filled' defaultValue={'+998'} />
              </FormControl>
              {components.map((el: any, i: number) => (
                <CreatedComponent variants={el.question_variants} key={i} type={el.input_type} label={el.title} />
              ))}

              <LoadingButton variant='contained' type='submit' size='large' sx={{ mt: 5 }} fullWidth>
                {t('Yuborish')}
              </LoadingButton>
            </Form>
          </Box>
        </Box>

        <Dialog open={open === 'input'} onClose={handleClose}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FormControl>
              <TextField
                label={t('Input nomi (Nima yozish uchun?)')}
                size='small'
                onChange={e => setName(e.target.value)}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
              <LoadingButton onClick={handleClose} variant='outlined'>
                {t('Bekor qilish')}
              </LoadingButton>
              <LoadingButton
                disabled={name?.length == 0}
                variant='contained'
                onClick={() => createComponent('varchar', name)}
              >
                {t('Saqlash')}
              </LoadingButton>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={open === 'description'} onClose={handleClose}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <FormControl>
              <TextField label={t("Ko'proq matn yozish uchun")} size='small' onChange={e => setName(e.target.value)} />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
              <LoadingButton onClick={handleClose} variant='outlined'>
                {t('Bekor qilish')}
              </LoadingButton>
              <LoadingButton variant='contained' onClick={() => createComponent('description', name)}>
                {t('Saqlash')}
              </LoadingButton>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={open === 'single'} onClose={handleClose}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '350px' }}>
            <ButtonGroup size='small' fullWidth>
              <Button
                onClick={() => setSelectType('single')}
                variant={selectType === 'single' ? 'contained' : 'outlined'}
                size='small'
              >
                {t('Bitta javob')}
              </Button>
              <Button
                onClick={() => setSelectType('multiple')}
                variant={selectType === 'multiple' ? 'contained' : 'outlined'}
                size='small'
              >
                {t('Bir nechta javob')}
              </Button>
            </ButtonGroup>
            <FormControl>
              <TextField
                label={t('Savol matni')}
                multiline
                rows={2}
                size='small'
                onChange={e => setName(e.target.value)}
              />
            </FormControl>

            {variants.map((el: any, i: number) => (
              <TextField
                key={i}
                label={el.value}
                size='small'
                variant='standard'
                onChange={e =>
                  setVariants((c: any) => [
                    ...c.filter((item: any) => item.id !== el.id),
                    { id: new Date().getTime(), value: e.target.value, order: el.order }
                  ])
                }
              />
            ))}

            <Button
              startIcon={<IconifyIcon icon={'ic:baseline-add'} />}
              onClick={() =>
                setVariants((c: any) => [
                  ...c,
                  { id: new Date().getTime(), value: `Variant ${variants.length + 1}`, order: variants.length + 1 }
                ])
              }
              size='small'
            >
              {t("Javob varianti qo'shish")}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 6 }}>
              <LoadingButton onClick={handleClose} variant='outlined'>
                {t('Bekor qilish')}
              </LoadingButton>
              <LoadingButton variant='contained' onClick={() => createComponent(selectType, name)}>
                {t('Saqlash')}
              </LoadingButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  )
}
