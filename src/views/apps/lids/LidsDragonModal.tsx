import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import { Bell, Clock, Info, MessageSquare, Phone, PlusIcon, User, UserIcon } from 'lucide-react'

interface LidsDragonModalProps {
  openModal: boolean
  handleClose: (status: boolean) => void
  selectedLead: {
    created_at: string
    first_name: string
    id: number
    last_activity: string
    phone: string
  }
}
import React, { useEffect, useState } from 'react'
import EmptyContent from 'src/@core/components/empty-content'
import IconifyIcon from 'src/@core/components/icon'
import api from 'src/@core/utils/api'
import { formatDate } from 'src/@core/utils/format'
import AddNoteAnonimUser from './anonimUser/AddNoteAnonimUser'
import { useTranslation } from 'react-i18next'
import { setOpen } from 'src/store/apps/leads'
import SendSmsAnonimUserForm from './anonimUser/SendSmsAnonimUserForm'
import { useAppSelector } from 'src/store'
import { HelpOutline, QuestionAnswer, QuestionAnswerOutlined } from '@mui/icons-material'
import useResponsive from 'src/@core/hooks/useResponsive'

type InfoItemProps = {
  icon: React.ReactNode
  label: string
  value: string
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className='d-flex align-items-center p-3 bg-light rounded-3 shadow-sm hover:bg-secondary transition-all duration-200'>
      <div className='text-primary me-3'>{icon}</div>
      <div>
        <p className='mb-1 text-muted'>{label}</p>
        <p className='mb-0 font-weight-bold text-dark'>{value}</p>
      </div>
    </div>
  )
}

export default InfoItem

