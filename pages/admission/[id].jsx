import { 
	Alert,
	Button,
	Card,
	Checkbox,
	Grid,
	Stack,
	Typography, 
	TextField,
	Input,
	capitalize, FormControl, FormControlLabel, FormLabel, FormGroup, FormHelperText, RadioGroup, Radio,
} from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import DashboardLayout from '../../components/dashboard';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import axios from 'axios';

import Upload from '../upload'
import FormParent from '../../components/form/FormParent';

const states = [
	'personal-details',
	'contact-details',
	// 'emergency-contact-details',
	'financial-support',
	'proposed-study-program',
	'education-background',
	'language-ability',
	'job-status',
	'referee-details',
	'applicant-declaration',
	'document-upload',
]

const documentForUpload = [
	'ID or Passport',
	'Education certificate',
	'Certified copies of academic transcripts',
	'Motivation Letter',
	'English Certificate',
	'Arabic Certificate',
	'Curriculum Vitae',
	'Research proposal (doctoral program only)',
	'Publication (doctoral program only)',
	'Proof of Payment',
]

function handleError(error) {
	if(error.response)	
		alert(error.response.data)
	else alert(error)
}

export default function FormAdmission() {
		const router = useRouter()

		const { id } = router.query
		const { data: session, status : statusSession } = useSession();

		const [tabActive, setTabActive] = useState(router.query.state)
		const [tabState, setTabState] = useState(states.indexOf(tabActive))
		const [understanding, setUnderstanding] = useState(false)
		const [agreement, setAgreement] = useState(false)
		const [otherDocument, setOtherDocument] = useState("")
		const [loading, setLoading] = useState(false)
		const [reload, setReload] = useState(false)

		const [dataSaved, setDataSaved] = useState(null)

		const { handleSubmit, watch, setValue, control, formState : { errors }, reset, } = useForm();
		const watchAllFields = dataSaved ? watch() : {}
		const watchJobStatus = watch("job_status_type")

		useEffect(() => {
			if(id)
				getDataSaved()

			async function getDataSaved() {
				try {
					const { data } = await axios.get('/api/admission/' + id)
					if(data) {
						let resetData = {}
						const tableName = Object.keys(data).filter(x => Array.isArray(data[x]))
						tableName.map(x => {
							if(data[x].length > 0) {
								console.time("START " + x)
								data[x].map((y, idy) => {
									Object.keys(y).map(z => {
										if(z === "id" || z === "personal_id")
											return

										if(x === "language_ability") {
											if(z === "proficiency_score") {
												if(y.language_type === "English") {
													// setValue("english_proficiency_score", y[z].toString())
													resetData.english_proficiency_score = y[z].toString()
												}
												else if(y.language_type === "Arabic") {
													// setValue("arabic_proficiency_score", y[z].toString())
													resetData.arabic_proficiency_score= y[z].toString()
												}
												else {
													// setValue(z, y[z].toString())
													resetData[z]= y[z].toString()
												}
											}
											return
										}

										if(x === "referee_detail") {
											const referee_number = idy === 0 ? 'referee1_' : 'referee2_'
											// setValue(referee_number + z, y[z])
											resetData[referee_number + z] = y[z]
											return
										}

										if(x === "education_background") {
											if(z !== "degree_type") {
												const education =  y.degree_type  + '_' + z
												// setValue(education , y[z])
												resetData[education] = y[z]
											}
											return
										}

										if(x === "job_status") {
											if(z === "unemployed_type" && y[z]) {
												// setValue("job_status_type", "Unemployed")
												resetData.job_status_type = "Unemployed"
											}
											else if(z === "self_employee_type" && y[z]) {
												// setValue("job_status_type", "Self Employment")
												resetData.job_status_type = "Self Employment"
											}
											else if(z === "employee_type" && y[z]) {
												// setValue("job_status_type", "Currently employed")
												resetData.job_status_type = "Currently employed"
												// setValue("position_title", y.position_title)
												resetData.position_title = y.position_title
												// setValue("organization_name", y.organization_name)
												resetData.organization_name= y.organization_name
												// setValue("organization_address", y.organization_address)
												resetData.organization_address= y.organization_address
												// setValue("date_commenced", y.date_commenced)
												resetData.date_commenced= y.date_commenced
												// setValue("organization_type", y.organization_type)
												resetData.organization_type= y.organization_type
											}
											return
										}

										// setValue(z, y[z])
										resetData[z]= y[z]
									})
								})
								setDataSaved(data)
								if(data.document_upload) {
									const checkOtherDocument = data.document_upload.filter(function(x) { return this.indexOf(x.name) < 0 ; },documentForUpload)
									if(checkOtherDocument.length > 1)
										setOtherDocument(checkOtherDocument[checkOtherDocument.length - 1].name)
								}
								setReload(false)
								reset(resetData)
								console.timeEnd("START " + x)
							}
						})
					}
				} catch (error) {
						handleError(error)	
				}	
			}
		}, [id, reload])
		

		// useEffect(() => {
		// 	if(router.query.state !== tabActive) {
		// 		setTabActive(router.query.state)
		// 		setTabState(states.indexOf(router.query.state))
		// 	}
		// }, [router.query.state])

		// useEffect(() => {
		// 	if(states[tabState]) {
		// 		setTabActive(states[tabState])
		// 		router.query.state = states[tabState];
		// 		router.push(router);
		// 	}
		// }, [tabState])

		// useEffect(() => {
		// 	if(tabActive !== router.query.state) {
		// 		router.query.state = tabActive;
		// 		router.push(router);
		// 	}
		// }, [tabActive])

		async function submitForm(prepareData) {
			setLoading(true)
			try {
				const { data } = await axios.post('/api/admission/' + session.user.ID, prepareData)
				alert("Data Submitted.")
				setLoading(false)
				router.query.state = "document-to-be-upload";
				router.push(router);
			} catch (error) {
				if(error.response)		
					alert(error.response.data)
				else 
					alert(error)
			}
		}

		async function documentUpload(data, name, filename) {
			try {
				// console.log('/api/upload/' + session.user.ID, { name : 'ID or Passport', filename : `id-passport-` + session.user.ID, url_link : process.env.NEXT_PUBLIC_API_URL + '/' + data})
				// const resp = await axios.post('/api/upload/' + session.user.ID, { name : 'ID or Passport', filename : data, url_link : router.basePath + '/' + data})	
				const response = await axios.post('/api/upload/' + session.user.ID, { name , filename , url_link : process.env.NEXT_PUBLIC_API_URL + '/' + data})
				alert("Upload Successfully.")
				setLoading(true)
				setReload(true)
			} catch (error) {
				alert(error)	
			}
		}

		if(statusSession === 'loading')
			return ""
		if(statusSession === 'unauthenticated') {
			// router.push('/auth/signin')
			router.push('/auth/authentication/signin')
			return ""
		}
		else if(statusSession === 'authenticated' && !router.query.state) {
			// if(session.user.employee_role_id == process.env.NEXT_PUBLIC_QC_ROLE_ID)
			// 	router.push('/dashboard/product/qc-detail')
			// else
			// 	router.push('/dashboard?state=personal-details')
			// 	router.query.id = x[0].id;
				router.query.state = "personal-details";
				router.push(router);
		}
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
									px={3}
								>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
									<Typography variant="h5" color="primary">{router.query.state ? router.query.state.split('-').map(x => capitalize(x)).join(' ') : ''}</Typography>	
									<TabContext value={router.query.state}>
									<form onSubmit={handleSubmit(submitForm)}>
										<TabPanel value='personal-details' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="center"
													alignContent="center"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<ControllerTextField control={control} name="tittle" 
														rules={{
															required : "This field is required.",
															validate : x => x !== '',
														}}
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c"}}>Title</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Mr" control={<Radio disabled={watchAllFields.tittle !== 'Mr'}/>} label="Mr" />
																		<FormControlLabel value="Mrs" control={<Radio disabled={watchAllFields.tittle !== 'Mrs'}/>} label="Mrs" />
																		<FormControlLabel value="Ms" control={<Radio disabled={watchAllFields.tittle !== 'Ms'}/>} label="Ms" />
																		<FormControlLabel value="Miss" control={<Radio disabled={watchAllFields.tittle !== 'Miss'}/>} label="Miss" />
																		<FormControlLabel value="" control={<Radio disabled={watchAllFields.tittle !== 'Other'}/>} label="Other" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<ControllerTextField control={control} name="family_name" />
													<ControllerTextField control={control} name="given_name" />
													<ControllerTextField control={control} name="place_of_birth" />
													<Stack
														direction="row"
														maxWidth="80%"
														justifyContent="space-between"
													>
													<ControllerTextField control={control} name="date_of_birth" 
														CustomComponent={function(props) {
															return(
																<DatePicker
																	shouldDisableTime={() => true}
																	{...props}
																	value={props.value || null}
																	// label="Date&Time picker"
																	// value={start_time}
																	// onChange={setStartTime}
																	renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
																}} />}
																/>
															)
														}}
													/>
													<ControllerTextField control={control} name="gender" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Gender</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Female" control={<Radio disabled={watchAllFields.gender !== 'Female'}/>} label="Female" />
																		<FormControlLabel value="Male" control={<Radio disabled={watchAllFields.gender !== 'Male'}/>} label="Male" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													</Stack>
													</Grid>	
													<Grid
														item
														lg={6}
														xs={12}
														>
												<ControllerTextField control={control} name="country_citizen" label="Citizenship" />
												<ControllerTextField control={control} name="national_identity_number" />
												<ControllerTextField control={control} name="passport_no" />
												<Stack
													direction="row"
													maxWidth="80%"
													justifyContent="space-between"
												>
												<ControllerTextField control={control} name="issue_date" 
													CustomComponent={function(props) {
														return(
															<DatePicker
																shouldDisableTime={() => true}
																{...props}
																value={props.value || null}
																// label="Date&Time picker"
																// value={start_time}
																// onChange={setStartTime}
																renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
															}} />}
															/>
														)
													}}
												/>
												<ControllerTextField control={control} name="expiry_date" 
													CustomComponent={function(props) {
														return(
															<DatePicker
																shouldDisableTime={() => true}
																{...props}
																value={props.value || null}
																// label="Date&Time picker"
																// value={start_time}
																// onChange={setStartTime}
																renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
															}} />}
															/>
														)
													}}
												/>
												</Stack>
													</Grid>	
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
												<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem auto', }} onClick={() => {
													router.query.state = "contact-details"	
													router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='contact-details' >
											<Stack
												justifyContent="center"
												alignItems="center"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="center"
													alignContent="center"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
												<ControllerTextField control={control} name="address_1" />
												<ControllerTextField control={control} name="address_2" />
												<ControllerTextField control={control} name="country" />
												<ControllerTextField control={control} name="province" />
												<ControllerTextField control={control} name="city" label="District / City" />
												<ControllerTextField control={control} name="postal_code" />
															</Grid>
													<Grid
														item
														lg={6}
														xs={12}
														>
												<ControllerTextField control={control} name="home_number" />
												<ControllerTextField control={control} name="mobile_number" label="Mobile Phone Number" />
												<ControllerTextField control={control} name="work_number" label="Office Phone Number" />
												<ControllerTextField control={control} name="primary_email" />
												<ControllerTextField control={control} name="alternative_email" />
															</Grid>
															</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
														router.query.state = 'personal-details'
														router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
														router.query.state = 'financial-support'
														router.push(router)
														}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										{/* <TabPanel value='emergency-contact-details' >
											<Stack
												justifyContent="center"
												alignItems="center"
											>
												<ControllerTextField control={control} name="title" />
												<ControllerTextField control={control} name="family_name" />
												<ControllerTextField control={control} name="given_name" />
												<ControllerTextField control={control} name="gender" />
												<ControllerTextField control={control} name="relationship_to_you" />
												<ControllerTextField control={control} name="home_number" />
												<ControllerTextField control={control} name="mobile_number" />
												<ControllerTextField control={control} name="work_number" />
												<ControllerTextField control={control} name="fax" />
												<ControllerTextField control={control} name="email_1" />
												<ControllerTextField control={control} name="email_2" />
												<ControllerTextField control={control} name="address_1" />
												<ControllerTextField control={control} name="address_2" />
												<ControllerTextField control={control} name="country" />
												<ControllerTextField control={control} name="province" />
												<ControllerTextField control={control} name="city" />
												<ControllerTextField control={control} name="postal_code" />
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "contact-details"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "contact-details"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel> */}
										<TabPanel value='financial-support' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<ControllerTextField control={control} name="admission_type" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	{/* <FormLabel component="legend" sx={{ color : "#003b5c", }}>Admission Type</FormLabel> */}
																	<RadioGroup  {...props} >
																		<Stack
																			// direction="row"
																			// justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Self financing" control={<Radio disabled={watchAllFields.admission_type !== 'Self financing'} />} label="Self financing" />
																		<Typography variant="body1" color="initial" mt={2} mb={1}>
																			Apply for Scholarship :
																		</Typography>
																		<Stack
																			// ml={3}
																		>
																			<FormControlLabel value="IIIU Admission for Master Program" control={<Radio disabled={watchAllFields.admission_type !== 'IIIU Admission for Master Program'}  />} label="IIIU Admission for Master Program" /> 
																			<FormControlLabel value="LPDP - IIIU Admission for Doctor Program" control={<Radio disabled={watchAllFields.admission_type !== 'LPDP - IIIU Admission for Doctor Program'}  />} label="LPDP - IIIU Admission for Doctor Program" />
																			{/* <FormControlLabel value="BAZNAS - IIIU Admission for Doctor Program" control={<Radio disabled={watchAllFields.admission_type !== 'BAZNAS - IIIU Admission for Doctor Program'}  />} label="BAZNAS - IIIU Admission for Doctor Program" /> */}
																		</Stack>
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
												</Grid>
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "contact-details"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "proposed-study-program"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='proposed-study-program' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													// justifyContent="center"
													// alignContent="center"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<ControllerTextField control={control} name="level_study" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Degree</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Master" control={<Radio disabled={watchAllFields.level_study !== 'Master'}/>} label="Master" />
																		<FormControlLabel value="PhD" control={<Radio disabled={watchAllFields.level_study !== 'PhD'} />} label="PhD" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br />
													<ControllerTextField control={control} name="course_title" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Study Program</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			// direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Education at the Faculty of Education" control={<Radio disabled={watchAllFields.course_title !== 'Education at the Faculty of Education'}/>} label="Education at the Faculty of Education" />
																		<FormControlLabel value="Economics at the Faculty of Economics and Business" control={<Radio disabled={watchAllFields.course_title !== 'Economics at the Faculty of Economics and Business'} />} label="Economics at the Faculty of Economics and Business" />
																		<FormControlLabel value="Political Science at the Faculty of Social Sciences" control={<Radio disabled={watchAllFields.course_title !== 'Political Science at the Faculty of Social Sciences'} />} label="Political Science at the Faculty of Social Sciences" />
																		<FormControlLabel value="Islamic Studies at the Faculty of Islamic Studies" control={<Radio disabled={watchAllFields.course_title !== 'Islamic Studies at the Faculty of Islamic Studies'} />} label="Islamic Studies at the Faculty of Islamic Studies" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													</Grid>	
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "financial-support"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "education-background"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='education-background' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="center"
													alignContent="center"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<Typography variant="h4" color="primary" pb={2}>Undergraduate Degree</Typography>
													<ControllerTextField control={control} name="undergraduate_institution_name" label="Institution Name" />
													<ControllerTextField control={control} name="undergraduate_country" label="Country" />
													<ControllerTextField control={control} name="undergraduate_province" label="Province" />
													<ControllerTextField control={control} name="undergraduate_language" label="Language of Instruction (Maximum 3 languages)" />
													{/* <ControllerTextField control={control} name="undergraduate_graduation_date" /> */}
													<Stack
														direction="row"
														maxWidth="80%"
														justifyContent="space-between"
													>
													<ControllerTextField control={control} name="undergraduate_graduation_date" 
														CustomComponent={function(props) {
															return(
																<DatePicker
																	shouldDisableTime={() => true}
																	{...props}
																	value={props.value || null}
																	// label="Date&Time picker"
																	label="Graduation Date"
																	// value={start_time}
																	// onChange={setStartTime}
																	renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
																}} />}
																/>
															)
														}}
													/>
													</Stack>
													</Grid>	
													<Grid
														item
														lg={6}
														xs={12}
														>
													{
														watchAllFields.master_institution_name &&
														<>
													<Typography variant="h4" color="primary" pb={2}>Master Degree</Typography>
													<ControllerTextField control={control} name="master_institution_name" label="Institution Name" />
													<ControllerTextField control={control} name="master_country" label="Country" />
													<ControllerTextField control={control} name="master_province" label="Province" />
													<ControllerTextField control={control} name="master_language" label="Language of Instruction (Maximum 3 languages)" />
													{/* <ControllerTextField control={control} name="undergraduate_graduation_date" /> */}
													<Stack
														direction="row"
														maxWidth="80%"
														justifyContent="space-between"
													>
													<ControllerTextField control={control} name="master_graduation_date" 
														CustomComponent={function(props) {
															return(
																<DatePicker
																	shouldDisableTime={() => true}
																	{...props}
																	value={props.value || null}
																	// label="Date&Time picker"
																	label="Graduation Date"
																	// value={start_time}
																	// onChange={setStartTime}
																	renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
																}} />}
																/>
															)
														}}
													/>
													</Stack>
														</>
													}
													</Grid>	
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "proposed-study-program"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "language-proficiency"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='language-proficiency' title="Language Proficiency" >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={12}
														xs={12}
													>
													<Alert severity="info">
														<p>Please rate your language proficiency :</p>
														<p
															style={{
																display : 'flex',
																justifyContent : 'space-between'
															}}
														>
															<span style={{
																paddingRight : '1rem',
															}}>
																1 = no proficiency
															</span>
															<span style={{
																paddingRight : '1rem',
															}}>
																2 = elementary proficiency
															</span>
															<span>
																3 = limited working proficiency
															</span>
														</p>
														<p
															style={{
																display : 'flex',
																justifyContent : 'space-between'
															}}
														>
															<span style={{
																paddingRight : '1rem',
															}}>
																4 = professional working proficiency
															</span>
															<span style={{
																paddingRight : '1rem',
															}}>
																5 = full professional proficiency
															</span>
															<span>
																6 = native/bilingual proficiency
															</span>
														</p>
													</Alert>
													</Grid>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<ControllerTextField control={control} name="english_proficiency_score" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>English</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="1" control={<Radio disabled={watchAllFields.english_proficiency_score !== '1'}/>} label="1" />
																		<FormControlLabel value="2" control={<Radio disabled={watchAllFields.english_proficiency_score !== '2'} />} label="2" />
																		<FormControlLabel value="3" control={<Radio disabled={watchAllFields.english_proficiency_score !== '3'} />} label="3" />
																		<FormControlLabel value="4" control={<Radio disabled={watchAllFields.english_proficiency_score !== '4'} />} label="4" />
																		<FormControlLabel value="5" control={<Radio disabled={watchAllFields.english_proficiency_score !== '5'} />} label="5" />
																		<FormControlLabel value="6" control={<Radio disabled={watchAllFields.english_proficiency_score !== '6'} />} label="6" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br />
													<ControllerTextField control={control} name="arabic_proficiency_score" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Arabic</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="1" control={<Radio disabled={watchAllFields.arabic_proficiency_score !== '1'}/>} label="1" />
																		<FormControlLabel value="2" control={<Radio disabled={watchAllFields.arabic_proficiency_score !== '2'} />} label="2" />
																		<FormControlLabel value="3" control={<Radio disabled={watchAllFields.arabic_proficiency_score !== '3'} />} label="3" />
																		<FormControlLabel value="4" control={<Radio disabled={watchAllFields.arabic_proficiency_score !== '4'} />} label="4" />
																		<FormControlLabel value="5" control={<Radio disabled={watchAllFields.arabic_proficiency_score !== '5'} />} label="5" />
																		<FormControlLabel value="6" control={<Radio disabled={watchAllFields.arabic_proficiency_score !== '6'} />} label="6" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br />
													{
														watchAllFields?.language_type &&
														<>
															<ControllerTextField control={control} name="language_type" label="Language" />
															<ControllerTextField control={control} name="proficiency_score" 
																CustomComponent={function(props) {
																	return (
																		<FormControl component="fieldset">
																			{/* <FormLabel component="legend">Arabic</FormLabel> */}
																			<RadioGroup  {...props} >
																				<Stack
																					direction="row"
																					justifyContent="space-between"
																					sx={{
																						width : '100%',
																					}}
																				>
																					<FormControlLabel value="1" control={<Radio disabled={watchAllFields.proficiency_score !== '1'}/>} label="1" />
																					<FormControlLabel value="2" control={<Radio disabled={watchAllFields.proficiency_score !== '2'} />} label="2" />
																					<FormControlLabel value="3" control={<Radio disabled={watchAllFields.proficiency_score !== '3'} />} label="3" />
																					<FormControlLabel value="4" control={<Radio disabled={watchAllFields.proficiency_score !== '4'} />} label="4" />
																					<FormControlLabel value="5" control={<Radio disabled={watchAllFields.proficiency_score !== '5'} />} label="5" />
																					<FormControlLabel value="6" control={<Radio disabled={watchAllFields.proficiency_score !== '6'} />} label="6" />
																				</Stack>
																			</RadioGroup>
																			<FormHelperText></FormHelperText>
																		</FormControl>
																	)
																}}
															/>
														</>
													}
													</Grid>	
													<Grid
														item
														lg={6}
														xs={12}
														>
													<ControllerTextField control={control} name="test_name" label="Test name (IELTS, TOEFL or PTE Academic)" />
													<ControllerTextField control={control} name="date_test_taken" 
														CustomComponent={function(props) {
															return(
																<DatePicker
																	shouldDisableTime={() => true}
																	{...props}
																	value={props.value || null}
																	// label="Date&Time picker"
																	label="Certificate Date"
																	// value={start_time}
																	// onChange={setStartTime}
																	renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
																}} />}
																/>
															)
														}}
													/>
													<ControllerTextField control={control} name="overall_score" />
													</Grid>	
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "education-background"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "job-status"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='job-status' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<ControllerTextField control={control} name="job_status_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Unemployed" control={<Radio disabled={watchAllFields.job_status_type !== 'Unemployed'}/>} label="Unemployed" />
																		<FormControlLabel value="Self Employment" control={<Radio disabled={watchAllFields.job_status_type !== 'Self Employment'} />} label="Self Employment" />
																		<FormControlLabel value="Currently employed" control={<Radio disabled={watchAllFields.job_status_type !== 'Currently employed'} />} label="Employed" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br />
													{/* <ControllerTextField control={control} name="unemployed_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Unemployed?*</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="1" control={<Radio disabled />} label="Yes" />
																		<FormControlLabel value="2" control={<Radio disabled />} label="No" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br /> */}
													{/* <ControllerTextField control={control} name="self_employee_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Self Employment*</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="1" control={<Radio disabled />} label="Yes" />
																		<FormControlLabel value="2" control={<Radio />} label="No" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br />
													<ControllerTextField control={control} name="employee_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Are you currently employed?*</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="1" control={<Radio />} label="Yes" />
																		<FormControlLabel value="2" control={<Radio />} label="No" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<br /> */}
													{
														watchJobStatus === "Currently employed" &&
														<>
													<ControllerTextField control={control} name="position_title" />
													<ControllerTextField control={control} name="organization_name" />
													<ControllerTextField control={control} name="organization_address" />
													<ControllerTextField control={control} name="date_commenced" 
														CustomComponent={function(props) {
															return(
																<DatePicker
																	shouldDisableTime={() => true}
																	{...props}
																	value={props.value || null}
																	// label="Date&Time picker"
																	label="Starting Date"
																	// value={start_time}
																	// onChange={setStartTime}
																	renderInput={(params) => <TextField {...params} sx={{ margin : '.5rem 0',
						margin : '.25rem 0',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
																}} />}
																/>
															)
														}}
													/>
													<br />
													<ControllerTextField control={control} name="organization_type" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Organization Type</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Goverment/public" control={<Radio disabled={watchAllFields.organization_type !== 'Goverment/public'}/>} label="Goverment / public" />
																		<FormControlLabel value="Private" control={<Radio disabled={watchAllFields.organization_type !== 'Private'} />} label="Private" />
																		<FormControlLabel value="Education" control={<Radio disabled={watchAllFields.organization_type !== 'Education'} />} label="Education" />
																		<FormControlLabel value="NGO/civil society" control={<Radio disabled={watchAllFields.organization_type !== 'NGO/civil society'} />} label="NGO / civil society" />
																		<FormControlLabel value="Others" control={<Radio disabled={watchAllFields.organization_type !== 'Others'} />} label="Others" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													</>
													}
													<br />
													</Grid>	
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "language-proficiency"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "referee-details"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='referee-details' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
													<Typography variant="h4" color="primary" pb={2}>Referee 1</Typography>
													<ControllerTextField control={control} name="referee1_title" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Title</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Mr" control={<Radio disabled={watchAllFields.referee1_title !== 'Mr'}/>} label="Mr" />
																		<FormControlLabel value="Mrs" control={<Radio disabled={watchAllFields.referee1_title !== 'Mrs'}/>} label="Mrs" />
																		<FormControlLabel value="Ms" control={<Radio disabled={watchAllFields.referee1_title !== 'Ms'}/>} label="Ms" />
																		<FormControlLabel value="Miss" control={<Radio disabled={watchAllFields.referee1_title !== 'Miss'}/>} label="Miss" />
																		<FormControlLabel value="" control={<Radio disabled={watchAllFields.referee1_title !== 'Other'}/>} label="Other" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<ControllerTextField control={control} name="referee1_family_name" label="Family Name" />
													<ControllerTextField control={control} name="referee1_given_name" label="Given Name" />
													<ControllerTextField control={control} name="referee1_position" 
														label="Position / Title" 
													/>
													<ControllerTextField control={control} name="referee1_relationship_to_applicant" label="Relation to applicant" />
													<ControllerTextField control={control} name="referee1_country" label="Country"/>
													<ControllerTextField control={control} name="referee1_address" label="Address"/>
													<ControllerTextField control={control} name="referee1_phone_number" label="Phone Number" />
													<ControllerTextField control={control} name="referee1_email_address" label="Email Address" />
													{/* <Typography variant="a"  */}
													{
														session.user.role_id == 1 &&
													<p>
													<Button 
													variant="contained"
													color="secondary" 
													onClick={() => {
														router.push('/referee/'+dataSaved.referee_detail[0].id)
													}}
													pb={2}>review referee 1</Button>
													</p>
													}
													</Grid>	
													<Grid
														item
														lg={6}
														xs={12}
														>
													<Typography variant="h4" color="primary" pb={2}>Referee 2</Typography>
													<ControllerTextField control={control} name="referee2_title" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend" sx={{ color : "#003b5c", }}>Title</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Mr" control={<Radio disabled={watchAllFields.referee2_title !== 'Mr'}/>} label="Mr" />
																		<FormControlLabel value="Mrs" control={<Radio disabled={watchAllFields.referee2_title !== 'Mrs'}/>} label="Mrs" />
																		<FormControlLabel value="Ms" control={<Radio disabled={watchAllFields.referee2_title !== 'Ms'}/>} label="Ms" />
																		<FormControlLabel value="Miss" control={<Radio disabled={watchAllFields.referee2_title !== 'Miss'}/>} label="Miss" />
																		<FormControlLabel value="" control={<Radio disabled={watchAllFields.referee2_title !== 'Other'}/>} label="Other" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/>
													<ControllerTextField control={control} name="referee2_family_name" label="Family Name" />
													<ControllerTextField control={control} name="referee2_given_name" label="Given Name" />
													<ControllerTextField control={control} name="referee2_position" 
														label="Position / Title" 
													/>
													<ControllerTextField control={control} name="referee2_relationship_to_applicant" label="Relation to applicant" />
													<ControllerTextField control={control} name="referee2_country" label="Country"/>
													<ControllerTextField control={control} name="referee2_address" label="Address"/>
													<ControllerTextField control={control} name="referee2_phone_number" label="Phone Number" />
													<ControllerTextField control={control} name="referee2_email_address" label="Email Address" />
													{
														session.user.role_id == 1 &&
													<p>
													<Button 
													variant="contained"
													color="secondary" 
													onClick={() => {
														router.push('/referee/'+dataSaved.referee_detail[1].id)
													}}
													pb={2}>review referee 2</Button>
													</p>
													}
													</Grid>	
												</Grid>
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "job-status"	
															router.push(router)
														}}>Back</Button>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "document-to-be-upload"	
															router.push(router)
													}}>Next</Button>
												</Stack>
											</Stack>
										</TabPanel>
										<TabPanel value='applicant-declaration' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
															<FormGroup>
																<FormControlLabel control={<Checkbox checked={understanding} onChange={e => setUnderstanding(e.target.checked)} />} label="Understanding" sx={{  '.MuiFormControlLabel-label' : { fontWeight : 700 }}} />
																<Typography variant="body1" color="initial">I understand and confirm that:</Typography>
																<ul>
																	<li>
																		<Typography variant="body1" color="initial">
																			I have read and complied with the IIIU Admission Guidelines and that the contents of my application are true and correct.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="initial">
																			I authorize IIIU to make enquiries and to obtain official records from any university and tertiary educational institution concerning my current or previous attendance which, in its absolute discretion, it believes are necessary.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="error">
																			IIIU has the right to vary or cancel any made on the basis of incorrect or incomplete information provided by me or by my referees.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="initial">
																			Decisions of the admission panel are final and confidential and no correspondence about outcomes of the selection process will be entered into.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="initial">
																			All documents submitted become the property of IIIU and will not be returned.
																		</Typography>
																	</li>
																</ul>
															</FormGroup>
															<FormGroup>
																<FormControlLabel control={<Checkbox checked={agreement} onChange={e => setAgreement(e.target.checked)}/>} label="Agreement" sx={{  '.MuiFormControlLabel-label' : { fontWeight : 700 }}} />
																<Typography variant="body1" color="initial">If successful in gaining IIIU Admission, I agree that I will:</Typography>
																<ul>
																	<li>
																		<Typography variant="body1" color="initial">
																			Immediately provide IIIU with details of any incident that may reflect badly on the prestige of IIIU.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="initial">
																			Not hold another equivalent award or scholarship at the same time, if I will be granted IIIU related scholarship.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="initial">
																			Act in a manner befitting a recipient of IIIU Admission.
																		</Typography>
																	</li>
																	<li>
																		<Typography variant="body1" color="initial">
																		Acknowledge the assistance given by IIIU in any written report, publications or publicity associated with IIIU.
																		</Typography>
																	</li>
																</ul>
															</FormGroup>
															<Typography variant="h6" color="initial">Declaration and acknowledgement</Typography>
															<Typography variant="body1" color="initial">In submitting this application form, I declare that the information contained in it and provided in connection with it is true and correct.</Typography>
															<Stack
																direction="row"
																sx={{
																	width : '100%',
																	position : 'absolute',
																	bottom : 0,
																	right : '1rem',
																}}
															>
																<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem auto', }} onClick={() => {
																		router.query.state = "referee-details"	
																		router.push(router)
																	}}>Back</Button>
																<Button variant="contained" sx={{ width : '250px', margin : '1rem', }} onClick={() => {
																		// router.query.state = "applicant-declaration"	
																		// router.push(router)
																}}
																// disabled={(!understanding || !agreement) && !loading}
																type="submit"
																>
																	Save</Button>
																<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
																		router.query.state = "document-to-be-upload"	
																		router.push(router)
																}}
																disabled={(!understanding || !agreement) && !loading}
																>
																	Submit</Button>
															</Stack>
														</Grid>
												</Grid>
											</Stack>
										</TabPanel>
									</form>
										<TabPanel value='document-to-be-upload' >
											<Stack
												justifyContent="space-between"
												alignItems="space-between"
											>
														<ol>
												<Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={6}
														xs={12}
														>
															{
																documentForUpload.slice(0,5).map(document => (
																<li>
															<Typography variant="body1" color="initial" mr={5}>{document}</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == document).map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															{
																session.user.role_id === 2 &&
															<Upload onUploadSuccess={(data) => documentUpload(data, document, document.toLowerCase().split('/').join('-').split(' ').join('-') + '-' + session.user.ID)} 
																attach={{ image_url : dataSaved?.document_upload.filter(x => x.name == document)[0]?.url_link}}
																name={document.toLowerCase().split('/').join('-').split(' ').join('-') + '-' + session.user.ID}
															/>
															}
																</li>
																))
															}
													</Grid>
													<Grid
														item
														lg={6}
														xs={12}
														>
															{
																documentForUpload.slice(5).map(document => (
																<li>
															<Typography variant="body1" color="initial" mr={5}>{document}</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == document).map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															{
																session.user.role_id === 2 &&
															<Upload onUploadSuccess={(data) => documentUpload(data, document, document.toLowerCase().split('/').join('-').split(' ').join('-') + '-' + session.user.ID)} 
																attach={{ image_url : dataSaved?.document_upload.filter(x => x.name == document)[0]?.url_link}}
																name={document.toLowerCase().split('/').join('-').split(' ').join('-') + '-' + session.user.ID}
															/>
															}
																</li>
																))
															}
															<li>
															<TextField
																size='small'
																onChange={(e) => setOtherDocument(e.target.value)}
																// onBlur={onBlur}
																value={otherDocument}
																label="Other"
																sx={{
																	margin : '.25rem 0',
																	width : '100%',
																	maxWidth : '600px',
																}}
															/>														
															{
																dataSaved?.document_upload.filter(x => x.name == otherDocument).map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															{
																otherDocument.length > 0 && session.user.role_id !== 2 &&
															<Upload onUploadSuccess={(data) => documentUpload(data, otherDocument, `${otherDocument.toLowerCase()}-` + session.user.ID)} 
																// attach={item} 
																name={`${otherDocument.toLowerCase()}-` + session.user.ID}
															/>
															}
															</li>
													</Grid>
													{/* <Grid
														item
														lg={6}
														xs={12}
														>
																<li>
															<Typography variant="body1" color="initial" mr={5}>ID or Passport</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'ID or Passport').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'ID or Passport', `id-passport-` + session.user.ID)} 
																attach={{ image_url : dataSaved?.document_upload.filter(x => x.name == 'ID or Passport')[0]?.url_link}}
																name={`id-passport-` + session.user.ID}
															/>
																</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Certificate of Graduation</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Certificate of Graduation').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Certificate of Graduation', `edu-certificate-` + session.user.ID)} 
																// attach={item} 
																name={`edu-certificate-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Certified copies of academic transcripts</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Certified copies of academic transcripts').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Certified copies of academic transcripts', `transcript-` + session.user.ID)} 
																// attach={item} 
																name={`transcript-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Motivation Letter</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Motivation Letter').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Motivation Letter', `motivation-letter-` + session.user.ID)} 
																// attach={item} 
																name={`motivation-letter-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>IELTS/TOEFL/Pearson Academic Results</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'IELTS/TOEFL/Pearson Academic Results').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'IELTS/TOEFL/Pearson Academic Results', `english-test-` + session.user.ID)} 
																// attach={item} 
																name={`english-test-` + session.user.ID}
															/>
															</li>
													</Grid> */}
													{/* <Grid
														item
														lg={6}
														xs={12}
														>
															<li>
															<Typography variant="body1" color="initial" mr={5}>TOAFL or other Arabic Certificate **</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'TOAFL or other Arabic Certificate **').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'TOAFL or other Arabic Certificate **', `arabic-test-` + session.user.ID)} 
																// attach={item} 
																name={`arabic-test-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Curriculum Vitae</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Curriculum Vitae').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Curriculum Vitae', `cv-` + session.user.ID)} 
																// attach={item} 
																name={`cv-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Research proposal (doctoral program only)</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Research proposal (doctoral program only)').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Research proposal (doctoral program only)', `research-proposal-` + session.user.ID)} 
																// attach={item} 
																name={`research-proposal-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Publication</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Publication').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Publication', `receipt-` + session.user.ID)} 
																// attach={item} 
																name={`receipt-` + session.user.ID}
															/>
															</li>
															<li>
															<Typography variant="body1" color="initial" mr={5}>Proof of Payment</Typography>
															{
																dataSaved?.document_upload.filter(x => x.name == 'Proof of Payment').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Proof of Payment', `receipt-` + session.user.ID)} 
																// attach={item} 
																name={`receipt-` + session.user.ID}
															/>
															</li>
															<li>
															<TextField
																size='small'
																onChange={(e) => setOtherDocument(e.target.value)}
																// onBlur={onBlur}
																value={otherDocument}
																label="Other"
																sx={{
																	margin : '.25rem 0',
																	width : '100%',
																	maxWidth : '600px',
																}}
															/>														
															{
																dataSaved?.document_upload.filter(x => x.name == otherDocument).map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															{
																otherDocument.length > 0 &&
															<Upload onUploadSuccess={(data) => documentUpload(data, otherDocument, `${otherDocument.toLowerCase()}-` + session.user.ID)} 
																// attach={item} 
																name={`receipt-` + session.user.ID}
															/>
															}
															</li>
															<Stack
																direction="row"
																sx={{
																	width : '100%',
																	position : 'absolute',
																	bottom : 0,
																	right : '1rem',
																}}
															>
																<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem auto', }} onClick={() => {
																		router.query.state = "referee-details"	
																		router.push(router)
																	}}>Back</Button>
																<Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 1rem', }} onClick={() => {
																		router.query.state = "applicant-declaration"	
																		router.push(router)
																	}}>Next</Button>
															</Stack>
													</Grid> */}
												</Grid>
														</ol>
												{/* <Grid
													container
													spacing={1}
													direction="row"
													justifyContent="flex-start"
													alignContent="flex-start"
													wrap="wrap"
													
												>
													<Grid
														item
														lg={12}
														xs={12}
														>
														<ol>
															{
																dataSaved?.document_upload.map(item => {
																	return (
																		<li>
																			<Typography variant="body1" color="initial" mr={5} mb={1}>{item.name}</Typography>
																			<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																		</li>
																	)
																})
															}
														</ol>
													</Grid>
												</Grid> */}
												<Stack
													direction="row"
													sx={{
														width : '100%',
														position : 'absolute',
														bottom : 0,
														right : '1rem',
													}}
												>
													<Button variant="contained" sx={{ width : '250px', margin : '1rem 1rem 1rem auto', }} onClick={() => {
															router.query.state = "referee-details"	
															router.push(router)
														}}>Back</Button>
													{/* <Button variant="contained" sx={{ width : '250px', margin : '1rem 0 1rem 0', }} onClick={() => {
															router.query.state = "document-to-be-upload"	
															router.push(router)
													}}>Next</Button> */}
												</Stack>
											</Stack>
										</TabPanel>
									</TabContext>	
									</LocalizationProvider>
								</Stack>
							</Card>
						</Grid>	
					</Grid>
        </DashboardLayout>
    )
}

function ControllerTextField({control, name, CustomComponent, label, rules }) {
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
						disabled={true}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
						ref={ref}
						label={name ? name.split('_').map(x => capitalize(x)).join(' ') : ''}
						sx={{
							margin : '.25rem 0',
							width : '100%',
							maxWidth : '600px',
							".MuiInputLabel-root.Mui-disabled" : {
								color: "#003b5c",
							},
							".MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000",
								color: "#000",
							}
						}}
					/>
					:
				<TextField
					variant="standard"
					disabled={true}
					size='small'
					onChange={onChange}
					onBlur={onBlur}
					value={value}
					ref={ref}
					label={label || (name ? name.split('_').map(x => capitalize(x)).join(' ') : '')}
					sx={{
						margin : '.25rem 0',
						width : '100%',
						maxWidth : '600px',
						".MuiInputLabel-root.Mui-disabled" : {
							color: "#003b5c",
						},
						".MuiInputBase-input.Mui-disabled": {
							WebkitTextFillColor: "#000",
							color: "#000",
						}
					}}
				/>														
				}
				</>
			)}
		/>
	)	
}