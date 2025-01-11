import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Box, Paper, Typography } from '@mui/material'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchDepartmentList } from 'src/store/apps/leads'

const DragDropConnectedSortingExample: React.FC = () => {
      const {leadData} = useAppSelector(state => state.leads)

  const [todo, setTodo] = useState(['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'])
  const [done, setDone] = useState(['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'])
  const { isMobile } = useResponsive()
    const { t } = useTranslation()
     const dispatch = useAppDispatch()
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(source.droppableId === 'todo' ? todo : done)
      const [movedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, movedItem)

      source.droppableId === 'todo' ? setTodo(items) : setDone(items)
    } else {
      const sourceItems = Array.from(source.droppableId === 'todo' ? todo : done)
      const destItems = Array.from(destination.droppableId === 'todo' ? todo : done)
      const [movedItem] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, movedItem)

      if (source.droppableId === 'todo') {
        setTodo(sourceItems)
        setDone(destItems)
      } else {
        setTodo(destItems)
        setDone(sourceItems)
      }
    }
    }
    
    
    useEffect(() => {
        dispatch(fetchDepartmentList())
    },[])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box marginY={5}>
        <Typography variant={isMobile ? 'h6' : 'h5'}>{t('Lidlar')}</Typography>
      </Box>
      <Box display='flex' justifyContent='start' alignItems='start' gap={2}>
        <Droppable droppableId='todo'>
          {(provided: any) => (
            <Paper
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ padding: 2, width: '30%', backgroundColor: '#f0f0f0' }}
            >
              <Typography variant='h6'>Todo</Typography>
              {todo.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided: any) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                          height: 40,
                          display: "flex",
                          alignItems:'center',
                        marginBottom: 1,
                        padding: 1,
                        cursor: 'grab',
                        backgroundColor: 'white'
                      }}
                    >
                      {item}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable>

        <Droppable droppableId='done'>
          {(provided: any) => (
            <Paper
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ padding: 2, width: '30%', backgroundColor: '#f0f0f0' }}
            >
              <Typography variant='h6'>Done</Typography>
              {done.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
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
                      {item}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable>
      </Box>
    </DragDropContext>
  )
}

export default DragDropConnectedSortingExample
