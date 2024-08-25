import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmPassword = data.get('confirmPassword').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }
    if (confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Please fill this field')
    }
    if (password !== confirmPassword) {
      err = true
      setConfirmPasswordErrText('Confirm password does not match')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.signup({
        username, password, confirmPassword
      })
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
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg)
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
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#2c3e50' }}
      >
        Create Account
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
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
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
          Signup
        </LoadingButton>
      </Box>
      <Typography align="center">
        <Button
          component={Link}
          to='/login'
          sx={{ 
            textTransform: 'none',
            color: '#3498db',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Already have an account? Login
        </Button>
      </Typography>
    </Paper>
  )
}

export default Signup
