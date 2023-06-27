
// import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import CircularProgress from "./CircularProgress/CircularProgress";

const Timer = () => {
  return (
    <TimerContainer>
      
      <CircularProgress />
    </TimerContainer>
  );
}


export default Timer
const TimerContainer = styled.div`
  background: conic-gradient(#7b40c1, #19161c 150deg);
  width: 45rem;
  height: 45rem;
  border: 1px solid white;
  margin: 2rem auto;
  margin-top: 5rem;
  border-radius: 50%;
  background-color: #2b2b2b;
  display: grid;
  place-items: center;
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
`;
