// import React from 'react'
import { Box, IconButton, Input, InputLabel } from "@mui/material";
import { useState } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveTag,
  setCurrentTime,
  setLongBreakTime,
  setShortBreakTime,
  setWorkTime,
} from "../../../redux/features/pomodoro";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Form, useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import pomodoroApi from "../../../api/pomodoroApi";
const Tags = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const email = useSelector((state)=>state.user.value.email)
  const [open, setOPen] = useState(false);
  const [worktimeState, setWorkTimeState] = useState(0)
  const [shortbreakstate,setshortbreakstate] = useState(0)
  const [longbreakstate, setlongbreakstate] = useState(0);
  const { worktime, shortbreaktime, longbreaktime } = useSelector(
    (state) => state.pomodoro
  );

  const [activeTag, setActiveLocalTag] = useState(
    useSelector((state) => state.pomodoro.activeTag)
  );
  const handleTagSelection = (index) => {
    setActiveLocalTag(index);
    dispatch(setActiveTag(index));
  };
 

  const getTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min < 10 ? "0" + min : min} : ${sec < 10 ? "0" + sec : sec}`;
  };
  let worktimerip = getTime(worktime);
  let shortbreakrip = getTime(shortbreaktime);
  let longbreakrip = getTime(longbreaktime);

  if (activeTag === 0) {
    dispatch(setCurrentTime(worktime));
  } else if (activeTag === 1) {
    dispatch(setCurrentTime(shortbreaktime));
  } else if (activeTag === 2) {
    dispatch(setCurrentTime(longbreaktime));
  }
  const handleChangeWork = (e)=>{

    setWorkTimeState(e.target.value * 60);
  }
  const handleChangeShortBreak = (e)=>{
    setshortbreakstate(e.target.value * 60);
  }
  const handleChangeLongtBreak = (e)=>{
    setlongbreakstate(e.target.value * 60);
  }
  // updating the data in store
   const handleSubmit = async() => {
     try {
      dispatch(setWorkTime(worktimeState));
      dispatch(setShortBreakTime(shortbreakstate));
      dispatch(setLongBreakTime(longbreakstate));
      setOPen(false);
      await authApi.updatePomodoro( {
        shortbreaktime:shortbreakstate,
        worktime: worktimeState,
        longbreaktime:longbreakstate,
      });
     } catch (error) {
      console.log(error);
     }
   };
   const navigateBack = ()=>{
    navigate("/");
   }
  return (
    <Box
      sx={{
        width: "100%",
        height: "80%",
        display: "flex",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <IconButton onClick={navigateBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <TagsContainer>
        {["WORK", "SHORT BREAK", "LONG BREAK"].map((singleTag, index) => (
          <Tag
            onClick={() => handleTagSelection(index)}
            activeTag={activeTag === index}
            key={index}
          >
            {singleTag}
          </Tag>
        ))}
      </TagsContainer>
      {/* keyboard down */}
      <IconButton sx={{ marginLeft: "10px" }} onClick={() => setOPen(true)}>
        <KeyboardArrowDownIcon sx={{ width: "100%" }} />
      </IconButton>
      <Dialog
        components={Form}
        // onSubmit={handleSubmit}
        open={open}
        maxWidth="xl"
        fullWidth
        onClose={() => setOPen(false)}
        aria-labelledby="dialog-title"
        aira-aria-describedby="dialog-description"
      >
        <DialogTitle
          id="dialog-title"
          textAlign="center"
          sx={{ fontSize: "40px" }}
        >
          Settings
        </DialogTitle>
        <DialogContent sx={{ display: "grid", placeItems: "center" }}>
          <>
            <InputLabel sx={{ fontSize: "20px" }}>Working Time</InputLabel>
            <Input
              autoFocus
              placeholder={worktimerip}
              sx={{ width: "50%", marginTop: "10px" }}
              onChange={handleChangeWork}
            />
            <InputLabel sx={{ fontSize: "20px" }}>Short Break</InputLabel>
            <Input
              autoFocus
              placeholder={shortbreakrip}
              sx={{ width: "50%", marginTop: "10px" }}
              onChange={handleChangeShortBreak}
            />
            <InputLabel sx={{ fontSize: "20px" }}>Long Break</InputLabel>
            <Input
              autoFocus
              type="number"
              placeholder={longbreakrip}
              onChange={handleChangeLongtBreak}
              sx={{ width: "50%", marginTop: "10px" }}
            />
          </>
        </DialogContent>
        <Input type="submit" onClick={handleSubmit} sx={{ outline: "none" }} />
      </Dialog>
    </Box>
  );
};

export default Tags;

const TagsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1;
  background-color: #201d22;
  height: 4rem;
  width: 70vw;
  border-radius: 12px;
`;
const Tag = styled.button`
  all: unset;
  text-align: center;
  cursor: pointer;
  flex: 1;
  height: 3.5rem;
  border-radius: 10px;
  /* background-color: ; */
  ${({ activeTag }) =>
    activeTag &&
    css`
      background-color: #2b2b2b;
    `}
`;
