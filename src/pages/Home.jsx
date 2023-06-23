import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { setBoards } from "../redux/features/boardSlice";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";
import { useState } from "react";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const createBoard = async()=>{
    setLoading(true);
    try {
      const res = await boardApi.create();
      // do not forgot to uise array since in the initial state i have given arrray.
      dispatch(setBoards([res]));
      navigate(`/boards/${res._id}`);
    } catch (error) {
      alert(error)
    }finally{
      setLoading(false);
    }
  }
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingButton variant="outlined" color="success"  onClick={createBoard} loading={loading}>Create A New Board</LoadingButton>
    </Box>
  );
};

export default Home;
