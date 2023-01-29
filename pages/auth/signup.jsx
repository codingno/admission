import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'

import FormContainer from '../../components/form/FormContainer'


function Signup() {
	const [fullname, setfullname] = useState("")
	const [email, setemail] = useState("")
	const [pass, setpass] = useState("")
	return (
			<Grid
				container
				spacing={1}
				direction="row"
				justifyContent="center"
				alignItems="center"
				alignContent="center"
				wrap="wrap"
			sx={{
				width : '100vw',
				height : '100vh',
			}}
				
			>
			<Grid item xs={5} justifyContent="center">

				
			<Card
				sx={{
					maxWidth : '500px',
				}}
			>
				<Typography variant="h3" color="primary" textAlign="center">Sign Up</Typography>
				<form>
						<FormContainer
							id="fullname"
							label="Fullname"
							value={fullname}
							onChange={(e) => setfullname(e.target.value)}
							
						/>
						<FormContainer
							id="email"
							label="Email"
							value={fullname}
							onChange={(e) => setfullname(e.target.value)}
							
						/>
						<FormContainer
							id="password"
							label="Password"
							value={fullname}
							onChange={(e) => setfullname(e.target.value)}
							
						/>
						
				</form>
			</Card>
			
			</Grid>
			</Grid>
	)
}

export default Signup