export function LidsDragonModal({ selectedLead, openModal, handleClose }: LidsDragonModalProps) {
  const [value, setValue] = useState<'lead-user-description' | 'anonim-user' | 'sms-history'>('anonim-user')
  const [leadDetail, setLeadDetail] = useState<any>(null)
  const { sms_list } = useAppSelector(state => state.settings)
  const [smsModal, setSmsModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const { isMobile } = useResponsive()
  const [nodeModal, setNodeModal] = useState(false)
  const { t } = useTranslation()
  async function handleGetUserDetails(value: string, id: number) {
    setDetailLoading(true)
    await api
      .get(`leads/${value}/${selectedLead?.id}/`)
      .then(res => {
        setLeadDetail(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    setDetailLoading(false)
  }

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: 'lead-user-description' | 'anonim-user' | 'sms-history'
  ) => {
    handleGetUserDetails(newValue, selectedLead?.id)
    setValue(newValue)
  }

  useEffect(() => {
    handleGetUserDetails(value, selectedLead?.id)
  }, [selectedLead?.id])

  return (
    <Dialog
      fullWidth
      open={openModal}
      onClose={() => {
        handleClose(false), setValue('anonim-user')
      }}
    >
      <DialogTitle>
        <Typography variant='h5'>O'quvchi ma'lumotlari</Typography>
      </DialogTitle>
      <DialogContent>
        <Box width='100%' display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <div
            className='d-flex  justify-content-center align-items-center rounded-circle bg-gradient text-white'
            style={{
              width: '6rem',
              height: '6rem',
              background: '#007bff',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {selectedLead?.first_name[0].toLocaleUpperCase()}
          </div>
        </Box>
        <div className='row g-4 mt-2'>
          <div className='col-6'>
            <InfoItem icon={<User />} label='Ism' value={`${selectedLead?.first_name}`} />
          </div>

          <div className='col-6'>
            <InfoItem icon={<Clock />} label='Yaratilgan sanasi' value={formatDate(selectedLead?.created_at)} />
          </div>

          <div className='col-12'>
            <InfoItem icon={<Phone />} label='Telefon raqami' value={selectedLead?.phone} />
          </div>
        </div>
        <Box sx={{ width: '100%', marginTop: 2 }}>
          <Tabs
            variant={isMobile ? 'scrollable' : 'fullWidth'} // Scrollable for small screens
            scrollButtons={isMobile ? 'auto' : false} // Show scroll buttons if needed
            value={value}
            onChange={handleChange}
            aria-label='user tabs'
            sx={{
              '& .MuiTabs-flexContainer': {
                flexDirection: isMobile ? 'column' : 'row' // Stack tabs vertically on small screens
              }
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Info style={{ marginRight: 5 }} width={16} height={16} />
                  Ma'lumotlar
                </Box>
              }
              value='anonim-user'
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Bell style={{ marginRight: 5 }} width={16} height={16} />
                  Eslatmalar
                </Box>
              }
              value='lead-user-description'
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MessageSquare style={{ marginRight: 5 }} width={16} height={16} />
                  Sms tarixi
                </Box>
              }
              value='sms-history'
            />
          </Tabs>

          <Box sx={{ padding: 2, backgroundColor: '#f8f9fa', borderRadius: 1, marginTop: 2 }}>
            {value === 'anonim-user' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : leadDetail?.length == 0 ? (
                  <EmptyContent />
                ) : (
                  leadDetail?.map((item: any) => (
                    <Box
                      className='shadow-sm p-3'
                      display='flex'
                      flexDirection='column'
                      gap={2}
                      sx={{ background: 'white', borderRadius: 1 }}
                      margin={4}
                      padding={3}
                    >
                      <Box display='flex' alignItems='center'>
                        <div className='text-primary me-3'>{<HelpOutline />}</div>
                        <Typography>{item?.application_form}</Typography>
                      </Box>
                      <Box display='flex' alignItems='center'>
                        <div className='text-primary me-3'>{<QuestionAnswerOutlined />}</div>
                        <Typography>{item?.answer}</Typography>
                        <FormGroup>
                          {item.variants.map((variant:any) => (
                            <FormControlLabel
                              key={variant.id}
                              control={
                                <Checkbox
                                  checked={variant.is_checked}
                                />
                              }
                              label={variant.value}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    </Box>
                  ))
                )}
              </div>
            )}

            {value === 'lead-user-description' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : (
                  <>
                    <Box margin={4}>
                      <Button
                        variant='contained'
                        onClick={() => setNodeModal(true)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                        startIcon={<PlusIcon />}
                      >
                        Yangi Eslatma
                      </Button>
                    </Box>
                    {leadDetail?.map((item: any) => (
                      <Box
                        className='shadow-sm p-3'
                        display='flex'
                        flexDirection='column'
                        gap={2}
                        sx={{ background: 'white', borderRadius: 1 }}
                        margin={4}
                        padding={3}
                      >
                        <Box display='flex' alignItems='center' justifyContent='space-between'>
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<User />}</div>
                            <Typography>{item?.admin}</Typography>
                          </Box>
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<Clock />}</div>
                            <Typography>{item?.created_at}</Typography>
                          </Box>
                        </Box>
                        {item?.body && (
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<Bell />}</div>
                            <Typography>{item?.body}</Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </>
                )}
              </div>
            )}

            {value === 'sms-history' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : (
                  <>
                    <Box margin={4}>
                      <Button
                        variant='contained'
                        onClick={() => setSmsModalOpen(true)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                        startIcon={<PlusIcon />}
                      >
                        Yangi Sms
                      </Button>
                    </Box>
                    {leadDetail?.map((item: any) => (
                      <Box
                        className='shadow-sm p-3'
                        display='flex'
                        flexDirection='column'
                        gap={2}
                        sx={{ background: 'white', borderRadius: 1 }}
                        margin={4}
                        padding={3}
                      >
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<MessageSquare />}</div>
                          <Typography fontSize={15}>{item?.message}</Typography>
                        </Box>
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<Clock />}</div>
                          <Typography fontSize={15}>{item?.created_at}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </div>
            )}
          </Box>
        </Box>
      </DialogContent>
      <Dialog open={nodeModal} onClose={() => setNodeModal(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('Yangi eslatma')}</Typography>
          <IconifyIcon onClick={() => setNodeModal(false)} icon={'material-symbols:close'} />
        </DialogTitle>
        <DialogContent sx={{ minWidth: '300px' }}>
          <AddNoteAnonimUser
            user={selectedLead?.id}
            closeModal={async () => (
              setNodeModal(false), await handleGetUserDetails('lead-user-description', selectedLead?.id)
            )}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={smsModal} onClose={() => setSmsModalOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('SMS yuborish')}</Typography>
          <IconifyIcon onClick={() => setSmsModalOpen(false)} icon={'material-symbols:close'} />
        </DialogTitle>

        <DialogContent sx={{ minWidth: '300px' }}>
          <SendSmsAnonimUserForm
            smsTemps={sms_list}
            user={selectedLead?.id}
            closeModal={() => setSmsModalOpen(false)}
            reRender={() => handleGetUserDetails('sms-history', selectedLead?.id)}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
