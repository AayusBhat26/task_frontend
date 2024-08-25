import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";

let timer;
const timeout = 500;

const Kanban = (props) => {
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          color: "black",
          justifyContent: "space-between",
          padding: "10px",
          // backgroundColor: '#3a3a3a', // Darker background color
          border: "1px solid #2c2c2c", // Darker border
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Slightly stronger shadow
          transition: "background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition for background and shadow
          "&:hover": {
            backgroundColor: "#4a4a4a", // Darker gray on hover
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            onClick={createSection}
            sx={{
              color: "white", // White text color
              fontWeight: "bold", // Bold text
              textShadow: "0 0 10px rgba(255, 255, 255, 0.6)", // Glowing effect on text
              transition: "text-shadow 0.3s ease", // Smooth transition for text shadow
              "&:hover": {
                textShadow: "0 0 15px rgba(255, 255, 255, 1)", // Stronger glow on hover
              },
            }}
          >
            Add section
          </Button>
          <Typography variant="body2"  sx={{ color: "text.primary", fontSize:"8px" }} >Note: Ctrl + i to hide/Show sidebar</Typography>
        </Stack>

        <Typography
          variant="body2"
          fontWeight="700"
          sx={{
            color: "white", // White text color
            textShadow: "0 0 10px rgba(255, 255, 255, 0.6)", // Glowing effect on text
            transition: "text-shadow 0.3s ease", // Smooth transition for text shadow
            "&:hover": {
              textShadow: "0 0 15px rgba(255, 255, 255, 1)", // Stronger glow on hover
            },
          }}
        >
          {data.length} Sections
        </Typography>
      </Box>

      <Divider sx={{ margin: "10px 0" }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "calc(100vw - 400px)",
            overflowX: "auto",
            padding: "20px 10px", // Increased padding for spacing
            // background: 'linear-gradient(135deg, #2d2d2d, #434343)', // Gradient background
            borderRadius: "12px", // Softer corners
          }}
        >
          {data.map((section) => (
            <div
              key={section.id}
              style={{ width: "300px", marginRight: "25px" }}
            >
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      padding: "15px",
                      marginRight: "15px",
                      backgroundColor: "#ffffff", // White background for contrast
                      borderRadius: "12px",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)", // Softer, deeper shadow
                      transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth transform and shadow
                      "&:hover": {
                        transform: "scale(1.02)", // Slight zoom on hover
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        value={section.title}
                        onChange={(e) => updateSectionTitle(e, section.id)}
                        placeholder="Untitled"
                        variant="outlined"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-input": {
                            padding: 0,
                            color: "#333",
                          }, // Dark text on light background
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset",
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
                          color: "#666",
                          "&:hover": { color: "#28a745" }, // Different hover color for add icon
                        }}
                        onClick={() => createTask(section.id)}
                      >
                        <AddOutlinedIcon />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "#666",
                          "&:hover": { color: "#dc3545" }, // Different hover color for delete icon
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
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                              backgroundColor: "#f9f9f9", // Light background for task cards
                              color: "#333", // Dark text for readability
                              border: "1px solid #ddd", // Subtle border for definition
                              borderRadius: "8px",
                              boxShadow: snapshot.isDragging
                                ? "0 6px 12px rgba(0, 0, 0, 0.1)"
                                : "0 4px 8px rgba(0, 0, 0, 0.05)", // Lighter shadow
                              transition:
                                "background-color 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <Typography sx={{ color: "#333" }}>
                              {task.title === "" ? "Untitled" : task.title}
                            </Typography>
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
