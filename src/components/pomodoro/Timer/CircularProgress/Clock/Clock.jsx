import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  ToggleButtonPauseStart,
  setActiveState,
  setTotalTime,
} from "../../../../../redux/features/pomodoro";
const Clock = () => {
  // console.log(setActiveState);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [time, setTime] = useState(
    useSelector((state) => state.pomodoro.current)
  );
  let {current, worktime} = useSelector((state)=>state.pomodoro)
  useEffect(()=>{
    setTime(current)
  }, [current])
  const isActive = useSelector((state) => state.pomodoro.isActive);
  useEffect(() => {
    // timer value decrease,
    if (isActive && time > 0) {
      const interval = setInterval(() => {
        // decreasing timer
        setTime((time) => time - 1);
        // dispatch()
      }, 1000);
      return () => clearInterval(interval);
    }
      if (worktime > time) {
        setTotal(worktime - time)
        dispatch(setTotalTime(worktime-time));
        // 25 minutes k baad API call
      }
      // if(time===0){
      //   // alert('hi')
      //   setTime(worktime)
      // }
  }, [time, isActive]);
        console.log(total);

  const getTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min < 10 ? "0" + min : min} : ${sec < 10 ? "0" + sec : sec}`;
  };
  const resetTime = ()=>{
    setTime(worktime);
  }
  return (
    <ClockContainer>
      <TimerText>{getTime(time)}</TimerText>
      <StartPauseButton onClick={() => dispatch(ToggleButtonPauseStart())}>
        {isActive ? "PAUSE" : "START"}
      </StartPauseButton>
      {time === 0 && <ResetButton onClick={resetTime}>Reset</ResetButton>}
    </ClockContainer>
  );
};

export default Clock;
const ClockContainer = styled.div`
  display: grid;
  place-items: center;
`;
const TimerText = styled.h4`
  font-size: 50px;
`;
const StartPauseButton = styled.button`
  all: unset;
  color: blue;
  text-align: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 1000;
  text-transform: uppercase;
  letter-spacing: 5px;
  background-color: rgb(25, 22, 28);
  padding: 12px;
  border-radius: 20px;
  box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px,
    rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
`;
const ResetButton = styled(StartPauseButton)`
margin-top: 10px;
color: red;
`