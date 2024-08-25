import { useSelector, useDispatch } from 'react-redux'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { Link, useNavigate, useParams } from 'react-router-dom'
import assets from '../../assets/index'
import { useEffect, useState } from 'react'
import boardApi from '../../api/boardApi'
import { setBoards } from '../../redux/features/boardSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import FavouriteList from './FavouriteList'

const Sidebar = () => {
  const user = useSelector((state) => state.user.value)
  const boards = useSelector((state) => state.board.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const [sidebarVisible, setSidebarVisible] = useState(true) // State for sidebar visibility

  const sidebarWidth = 250

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll()
        dispatch(setBoards(res))
      } catch (err) {
        alert(err)
      }
    }
    getBoards()
  }, [dispatch])

  useEffect(() => {
    const activeItem = boards.findIndex(e => e.id === boardId)
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`)
    }
    setActiveIndex(activeItem)
  }, [boards, boardId, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e.id === boardId)
    setActiveIndex(activeItem)
    dispatch(setBoards(newList))

    try {
      await boardApi.updatePositoin({ boards: newList })
    } catch (err) {
      alert(err)
    }
  }

  const addBoard = async () => {
    try {
      const res = await boardApi.create()
      const newList = [res, ...boards]
      dispatch(setBoards(newList))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'i') {
        setSidebarVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!sidebarVisible) return null // Return nothing if sidebar is hidden

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{
        width: sidebarWidth,
        height: '100vh',
        backgroundColor: '#121212', // Dark background color
        borderRadius: '15px', // Rounded corners for the drawer
        '& > div': { borderRight: 'none' },
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: '#1e1e1e', // Slightly lighter dark background for contrast
          color: '#2b293b', // Light text color for contrast
          borderRadius: '15px', // Matching rounded corners for the list
          backgroundColor: 'black',
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant='body2'
              fontWeight='700'
              sx={{
                color: '#fff',
                textShadow: '0 0 5px rgba(255, 255, 255, 0.6)', // Glowing text
              }}
            >
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon
                fontSize='small'
                sx={{
                  color: '#fff',
                  textShadow: '0 0 5px rgba(255, 255, 255, 0.6)', // Glowing icon
                }}
              />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        <FavouriteList />
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant='body2'
              fontWeight='700'
              sx={{
                color: '#fff',
                textShadow: '0 0 5px rgba(255, 255, 255, 0.6)', // Glowing text
              }}
            >
              Private
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon
                fontSize='small'
                sx={{
                  color: '#fff',
                  textShadow: '0 0 5px rgba(255, 255, 255, 0.6)', // Glowing icon
                }}
              />
            </IconButton>
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {boards.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItemButton
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        selected={index === activeIndex}
                        component={Link}
                        to={`/boards/${item.id}`}
                        sx={{
                          pl: '20px',
                          cursor: snapshot.isDragging
                            ? 'grab'
                            : 'pointer!important',
                          color: '#fff',
                          backgroundColor:
                            index === activeIndex
                              ? '#333'
                              : 'transparent', // Highlight selected item
                          borderRadius: '8px', // Rounded corners for each board item
                          border: '2px solid transparent', // Initial transparent border
                          marginBottom: '10px',
                          '&:hover': {
                            backgroundColor: '#333', // Hover background
                            textShadow:
                              '0 0 8px rgba(255, 255, 255, 0.8)', // Enhanced glow on hover
                            borderColor: '#a020f0', // Purple border on hover
                            boxShadow: '0 0 10px #a020f0', // Glowing purple border
                          },
                          ...(index === activeIndex && {
                            borderColor: '#a020f0', // Purple border for selected item
                            boxShadow: '0 0 10px #a020f0', // Glowing purple border
                          }),
                        }}
                      >
                        <Typography
                          variant='body2'
                          fontWeight='700'
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: '#fff',
                            textShadow:
                              '0 0 5px rgba(255, 255, 255, 0.6)', // Glowing text
                          }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItemButton>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </Drawer>
  )
}

export default Sidebar
