import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";
import "../../css/custom-scrollbar.css"
import authApi from "../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
let timer;
const timeout = 500;

const Kanban = (props) => {
  const dispatch = useDispatch();
  const boardId = props.boardId;
  const userId = useSelector((state)=>state.user.value._id)
  const [data, setData] = useState([]);
  // const email = useSelector((state)=>state.value.email);
  const email = useSelector((state)=>state.user.value.email)
  console.log(email, point);
  const [selectedTask, setSelectedTask] = useState(undefined);
  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  const [singleComplete, setSingleCompleted]= useState(false);
  useEffect(() => {
    const pointsDisplay = async () => {
      try {
        const data = await authApi.findMe(email);
        const point = data.user.points;
        // console.log(data.user./points);
        setPointsState(point);
        // setLevelState(data.user.level);
        dispatch(setPoints(point));
      } catch (error) {
        console.log(error);
      }
    };
    pointsDisplay();
  }, []);
  useEffect(() => {
    const pointsDisplay = async () => {
      try {
        const data = await authApi.findMe(email);
        const point = data.user.points;
        // console.log(data.user./points);
        setPointsState(point);
        // setLevelState(data.user.level);
        dispatch(setPoints(point));
      } catch (error) {
        console.log(error);
      }
    };
    pointsDisplay();
  }, [pointsStaet]);
  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e.id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId);
      setData([...data, section]);
    } catch (err) {
      alert(err);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      const newData = [...data].filter((e) => e.id !== sectionId);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId });
      const newData = [...data];
      const index = newData.findIndex((e) => e.id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const onUpdateTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDeleteTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e.id === task.id
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };
  const checked =async(e, taskId)=>{
    // const userId = 
    if(e.target.checked===true ){
      try {
        // if(taskCompleted.task.completed===false){
          // alert("false")
          const points = point;
          const res = await authApi.updatePoints({
            email,
            points,
          });
          setPointsState(res.points);

        // }
        await authApi.updateCompleted({
          user: userId,
          taskId,
        });
        const taskCompleted = await authApi.updateCompleted({
          taskId,
        });
        
    
      } catch (error) {
        console.log(error);
      }
    }

    
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={createSection}>Create New Section</Button>
      </Box>
      <Divider sx={{ margin: "10px 0" }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box

          sx={{
            display: "flex",
            alignItems: "flex-start",
            // justifyContent:"center",
            width: "calc(100vw - 380px)",
            overflowX: "auto",
            backgroundColor: "rgb(35,33,40)",
            height: "60vh",
            borderRadius: "10px",
          }}
        >
          {data.map((section) => (
            <div key={section.id} style={{ width: "300px" }}>
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      padding: "10px",
                      marginRight: "10px",
                      borderRadius: "10px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <TextField
                        value={section.title}
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        placeholder="Untitled"
                        variant="outlined"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-input": { padding: 0 },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset ",
                          },
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1rem",
                            fontWeight: "700",
                          },
                        }}
                      />
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "gray",
                          "&:hover": { color: "green" },
                        }}
                        onClick={() => createTask(section.id)}
                      >
                        <AddOutlinedIcon />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "gray",
                          "&:hover": { color: "red" },
                        }}
                        onClick={() => deleteSection(section.id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                    {/* tasks */}
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: "10px",
                              marginBottom: "10px",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",

                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                            }}
                          >
                            <Box
                              onClick={() => setSelectedTask(task)}
                              sx={{ width: "90%" }}
                            >
                              <Typography>
                                {task.title === "" ? "Untitled" : task.title}
                              </Typography>
                            </Box>
                            <Box>
                              <Checkbox onClick={e=>checked(e, task.id)} />
                            </Box>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  );
};

export default Kanban;
