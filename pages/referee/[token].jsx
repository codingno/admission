import React, { useState, useEffect } from 'react'
import { Button, TextareaAutosize, Grid, Card, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, FormHelperText, Stack, Typography, TextField, capitalize, } from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession, signIn, signOut } from "next-auth/react"
import { Controller, useForm } from 'react-hook-form';

import DashboardLayout from '../../components/dashboard'

export default function RefereeForm() {

	const router = useRouter()
	const { data: session, status : statusSession } = useSession();
	const { handleSubmit, watch, setValue, control, formState : { errors }, reset } = useForm();

	const { token } = router.query

	const [referee, setReferee] = useState(null)

	useEffect(() => {
		if(token)
			checkToken()

		async function checkToken() {
			try {
				const { data } = await axios.get('/api/referee/' + token)
				setReferee(data)
				// ability_to_organize: "Good"
				// ability_to_work: "Moderate"
				// intellectual_ability: "Very Good"
				// motivation: "Good"
				// oral_communication_skills: "Good"
				// overall_assesment: "asdfasdfadsf"
				// recommendation: "A"
				// written_communication_skills: "Good"
				if(session)
					reset(data.referee_recommendation_form[0])
			} catch (error) {
				if(error.response)	
					alert(error.response.data)
				else
					alert(error)
				signOut({ callbackUrl: '/' })				
			}	
		}
	}, [token, session])

	async function submitForm(data) {
		try {
			if(confirm("Are you sure to submit this form?")) {
				const response = await axios.post('/api/referee/' + token, data)
				alert("Data Saved")
				signOut({ callbackUrl: '/' })				
			}
		} catch (error) {
			if(error.response)	
				alert(error.response.data)
			else
				alert(error)
		}	
	}
	
	if(!referee)
		return ""

	return (
        <DashboardLayout>
					<Grid
						container
						spacing={1}
						direction="row"
						justifyContent="center"
						alignItems="center"
						alignContent="center"
						wrap="wrap"
						sx={{
							width : '100%',
							// height : '100%',
							minHeight : '600px',
						}}						
					>
						<Grid
							item
							sx={{
								width : '100%',
								height : '100%',
							}}						
						>
							<Card
							sx={{
								width : '100%',
								height : '100%',
								// backgroundColor : '#000',
								paddingBottom : '100px',
							}}						
							>
								<Stack
									pt={2}
									// px={3}
									justifyContent="center"
									alignItems="center"
								>
									<Typography variant="h4" color="initial">Letter of Recommendation Form</Typography>
								</Stack>
								<Stack
									pt={2}
									px={3}
								>
									<form onSubmit={handleSubmit(submitForm)} style={{ position : 'relative', }}>
									<Typography variant="h6" color="initial">A. Applicant Data</Typography>
									<Grid container spacing={0}>
										<Grid item xs={3}	
										>
											<Typography variant="body1" color="initial" pl={3} >Selection Number</Typography>
											<Typography variant="body1" color="initial" pl={3} >Name of Applicant</Typography>
											<Typography variant="body1" color="initial" pl={3} >ID Number / Passport No.</Typography>
											<Typography variant="body1" color="initial" pl={3} >Faculty Name</Typography>
										</Grid>
										<Grid item xs={9}	
										>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.personal.id}</span></Typography>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.personal.personal_detail[0]?.family_name + ' ' + referee.personal.personal_detail[0]?.given_name}</span></Typography>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.personal.personal_detail[0]?.national_identity_number || referee.personal.personal_detail[0]?.passport_no}</span></Typography>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.personal.proposed_study[0]?.course_title}</span></Typography>
										</Grid>
									</Grid>
									<Typography variant="h6" color="initial">B. Referee data</Typography>
									<Grid container spacing={0}>
										<Grid item xs={3}	
										>
											<Typography variant="body1" color="initial" pl={3} >Name</Typography>
											<Typography variant="body1" color="initial" pl={3} >Position</Typography>
											<Typography variant="body1" color="initial" pl={3} >Relation to applicant</Typography>
										</Grid>
										<Grid item xs={9}	
										>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.family_name + ' ' + referee.given_name}</span></Typography>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.position}</span></Typography>
											<Typography variant="body1" color="initial" pl={3} >: <span style={{ fontWeight : 600, paddingLeft : '1rem', }}>{referee.relationship_to_applicant}</span></Typography>
										</Grid>
									</Grid>
									<Typography variant="h6" color="initial">C. Competence</Typography>
									<Grid container spacing={1}>
										<Grid item xs={7}
										>
											{/* <ul style={{ listStyleType : 'none', }}> */}
											<ol>
												<li>
													<ControllerTextField control={control} name="intellectual_ability" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Intellectual Ability</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Poor" control={<Radio disabled={session} />} label="Poor" />
																		<FormControlLabel value="Moderate" control={<Radio disabled={session} />} label="Moderate" />
																		<FormControlLabel value="Good" control={<Radio disabled={session} />} label="Good" />
																		<FormControlLabel value="Very Good" control={<Radio disabled={session} />} label="Very Good" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</li>
												<li>
													<ControllerTextField control={control} name="oral_communication_skills" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Oral communication skills</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Poor" control={<Radio disabled={session} />} label="Poor" />
																		<FormControlLabel value="Moderate" control={<Radio disabled={session} />} label="Moderate" />
																		<FormControlLabel value="Good" control={<Radio disabled={session} />} label="Good" />
																		<FormControlLabel value="Very Good" control={<Radio disabled={session} />} label="Very Good" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</li>
												<li>
													<ControllerTextField control={control} name="written_communication_skills" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Written communicatioin skills</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Poor" control={<Radio disabled={session} />} label="Poor" />
																		<FormControlLabel value="Moderate" control={<Radio disabled={session} />} label="Moderate" />
																		<FormControlLabel value="Good" control={<Radio disabled={session} />} label="Good" />
																		<FormControlLabel value="Very Good" control={<Radio disabled={session} />} label="Very Good" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</li>
												<li>
													<ControllerTextField control={control} name="ability_to_work" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Ability to work independently</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Poor" control={<Radio disabled={session} />} label="Poor" />
																		<FormControlLabel value="Moderate" control={<Radio disabled={session} />} label="Moderate" />
																		<FormControlLabel value="Good" control={<Radio disabled={session} />} label="Good" />
																		<FormControlLabel value="Very Good" control={<Radio disabled={session} />} label="Very Good" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</li>
												<li>
													<ControllerTextField control={control} name="ability_to_organize" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Ability to organize workload</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Poor" control={<Radio disabled={session} />} label="Poor" />
																		<FormControlLabel value="Moderate" control={<Radio disabled={session} />} label="Moderate" />
																		<FormControlLabel value="Good" control={<Radio disabled={session} />} label="Good" />
																		<FormControlLabel value="Very Good" control={<Radio disabled={session} />} label="Very Good" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</li>
												<li>
													<ControllerTextField control={control} name="motivation" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" 
																		sx={{ fontWeight : 700, }} 
																		>Motivation</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Poor" control={<Radio disabled={session} />} label="Poor" />
																		<FormControlLabel value="Moderate" control={<Radio disabled={session} />} label="Moderate" />
																		<FormControlLabel value="Good" control={<Radio disabled={session} />} label="Good" />
																		<FormControlLabel value="Very Good" control={<Radio disabled={session} />} label="Very Good" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</li>
											</ol>
										</Grid>
									</Grid>
									<Typography variant="h6" color="initial">D. Overall Assessment</Typography>
									<Typography variant="body1" color="initial">
										Please use this box to provide an overall assesment of the applicant. This includes the constructive review of performance based on your interaction with the applicant. (max 300 words).
									</Typography>
													<ControllerTextField control={control} name="overall_assesment" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset"
																	sx={{ width : '100%', maxWidth : '100%', }}
																>
																	<TextareaAutosize 
																		minRows={5}
																		style={{width : '100%', margin : '1rem 0',}}
																		{...props}
																		disabled={session}
																	/>
																</FormControl>
															)
														}}
													/>
									<Typography variant="h6" color="initial">E. Recommendation</Typography>
									<Typography variant="body1" color="initial">
										Please select one of the following by placing a cross next to the relevant statement
									</Typography>
									<ControllerTextField control={control} name="recommendation" 
										rules={{
											required : "This field is required.",
											validate : x => x !== '',
										}}
										CustomComponent={function(props) {
											return (
												<FormControl component="fieldset" sx={{ marginTop : '1rem', }}>
													{/* <FormLabel component="legend" 
														sx={{ fontWeight : 700, }} 
														>Motivation</FormLabel> */}
													<RadioGroup  {...props} >
														<Stack
															direction="column"
															justifyContent="space-between"
															sx={{
																width : '100%',
															}}
														>
														<FormControlLabel value="A" control={<Radio disabled={session} />} label="I strongly recommended this applicant for the above program of study" />
														<FormControlLabel value="B" control={<Radio disabled={session} />} label="I recommended the applicant for the above program of study" />
														<FormControlLabel value="C" control={<Radio disabled={session} />} label="I do not recommended this applicant for the above program of study" />
														</Stack>
													</RadioGroup>
													<FormHelperText></FormHelperText>
												</FormControl>
											)
										}}
									/>
									<Stack
										direction="row"
										sx={{
											width : '100%',
											// position : 'absolute',
											// bottom : 0,
											// right : '1rem',
										}}
									>
										{
											!session &&
										<Button variant="contained" sx={{ width : '250px', margin : '2rem 0 1rem 0', }} onClick={() => {
												// router.query.state = "applicant-declaration"	
												// router.push(router)
										}}
										// disabled={(!understanding || !agreement) && loading}
										type="submit"
										>
											Submit</Button>
										}
									</Stack>
									</form>
								</Stack>
								</Card>
								</Grid>
								</Grid>
								</DashboardLayout>
	)
}

function ControllerTextField({control, name, CustomComponent, label, rules, sx }) {
	return (
		<Controller
			control={control}
			rules={{
				required : rules?.required,
				validate : rules?.validate,
			}}
			name={name}
			render={({ field : { onChange, onBlur, value, ref }}) => (
				<>
				{
					CustomComponent ?
					<CustomComponent 
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						ref={ref}
						label={name ? name.split('_').map(x => capitalize(x)).join(' ') : ''}
					/>
					:
				<TextField
					size='small'
					onChange={onChange}
					onBlur={onBlur}
					value={value}
					ref={ref}
					// label={label || (name ? name.split('_').map(x => capitalize(x)).join(' ') : '')}
					sx={{
						margin : '.25rem 0',
						width : '100%',
						maxWidth : '600px',
						...sx
					}}
				/>														
				}
				</>
			)}
		/>
	)	
}