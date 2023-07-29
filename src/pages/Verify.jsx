import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import VerifyForm from "../components/sections/VerifyForm";
import {useSelector } from "react-redux"
const Verify = () => {
  const [email, setEmail] = useState(
    useSelector((state) => state.user.value.email)
  );
  return (
    <>
      <Stack
        spacing={"15px"}
        sx={{
          mt: 6,
          mb: 5,
          position: "relative",
        }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="h4">Verify OTP</Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography>Email with OTP is sent to {email}</Typography>
        </Stack>
      </Stack>
      {/* verify form  */}
      <VerifyForm />
    </>
  );
};

export default Verify;
