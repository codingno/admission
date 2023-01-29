import React, { useState, useEffect, } from 'react'
import { useRouter } from 'next/router'
import { Modal, Box, Card, Typography, TextField, Button, Stack } from '@mui/material'
import axios from 'axios'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
	// border : 'transparent solid thin',
  // boxShadow: 24,
  p: 4,
};

export default function ResetPassword() {
	const router = useRouter()
	
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const { token } = router.query

	useEffect(() => {
		if(token)
			checkToken()

		async function checkToken() {
			try {
				const { data } = await axios.get('/api/reset-password/' + token)
			} catch (error) {
				if(error.response)
					alert(error.response.data)	
				else
					alert(error)	
			}	
		}	
	}, [token])
	
	async function changePassword(e) {
		e.preventDefault()
		if(confirm("Are you sure to change password?"))
			try {
				if(password !== confirmPassword)
					return alert("Confirm Password different.")
				const { data } = await axios.post('/api/reset-password/' + token, {password})
				router.push('/auth/authentication/signin')
			} catch (error) {
					if(error.response)
						alert(error.response.data)	
					else
						alert(error)	
			}	
	}

	return (
		<Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={style}>
						<form onSubmit={changePassword}>
					<Stack
						spacing={2}
						justifyContent="center"
						alignItems="center"
					>
          <Typography id="modal-modal-title" variant="h6" component="h2">
						Reset New Password
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
					<TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} label="New Password" />
					<TextField type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="New Password" />
					<Button type="submit" variant="contained">Change Password</Button>
					</Stack>
						</form>
					</Card>
      </Modal>
	)
}
