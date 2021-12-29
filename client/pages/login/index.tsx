<<<<<<< HEAD
import React, { useState } from 'react'

import { TextInput } from '../../components/inputs/TextInput'
import { ErrorMessage, FormContainer } from './Login.styled'
=======
import React from 'react'

import { TextInput } from '../../components/inputs/TextInput'
import { FormContainer } from './Login.styled'
>>>>>>> 5d41cd2916120f7704015df998677e4fd67764dc
import { useForm } from '../../hooks/useForm'
import { LoginButton } from './Login.styled'

export default function Login() {
  const [loginData, onChangeHandler] = useForm({
    email: '',
    password: ''
  })
<<<<<<< HEAD
  const [error, setError] = useState(false)
=======
>>>>>>> 5d41cd2916120f7704015df998677e4fd67764dc

  const submitHandler = async () => {
    if (!loginData.email || !loginData.password) return

    const res = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginData)
    })

<<<<<<< HEAD
    if (!res.ok) return setError(true)
    const data = await res.json()
=======
    const data = await res.json()
    console.log('data :>> ', data)
>>>>>>> 5d41cd2916120f7704015df998677e4fd67764dc
  }

  return (
    <FormContainer>
      <TextInput
        label="Email"
        value={loginData.email}
        name="email"
        onChange={onChangeHandler}
      />
      <TextInput
        label="Password"
        type="password"
        value={loginData.password}
        name="password"
        onChange={onChangeHandler}
      />
<<<<<<< HEAD

      {error && <ErrorMessage>Invalid email or password</ErrorMessage>}
=======
>>>>>>> 5d41cd2916120f7704015df998677e4fd67764dc
      <LoginButton onClick={submitHandler}>Login</LoginButton>
    </FormContainer>
  )
}
