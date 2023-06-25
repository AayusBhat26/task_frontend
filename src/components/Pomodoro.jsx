import React from 'react'
import Sidebar from './common/Sidebar'
import { Link } from 'react-router-dom'

const Pomodoro = () => {
  return (
    <>
    {/* <Sidebar/> */}
    <div>Pomodoro</div> 
    <Link to="/">to main app</Link>
    </>
  )
}

export default Pomodoro
