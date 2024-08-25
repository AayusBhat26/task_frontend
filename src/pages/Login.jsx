import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.login({ username, password })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
      })
      setLoading(false)
    }
  }

  return (
    <Paper
  elevation={8}
  sx={{
    p: 4,
    borderRadius: 4,
    maxWidth: 420,
    mx: 'auto',
    mt: 8,
    backgroundColor: '#f0f0f0',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    border: '2px solid transparent',
    transition: 'border 0.3s ease',
    '&:hover': {
      border: '2px solid #8e44ad', // Purple color on hover
      boxShadow: '0px 15px 25px rgba(142, 68, 173, 0.3)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 'inherit',
      border: '2px solid #8e44ad', // Initial purple border
      opacity: 0.5,
      zIndex: -1,
      transition: 'transform 0.3s ease-in-out',
      transform: 'scale(1.05)',
    },
    '&:hover::before': {
      transform: 'scale(1.08)', // Slightly enlarge the border on hover
    },
  }}
>
  <Typography 
    variant="h4" 
    align="center" 
    gutterBottom
    sx={{ fontWeight: 'bold', color: '#2c3e50' }}
  >
    Welcome Back
  </Typography>
  <Box
    component='form'
    sx={{ mt: 2 }}
    onSubmit={handleSubmit}
    noValidate
  >
    <TextField
      margin='normal'
      required
      fullWidth
      id='username'
      label='Username'
      name='username'
      disabled={loading}
      error={usernameErrText !== ''}
      helperText={usernameErrText}
      variant='outlined'
      InputProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: '#e8eaf6',
          color: '#2c3e50',
        },
      }}
      InputLabelProps={{
        sx: { color: '#2c3e50' },
      }}
    />
    <TextField
      margin='normal'
      required
      fullWidth
      id='password'
      label='Password'
      name='password'
      type='password'
      disabled={loading}
      error={passwordErrText !== ''}
      helperText={passwordErrText}
      variant='outlined'
      InputProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: '#e8eaf6',
          color: '#2c3e50',
        },
      }}
      InputLabelProps={{
        sx: { color: '#2c3e50' },
      }}
    />
    <LoadingButton
      sx={{
        mt: 3,
        mb: 2,
        borderRadius: 2,
        paddingY: 1.5,
        backgroundColor: '#3498db',
        color: 'white',
        '&:hover': {
          backgroundColor: '#2980b9',
        },
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
      variant='contained'
      fullWidth
      type='submit'
      loading={loading}
    >
      Login
    </LoadingButton>
  </Box>
  <Typography align="center">
    <Button
      component={Link}
      to='/signup'
      sx={{ 
        textTransform: 'none',
        color: '#3498db',
        fontWeight: 'bold',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      Don't have an account? Sign up
    </Button>
  </Typography>
</Paper>

  )
}

export default Login
