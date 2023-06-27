import React, { useEffect } from 'react'

import styled from 'styled-components';
import Tags from './Tags/Tags';
import Timer from './Timer/Timer';

import { Box} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import authApi from '../../api/authApi';
import { setLongBreakTime, setShortBreakTime, setWorkTime } from '../../redux/features/pomodoro';
const Pomodoro = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.value.email);
  // useEffect(async()=>{
  //   const data =await authApi.findMe({ email });
  //   dispatch(setWorkTime(data.user.worktime));
  //   dispatch(setShortBreakTime(data.user.shortbreaktime));
  //   dispatch(setLongBreakTime(data.user.longbreaktime));
    

  // }, [])
  useEffect(()=>{
    const setData = async ()=>{
        const data =await authApi.findMe({ email });
        dispatch(setWorkTime(data.user.worktime));
        dispatch(setShortBreakTime(data.user.shortbreaktime));
        dispatch(setLongBreakTime(data.user.longbreaktime));
    }
    setData();
  }, [])
  return (
    <>
      {/*  back to main app*/}
     
      <Title>Pomodoro</Title>
      {/* work short break and long break componets */}
      <Tags />

      {/* timer compoent */}
      <Timer />
      {/* setting  */}

      {/* <Link to="/">to main app</Link> */}
      <Box
        sx={{
          mt: "10px",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>
    </>
  );
}

export default Pomodoro;
const Title = styled.h1`
font-size: 2rem;
text-align: center;
`