import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Box, Paper, Typography } from '@mui/material'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchDepartmentList } from 'src/store/apps/leads'

const DragDropConnectedSortingExample: React.FC = () => {
  const { leadData } = useAppSelector(state => state.leads)
  const dispatch = useAppDispatch()

  const { isMobile } = useResponsive()
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(fetchDepartmentList())
  }, [dispatch])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    const sourceListIndex = leadData.findIndex(item => item.id.toString() === source.droppableId)
    const destinationListIndex = leadData.findIndex(item => item.id.toString() === destination.droppableId)

    if (sourceListIndex === -1 || destinationListIndex === -1) {
      return
    }

    const updatedLeadData = [...leadData]

    const sourceList = updatedLeadData[sourceListIndex].children
    const destinationList = updatedLeadData[destinationListIndex].children

    const [movedItem] = sourceList.splice(source.index, 1)

    destinationList.splice(destination.index, 0, movedItem)

   console.log(updatedLeadData);
   

    dispatch({
      type: 'leads/updateLeadData',
      payload: updatedLeadData
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box marginY={5}>
        <Typography variant={isMobile ? 'h6' : 'h5'}>{t('Lidlar')}</Typography>
      </Box>
      <Box display='flex' justifyContent='start' alignItems='start' gap={2}>
        {/* Todo List */}
        {leadData.map(item => (
          <Droppable droppableId='todo'>
            {(provided: any) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ padding: 2, width: '30%', backgroundColor: '#f0f0f0' }}
              >
                <Typography variant='h6'>{item.name}</Typography>
                {item.children.map((item: any, index) => (
                  <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                    {(provided: any) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 1,
                          padding: 1,
                          cursor: 'grab',
                          backgroundColor: 'white'
                        }}
                      >
                        {item.name}
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        ))}

        {/* Done List */}
        {/* <Droppable droppableId='done'>
          {(provided: any) => (
            <Paper
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ padding: 2, width: '30%', backgroundColor: '#f0f0f0' }}
            >
              <Typography variant='h6'>Done</Typography>
              {done.map((item:any, index) => (
                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                  {(provided: any) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 1,
                        padding: 1,
                        cursor: 'grab',
                        backgroundColor: 'white'
                      }}
                    >
                      {item.name}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable> */}
      </Box>
    </DragDropContext>
  )
}

export default DragDropConnectedSortingExample
