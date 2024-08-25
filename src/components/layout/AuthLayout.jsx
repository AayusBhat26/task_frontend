import { Container, Box, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import assets from '../../assets'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Container component='main' maxWidth='xs'>
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          {/* <img src={assets.images.logoDark} style={{ width: '100px' }} alt='app logo' /> */}
          <Typography
  sx={{
    fontSize: '32px',
    fontWeight: 'bold',
    width:'90vw',
    letterSpacing: '0.5px',
    color: 'whitesmoke',
    textAlign: 'center',
    textTransform: 'uppercase',
    mb: 2, // Adds margin-bottom for spacing
    '&:after': {
      content: '""',
      display: 'block',
      width: '60px',
      height: '4px',
      backgroundColor: '#3498db',
      margin: '8px auto 0',
      borderRadius: '2px',
    },
  }}
>
  PROD - Kanban and Notes
</Typography>
          <Outlet />
        </Box>
      </Container>
    )
  )
}

export default AuthLayout