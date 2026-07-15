import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const login = async () => {
    event.preventDefault()
    const loggedIn = await handleLogin(username, password)
    if (loggedIn) {
      navigate('/')
    }
    setUsername('')
    setPassword('')
  }

  const style = { marginBottom: 10 }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={login}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            style={style}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            style={style}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          style={style}
        >
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
