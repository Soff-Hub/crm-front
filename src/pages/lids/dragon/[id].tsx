import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'
import api from 'src/@core/utils/api'
import {
  fetchDepartmentList,
  fetchSources,
  setAddSource,
  setDragonLoading,
  setLeadItems,
  setOpenLid,
  setSectionId
} from 'src/store/apps/leads'
import { useRouter } from 'next/router'
import EmptyContent from 'src/@core/components/empty-content'
import { EyeIcon, Phone, User } from 'lucide-react'
import { LidsDragonModal } from 'src/views/apps/lids/LidsDragonModal'
import IconifyIcon from 'src/@core/components/icon'
import CreateAnonimUserForm from 'src/views/apps/lids/anonimUser/CreateAnonimUserForm'
import { useTranslation } from 'react-i18next'
import { PersonAddAlt } from '@mui/icons-material'
import useResponsive from 'src/@core/hooks/useResponsive'

const Kanban = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [pageMap, setPageMap] = useState<any>({})
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState('')
  const { leadItems, leadData, openLid, dragonLoading } = useSelector((state: RootState) => state.leads)
  const [data, setData] = useState(leadItems)
  const [source, setSource] = useState<any>(null)
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { query } = useRouter()
  const { isMobile } = useResponsive()
  const [leadTitle, setLeadTitle] = useState('')
  async function handleGetLealdItems() {
    if (!query.id) return
    dispatch(setDragonLoading(true))

    try {
      const res = await api.get(`leads/department/${query.id}`)
      dispatch(setLeadItems(res.data))
      setData(res.data)
    } catch (err) {
      console.error('Error fetching leads:', err)
    } finally {
      dispatch(setDragonLoading(false))
    }
  }

  useEffect(() => {
    setData(leadItems)
  }, [leadItems])

  useEffect(() => {
    if (leadData) {
      let leadtitle = leadData?.find(item => item.id == Number(query?.id))

      setLeadTitle(String(leadtitle?.name))
    }
  }, [leadData])

  useEffect(() => {
    handleGetLealdItems()
    dispatch(fetchDepartmentList())
    dispatch(fetchSources())
  }, [query?.id])

  const closeCreateLid = () => {
    dispatch(setOpenLid(null))
    dispatch(setAddSource(false))
    dispatch(setSectionId(null))
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination || !data) return

    const { source, destination } = result

    const sourceColIndex = data.findIndex(e => String(e.id) === source.droppableId)
    const destinationColIndex = data.findIndex(e => String(e.id) === destination.droppableId)

    if (sourceColIndex === -1 || destinationColIndex === -1) return

    const sourceCol = data[sourceColIndex]
    const destinationCol = data[destinationColIndex]

    if (!sourceCol || !destinationCol) return

    if (sourceColIndex === destinationColIndex) {
      const updatedLeads = [...sourceCol.leads]
      const [movedLead] = updatedLeads.splice(source.index, 1)
      updatedLeads.splice(destination.index, 0, movedLead)

      const newData = [...data]
      newData[sourceColIndex] = { ...sourceCol, leads: updatedLeads }

      setData(newData)
    } else {
      const sourceLeads = [...sourceCol.leads]
      const destinationLeads = [...destinationCol.leads]

      const [movedLead] = sourceLeads.splice(source.index, 1)
      destinationLeads.splice(destination.index, 0, movedLead)

      const newData = [...data]
      newData[sourceColIndex] = { ...sourceCol, leads: sourceLeads }
      newData[destinationColIndex] = { ...destinationCol, leads: destinationLeads }

      setData(newData)

      try {
        await api.patch(`leads/anonim-user/update/${movedLead.id}/`, {
          department: destinationCol.id
        })
      } catch (error) {
        console.error("Failed to update lead's department:", error)
      }
    }
  }

  const handlePageChange = (sectionId: any, event: any, page: any) => {
    setPageMap((prev: any) => ({ ...prev, [sectionId]: page }))
  }

  const handleMenuOpen = (event: any, lead: any) => {
    setStudentModalOpen(true)
    setSelectedLead(lead)
  }

  function handleClose() {
    setStudentModalOpen(false)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedLead(null)
  }

  const handleEditTask = () => {
    setData((prevData: any) =>
      prevData.map((section: any) => ({
        ...section,
        tasks: section.tasks.map((task: any) =>
          task.id === selectedLead?.id ? { ...task, title: editTaskTitle } : task
        ),
        visibleTasks: section?.visibleTasks?.map((task: any) =>
          task.id === selectedLead?.id ? { ...task, title: editTaskTitle } : task
        )
      }))
    )
    handleMenuClose()
  }

  const handleDeleteTask = () => {
    setData((prevData: any) =>
      prevData.map((section: any) => ({
        ...section,
        tasks: section.tasks.filter((task: any) => task.id !== selectedLead?.id),
        visibleTasks: section?.visibleTasks?.filter((task: any) => task.id !== selectedLead?.id)
      }))
    )
    handleMenuClose()
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Typography variant='h4' marginY={5}>
        {leadTitle ? leadTitle : 'leadData'}
      </Typography>
      <div
        className='kanban'
        style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'start', gap: 20 }}
      >
        {dragonLoading ? (
          <Box display={'flex'} flexDirection={'column'} marginBottom={10} gap={5}>
            <Box display={'flex'} gap={5}>
              <Skeleton variant='rounded' width={300} height={50} />
              <Skeleton variant='rounded' width={300} height={50} />
              <Skeleton variant='rounded' width={300} height={50} />
              <Skeleton variant='rounded' width={300} height={50} />
            </Box>
            <Box display={'flex'} gap={5}>
              <Skeleton variant='rounded' width={300} height={80} />
              <Skeleton variant='rounded' width={300} height={80} />
              <Skeleton variant='rounded' width={300} height={80} />
              <Skeleton variant='rounded' width={300} height={80} />
            </Box>
          </Box>
        ) : data?.length ? (
          data?.map(section => {
            return (
              <Droppable key={section?.id} droppableId={String(section?.id)}>
                {provided => (
                  <div
                    {...provided.droppableProps}
                    className='kanban__section'
                    ref={provided.innerRef}
                    style={{ width: isMobile ? '100%' : 'auto', padding: 20, background: 'white', borderRadius: 10 }}
                  >
                    <div
                      style={{
                        background: 'white',
                        borderRadius: 10,
                        marginBottom: 20,
                        minWidth: 300,
                        fontSize: 25
                      }}
                    >
                      {section.name}
                    </div>
                    <div
                      style={{ marginBottom: 10, maxHeight: '50vh', paddingRight: 10, overflow: 'auto' }}
                      className='kanban__section__content'
                    >
                      {section.leads?.map((lead: any, index: any) => (
                        <Draggable key={lead?.id} draggableId={String(lead.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className='shadow-sm p-3 bg-light  rounded'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? '0.5' : '1',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderRadius: 10,
                                marginBottom: 10,
                                textAlign: 'center',
                                padding: '5px'
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <User width={20} height={20} color='blue' />
                                  {lead.first_name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <Phone width={18} height={18} color='blue' />
                                  <Typography fontSize={12}>{lead?.phone}</Typography>
                                </div>
                              </div>
                              <IconButton onClick={event => handleMenuOpen(event, lead)}>
                                <EyeIcon />
                              </IconButton>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                    {/* {section.leads.length > ITEMS_PER_PAGE && (
                      <Pagination
                        count={Math.ceil(section.leads.length / ITEMS_PER_PAGE)}
                        page={currentPage}
                        onChange={(event, page) => handlePageChange(section.id, event, page)}
                        style={{ textAlign: 'center' ,marginBottom:10}}
                      />
                    )} */}
                    <Box>
                      <Button
                        size='medium'
                        fullWidth
                        onClick={() => {
                          setSource(section?.id), dispatch(setOpenLid(query?.id))
                        }}
                        variant='outlined'
                        startIcon={<PersonAddAlt />}
                        // sx={{ position: 'absolute', bottom: 0, margin: 5 }}
                      >
                        Yangi lid qo'shish
                      </Button>
                    </Box>
                  </div>
                )}
              </Droppable>
            )
          })
        ) : (
          <EmptyContent />
        )}
      </div>

      <LidsDragonModal handleClose={handleClose} openModal={studentModalOpen} selectedLead={selectedLead} />
      <Dialog onClose={closeCreateLid} open={openLid !== null}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t('Yangi Lid')}
          </Typography>
          <IconButton aria-label='close' onClick={closeCreateLid}>
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <CreateAnonimUserForm source={source ? source : null} />
        </DialogContent>
      </Dialog>
    </DragDropContext>
  )
}

export default Kanban
