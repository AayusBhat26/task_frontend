import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import assets from "../../assets/index";
import boardApi from "../../api/boardApi";
import { setBoards } from "../../redux/features/boardSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./index.css"
import FavouriteList from "./FavouriteList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const Sidebar = () => {
  const user = useSelector((state) => state.user.value);
  const boards = useSelector((state) => state.board.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const sidebarWidth = 250;

  useEffect(() => {
    try {
      const getBoards = async () => {
        const res = await boardApi.getAll();
        // console.log(res);
        if (res.length > 0 && boardId === undefined) {
          navigate(`/boards/${res[0]._id}`);
        }
        dispatch(setBoards(res));
      };
      getBoards();
    } catch (error) {
      // alert(error);
    }
  }, []);
  useEffect(() => {
    return updateActive(boards);
    // 2nd useeffect, this would be used when boards are changed
  }, [boards, boardId]);
  const updateActive = (listBoards) => {
    const activeItem = listBoards.findIndex((e) => e._id === boardId);
    setActiveIndex(activeItem);
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
 const onDragEnd = async ({ source, destination }) => {
   const newList = [...boards];
   console.log(source, destination);
   const [removed] = newList.splice(source.index, 1);
   newList.splice(destination.index, 0, removed);

   const activeItem = newList.findIndex((e) => e.id === boardId);
   setActiveIndex(activeItem);
   dispatch(setBoards(newList));

   try {
     await boardApi.updatePosition({ boards: newList });
   } catch (err) {
     alert(err);
   }
 };
  const addBoard = async() => {
    try {
      const res = await boardApi.create();
      const newList = [res,...boards];
    dispatch(setBoards(newList))
    navigate(`/boards/${res.id}`)

    } catch (error) {
      alert(error)
    }
  };
  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        // padding:'10px',
        width: sidebarWidth,
        height: "100vh",
        "& > div": { borderRight: "none" },
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: "100vh",
          backgroundColor: assets.colors.secondary,
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid white",
              padding: "10px",
              backgroundColor: "black",
              // borderRadius:'10px'
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <Grid
          sx={{
            display: "flex",
            gap: "10px",
            maxWidth: "100%",
            marginTop: "15px",
            marginLeft: "5px",
          }}
        >
          <Item
            sx={{ width: "20%", cursor: "pointer" }}
            onClick={() => navigate("/app/pomodoro")}
          >
            <AccessTimeIcon fontSize="medium" />
          </Item>
          <Item
            sx={{ width: "20%", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <CheckIcon fontSize="medium" />
          </Item>
          <Item
            sx={{ width: "20%", cursor: "pointer" }}
            onClick={() => navigate("/app/music")}
          >
            <LibraryMusicIcon fontSize="medium" />
          </Item>
        </Grid>
        <Box sx={{ paddingTop: "10px" }} />
        <FavouriteList />
        <Box sx={{ paddingTop: "10px" }} />
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Typography variant="h5" fontWeight="1000">
              Boards
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            key={"list-board-droppable-key"}
            droppableId={"list-board-droppable"}
          >
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
                          pl: "20px",
                          cursor: snapshot.isDragging
                            ? "grab"
                            : "pointer!important",
                          borderRadius: "20px",
                          marginTop: "20px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            padding: "12px",
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
  );
};

export default Sidebar;
