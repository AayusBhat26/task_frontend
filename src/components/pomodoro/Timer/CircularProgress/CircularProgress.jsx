import { useEffect, useState } from "react"
import styled from "styled-components"
import Clock from "./Clock/Clock";
import { useDispatch, useSelector } from "react-redux";
import {setProgress} from "../../../../redux/features/pomodoro.js"
const CircularProgress = () => {
   const dispatch = useDispatch();
  const [progress, setProgressState] = useState(
    useSelector((state) => state.pomodoro.progress)
  );
  const { worktime, current } = useSelector((state) => state.pomodoro);
  console.log(progress, current, worktime);
  useEffect(() => {
    console.log(progress);

    setProgressState(progress)
    dispatch(setProgress(current / (worktime / 100)));
  }, [progress, worktime]);
  return (
    <OuterCircle progress={progress}>
      <InnerCircle>
        <Clock />
      </InnerCircle>
    </OuterCircle>
  );
}

export default CircularProgress
const OuterCircle = styled.div`
  width: 35rem;
  height: 35rem;
  border: 1px solid white;
  /* margin: 2rem auto; */
  border-radius: 50%;
  /* background-color: #175dd6; */
  display: grid;
  place-items: center;
  background: conic-gradient(
    #272727 ${({ progress }) => progress}%,
    white ${({ progress }) => progress}%
  );
`;
const InnerCircle = styled.div`
  width: 33rem;
  height: 33rem;
  border: 1px solid white;
  /* margin: 2rem auto; */
  border-radius: 50%;
  background-color: #7b40c1;
  display: grid;
  place-items: center;
`;