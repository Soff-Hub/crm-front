import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Pagination from '@mui/material/Pagination';
import { IconButton, Menu, MenuItem, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ITEMS_PER_PAGE = 10;

const Kanban = () => {
  const mockData = [
    {
      id: uuidv4(),
      title: ' 📃 To do',
      tasks: new Array(15).fill(null).map((_, i) => ({
        id: uuidv4(),
        title: `Task ${i + 1}`
      }))
    },
    {
      id: uuidv4(),
      title: ' ✏️ In progress',
      tasks: new Array(12).fill(null).map((_, i) => ({
        id: uuidv4(),
        title: `Progress Task ${i + 1}`
      }))
    },
    {
      id: uuidv4(),
      title: ' ✔️ Completed',
      tasks: new Array(8).fill(null).map((_, i) => ({
        id: uuidv4(),
        title: `Completed Task ${i + 1}`
      }))
    }
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState(mockData);
  const [pageMap, setPageMap] = useState<any>({});
  const [selectedTask, setSelectedTask] = useState<{id:any}|null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  const onDragEnd = (result:any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = data.findIndex(e => e.id === source.droppableId);
      const destinationColIndex = data.findIndex(e => e.id === destination.droppableId);

      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];

      const sourceTasks = [...sourceCol.tasks];
      const destinationTasks = [...destinationCol.tasks];

      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);

      const newData = [...data];
      newData[sourceColIndex].tasks = sourceTasks;
      newData[destinationColIndex].tasks = destinationTasks;
      setData(newData);
    }
  };

  const handlePageChange = (sectionId:any, event:any, page:any) => {
    setPageMap((prev:any) => ({ ...prev, [sectionId]: page }));
  };

  const handleMenuOpen = (event:any, task:any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

 

  const handleEditTask = () => {
    setData(prevData => prevData.map((section:any) => ({
      ...section,
      tasks: section.tasks.map((task:any) => task.id === selectedTask?.id ? { ...task, title: editTaskTitle } : task),
      visibleTasks: section?.visibleTasks?.map((task:any) => task.id === selectedTask?.id ? { ...task, title: editTaskTitle } : task)
    })));
    handleMenuClose();
  };

  const handleDeleteTask = () => {
    setData(prevData => prevData.map((section:any) => ({
      ...section,
      tasks: section.tasks.filter((task:any) => task.id !== selectedTask?.id),
      visibleTasks: section?.visibleTasks?.filter((task:any) => task.id !== selectedTask?.id)
    })));
    handleMenuClose();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='kanban' style={{ display: 'flex', gap: 10 }}>
        {data.map(section => {
          const currentPage = pageMap[section?.id] || 1;
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginatedTasks = section.tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          return (
            <Droppable key={section.id} droppableId={section.id}>
              {(provided) => (
                <div {...provided.droppableProps} className='kanban__section' ref={provided.innerRef}>
                  <div style={{ border: '2px solid', borderRadius: 10, marginBottom: 20, display: 'flex', padding: 10, minWidth: 300, textAlign: 'center' }}>
                    {section.title}
                  </div>
                  <div className='kanban__section__content'>
                    {paginatedTasks.map((task, index) => (
                       <Draggable key={task.id} draggableId={task.id} index={index}>
                       {(provided, snapshot) => (
                         <div
                           ref={provided.innerRef}
                           {...provided.draggableProps}
                           {...provided.dragHandleProps}
                           style={{
                             ...provided.draggableProps.style,
                             opacity: snapshot.isDragging ? '0.5' : '1',
                             display: 'flex',
                             justifyContent: 'space-between',
                             alignItems: 'center',
                             border: '1px solid',
                             borderRadius: 10,
                             marginBottom: 10,
                             textAlign: 'center',
                             padding: '10px'
                           }}
                         >
                           {task.title}
                           <IconButton onClick={(event) => handleMenuOpen(event, task)}>
                             <MoreVertIcon />
                           </IconButton>
                         </div>
                       )}
                     </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  {section.tasks.length > ITEMS_PER_PAGE && (
                    <Pagination
                      count={Math.ceil(section.tasks.length / ITEMS_PER_PAGE)}
                      page={currentPage}
                      onChange={(event, page) => handlePageChange(section.id, event, page)}
                      style={{ marginTop: 10, textAlign: 'center' }}
                    />
                  )}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem>
          <TextField value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} fullWidth />
        </MenuItem>
        <MenuItem onClick={handleEditTask}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteTask}>Delete</MenuItem>
      </Menu>
    </DragDropContext>
  );
};

export default Kanban;
