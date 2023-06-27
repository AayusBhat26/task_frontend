import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const initialState = { 
      activeTag:0, 
      progress:0, 
      current:1500,
      worktime:1500, // by default 25 minutes work time
      shortbreaktime:300, // 5 minute short break
      longbreaktime:600,// 10 minute long breal
      isActive:false,// start or pause button
      total:0, // amount of time 
 };


export const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    toggleButton(state, action) {
      state.isActive = !state.isActive;
    },
    setActiveTag: (state, action) => {
      state.activeTag = action.payload;
    },
    setProgress: (state, action) => {
      console.log(action.payload);
      state.progress = action.payload;
    },
    setWorkTime: (state, action) => {
      state.worktime = action.payload;
    },
    setShortBreakTime: (state, action) => {
      state.shortbreaktime = action.payload;
    },
    setLongBreakTime: (state, action) => {
      state.longbreaktime = action.payload;
    },
    setCurrentTime:(state, action)=>{
      // console.log(action);
      state.current = action.payload;
      // console.log(state.current);
    }, 
    setTotalTime: (state, action)=>{
      console.log(action.payload);
      state.total = action.payload;
    }
  },
});
export function ToggleButtonPauseStart() {
  return async (dispatch, getState) => {
    dispatch(pomodoroSlice.actions.toggleButton());
  };
}


export default pomodoroSlice.reducer;
export const {
  setActiveTag,
  setProgress,
  setCurrentTime,
  setTotalTime,
  setWorkTime,
  setShortBreakTime,
  setLongBreakTime,
} = pomodoroSlice.actions;

