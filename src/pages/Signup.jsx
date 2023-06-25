import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import authApi from "../api/authApi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {useSelector, useDispatch} from "react-redux"
import { setUser } from "../redux/features/userSlice";
import axios from "axios";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [emailErrText, setEmailErrText] = useState("");
  const [usernameErrText, setUsernameErrText] = useState("");
  const [firstNameErrorText, setFirstNameErrText] = useState("");
  const [lastNameErrorText, setLastNameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!confirmPasswordErrText);
  const handleMouseDownConfirmPassword = () =>
    setShowConfirmPassword(!confirmPasswordErrText);
  let err = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailErrText("");
    setUsernameErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");

    const data = new FormData(e.target);
    const firstname = data.get("firstname").trim();
    const lastname = data.get("lastname").trim();
    const email = data.get("email").trim();
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();

    if (firstname === "") {
      err = true;
      setFirstNameErrText("Please enter first name");
    }
    if (lastname === "") {
      err = true;
      setFirstNameErrText("Please enter first name");
    }
    if (username === "") {
      err = true;
      setUsernameErrText("Please fill this field");
    }
    if (email === "") {
      err = true;
      setUsernameErrText("Please fill this field");
    }
    if (password === "") {
      err = true;
      setPasswordErrText("Please fill this field");
    }
    if (confirmPassword === "") {
      err = true;
      setConfirmPasswordErrText("Please fill this field");
    }
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErrText("Confirm password not match");
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await authApi.signup({
        firstname,
        lastname,
        email,
        username,
        password,
        confirmPassword,
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      dispatch(setUser(res));
      const otp_res= await authApi.sendOtp({email})
      // console.log(otp_res)
      if(otp_res.status==="success"){
        // window.location.href='verifyOtp'
        navigate('/verifyOtp')
      }
      // navigate("/");
    } catch (err) {
      const errors = err.data.errors;
      errors.forEach((e) => {
        if (e.param === "firstname") {
          setFirstNameErrText(e.msg);
        }
        if (e.param === "lastname") {
          setLastNameErrText(e.msg);
        }
        if (e.param === "email") {
          setEmailErrText(e.msg);
        }
        if (e.param === "username") {
          setUsernameErrText(e.msg);
        }
        if (e.param === "password") {
          setPasswordErrText(e.msg);
        }
        if (e.param === "confirmPassword") {
          setConfirmPasswordErrText(e.msg);
        }
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit} noValidate>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Typography fontSize={"12px"} color={"gray"} fontWeight={700}>
            Already have an account?
          </Typography>
          <Button component={Link} to="/login" sx={{ textTransform: "none" }}>
            <Typography fontSize={"18px"} fontWeight={1000}>
              Login
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstname"
            label="First Name"
            name="firstname"
            disabled={loading}
            error={firstNameErrorText !== ""}
            helperText={firstNameErrorText}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            disabled={loading}
            error={lastNameErrorText !== ""}
            helperText={lastNameErrorText}
          />
        </Box>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          disabled={loading}
          error={usernameErrText !== ""}
          helperText={usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          disabled={loading}
          error={emailErrText !== ""}
          helperText={emailErrText}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            disabled={loading}
            error={passwordErrText !== ""}
            helperText={passwordErrText}
            type={showPassword ? "text" : "password"}
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            // type="password"
            disabled={loading}
            error={confirmPasswordErrText !== ""}
            helperText={confirmPasswordErrText}
            type={showConfirmPassword ? "text" : "password"}
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Signup
        </LoadingButton>
      </Box>
    </>
  );
};

export default Signup;
