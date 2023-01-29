import { 
	Alert,
	Autocomplete,
	Button,
	Card,
	Checkbox,
	Divider,
	Grid,
	Stack,
	Table,
	TableHead,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
	Typography, 
	TextField,
	Input,
	capitalize, FormControl, FormControlLabel, FormLabel, FormGroup, FormHelperText, RadioGroup, Radio,
} from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { TabPanel, TabContext } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import DashboardLayout from '../../../components/dashboard';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import axios from 'axios';

// import Upload from '../upload'
// import FormParent from '../../components/form/FormParent';

function handleError(error) {
	if(error.response)	
		alert(error.response.data)
	else alert(error)
}

const field_verification = [
	"Certificate of Graduation",
	"Certified copies of academic transcripts",
	"Motivation Letter",
	"Curriculum Vitae",
	"IELTS/TOEFL/Pearson Academic Results",
	"Referee recommendation 1",
	"Referee recommendation 2",
	"Proof of Payment",
]

export default function FormVerification() {
		const router = useRouter()
		const { data: session, status : statusSession } = useSession();

		const [tabActive, setTabActive] = useState(router.query.state)
		// const [tabState, setTabState] = useState(states.indexOf(tabActive))
		const [understanding, setUnderstanding] = useState(false)
		const [agreement, setAgreement] = useState(false)
		const [otherDocument, setOtherDocument] = useState("")
		const [loading, setLoading] = useState(false)

		const [facultyOptions, setFacultyOptions] = useState([{id : null, name : "" }])
		const [facultySelected, setFacultySelected] = useState({id : null, name : "" })
		const [studentOptions, setStudentOptions] = useState([{id : null, name : "" }])
		const [studentSelected, setStudentSelected] = useState({id : null, name : "" })
		const [documentList, setDocumentList] = useState([])
		const [refereeList, setRefereeList] = useState([])

		const [dataSaved, setDataSaved] = useState(null)
		const [reload, setReload] = useState(true)

		const { handleSubmit, watch, setValue, control, reset, resetField, formState : { errors } } = useForm();
		const watchJobStatus = watch("job_status_type")
		const watchAllFields = watch()

		useEffect(() => {
			getFacultyOptions()
			
			async function getFacultyOptions() {
				try {
					const { data } = await axios.get('/api/proposed-study')
					if(data)
						setFacultyOptions([{id : null, name : "" }, ...data.map(x => ({ id : x, name : x }))])
				} catch (error) {
					handleError(error)	
				}	
			}
		},[])

		useEffect(() => {
			if(facultySelected?.name)
				getStudentOptions()
			
			async function getStudentOptions() {
				try {
					setStudentSelected({id : null, name : "" })
					setStudentOptions([{id : null, name : "" }])
					setDocumentList([])
					setLoading(true)
					const { data } = await axios.get('/api/admission?submitted=1&course_title=' + facultySelected.name)
					if(data) {
						setStudentOptions([{id : null, name : "" }, ...data])
						setLoading(false)
					}
				} catch (error) {
					handleError(error)	
				}	
			}
		},[facultySelected])

		useEffect(() => {
			if(studentSelected?.name) {
				let prepareDocument = []
				field_verification.map(item => {
					const exist = studentSelected.document_upload.filter(x => x.name == item)[0]
					if(exist)
						prepareDocument.push(exist)
				})
					studentSelected.document_upload.splice(0,studentSelected.document_upload.length)
					prepareDocument.map(item =>
							studentSelected.document_upload.splice(studentSelected.document_upload.length, 0, item)
					)
				setDocumentList(studentSelected.document_upload)

				setRefereeList(studentSelected.referee_detail)
			}
			else {
				setDocumentList([])
				setRefereeList([])
			}
		},[studentSelected])

		useEffect(() => {
			if(session?.user && reload)
				getDataSaved()

			async function getDataSaved() {
				try {
					// const { data } = await axios.get('/api/admission/' + session.user.ID)
					// setDataSaved(data)
				} catch (error) {
						handleError(error)	
				}	
			}
		}, [session, reload])
		

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
			if(confirm("Save data?"))
				try {
					await axios.post('/api/referee-detail', refereeList)
					await axios.post('/api/document-upload', documentList)
					let isVerified = documentList.filter(x => !x.is_relevance)

					if(isVerified.length == 0)
						isVerified = refereeList.filter(x => !x.is_relevance)
					const updateStudentData = [{...studentSelected, is_verified : isVerified.length > 0 ? false : true }]
					const { data } = await axios.post('/api/personal', updateStudentData)
					alert("Data Verification Saved.")
					// alert("Data Saved.")
					setLoading(false)
					// router.query.state = "document-upload";
					// router.push(router);
				} catch (error) {
					if(error.response)		
						alert(error.response.data)
					else 
						alert(error)
				}
		}

		async function documentUpload(data, name, filename) {
			try {
				console.log('/api/upload/' + session.user.ID, { name : 'ID or Passport', filename : `id-passport-` + session.user.ID, url_link : process.env.NEXT_PUBLIC_API_URL + '/' + data})
				const isExist = dataSaved?.document_upload.filter(x => x.name == name)[0]
				// const resp = await axios.post('/api/upload/' + session.user.ID, { name : 'ID or Passport', filename : data, url_link : router.basePath + '/' + data})	
				const response = await axios.post('/api/upload/' + session.user.ID, { ...isExist??{}, name , filename , url_link : process.env.NEXT_PUBLIC_API_URL + '/' + data})
				alert("Upload Successfully.")
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
				// router.query.state = "personal-details";
				// router.push(router);
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
            width: "100%",
            // height : '100%',
            minHeight: "600px",
          }}
        >
          <Grid
            item
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Card
              sx={{
                width: "100%",
                height: "100%",
                // backgroundColor : '#000',
                paddingBottom: "100px",
              }}
            >
              <Stack
                pt={2}
                px={3}
                sx={{
                  width: "100%",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
									<Stack
										direction="row"
										alignItems="center"
										mb={2}
									>
                  <Typography variant="h4" color="primary" m={2}>
                    Verification Form
                  </Typography>
									<Autocomplete 
										sx={{ minWidth : 250, ml : 3, }}
										value={facultySelected}
										onChange={(event, data) => { setFacultySelected(data) }}
										options={facultyOptions}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
										<TextField
											{...params}
											// label={params.fullname}
											label="Faculty"
											item={params.id}
											// fullWidth
											inputProps={{
												...params.inputProps,
												// autoComplete: "disabled", // disable autocomplete and autofill
											}}
										/>
										)}
									/>
									{
										studentOptions.length > 1 &&
									<Autocomplete 
										sx={{ minWidth : 250, ml : 3, }}
										value={studentSelected}
										onChange={(event, data) => { setStudentSelected(data) }}
										options={studentOptions}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
										<TextField
											{...params}
											// label={params.fullname}
											label="Student"
											item={params.id}
											// fullWidth
											inputProps={{
												...params.inputProps,
												// autoComplete: "disabled", // disable autocomplete and autofill
											}}
										/>
										)}
									/>
									}
									</Stack>
                  <Divider />
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    alignContent="stretch"
                    wrap="wrap"
                    mb={3}
                  >
										{
											!studentSelected?.name ?
                    <Grid item xs={10} lg={5.5}>
										</Grid> :
                    <Grid item xs={10} lg={5.5}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          m: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="initial" mr={5}>
                          Registration ID
                        </Typography>
                        <TextField
                          value={studentSelected.id}
                          disabled
                          sx={{
                            input: {
                              "&.Mui-disabled": {
                                color: "#000",
                                "-webkit-text-fill-color": "initial",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "initial",
                              },
                            },
                          }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          m: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="initial" mr={5}>
                          Applicant Name
                        </Typography>
                        <TextField value={studentSelected.name} disabled 
                          sx={{
                            input: {
                              "&.Mui-disabled": {
                                color: "#000",
                                "-webkit-text-fill-color": "initial",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "initial",
                              },
                            },
                          }}
												/>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          m: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="initial" mr={5}>
                          Email
                        </Typography>
                        <TextField value={studentSelected.email} disabled 
                          sx={{
                            input: {
                              "&.Mui-disabled": {
                                color: "#000",
                                "-webkit-text-fill-color": "initial",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "initial",
                              },
                            },
                          }}
												/>
                      </Stack>
                    </Grid>
										}
                    <Grid item xs={10} lg={5.5}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          m: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="initial" mr={5}>
                          Name of Faculty
                        </Typography>
                        <TextField value={!studentSelected?.proposed_study ? '' : studentSelected.proposed_study[0].course_title} disabled 
                        // <TextField value={"Facultyi of Education"} disabled 
                          sx={{
                            input: {
                              "&.Mui-disabled": {
                                color: "#000",
                                "-webkit-text-fill-color": "initial",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "initial",
                              },
                            },
                          }}
												/>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          m: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="initial" mr={5}>
                          Verifier
                        </Typography>
                        <TextField value={session?.user.name} disabled 
                          sx={{
                            input: {
                              "&.Mui-disabled": {
                                color: "#000",
                                "-webkit-text-fill-color": "initial",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "initial",
                              },
                            },
                          }}
												/>
                      </Stack>
                      {/* <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          m: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="initial" mr={5}>
                          Verification Date
                        </Typography>
                        <TextField
                          value={new Date().toLocaleString()}
                          disabled
                          sx={{
                            input: {
                              "&.Mui-disabled": {
                                color: "#000",
                                "-webkit-text-fill-color": "initial",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "initial",
                              },
                            },
                          }}
                        />
                      </Stack> */}
                    </Grid>
                  </Grid>
                  <Divider />
                  <form onSubmit={handleSubmit(submitForm)}>
                    <Table size="small" stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
                            align="center"
                          >
                            No.
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
                          >
														Documents
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
														align="center"
                          >
														Submitted
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
                            align="center"
                          >
														Relevance
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
                            align="center"
                          >
														Notes
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
															minWidth : 50,
                            }}
                            align="center"
                          >
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
												// [
                        //   "Undergraduate certificate",
                        //   "Undergraduate academic transcript",
                        //   "Statement of purpose",
                        //   "Language Full curriculum vitae in tabular form",
                        // ]
												// documentList && documentList
												documentList.length > 0 && field_verification
												.map((item_field, index) => {
													if(item_field.includes('Referee recommendation') && refereeList.length > 0) {
														const item = index == 5 ? refereeList[0] : refereeList[1]
													if(!item)
														return (
														<TableRow
															sx={{
																bgcolor: index % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
															}}
														>
															<TableCell align="center">{index + 1}</TableCell>
															<TableCell>
																<Typography variant="subtitle2" color="initial">{item_field}</Typography>
															</TableCell>
															<TableCell align='center'>
																<Button
																	color={"error"}
																>
																	No
																</Button>
															</TableCell>
															<TableCell></TableCell>
															<TableCell></TableCell>
															<TableCell></TableCell>
														</TableRow>
														)
													return (
                          <TableRow
                            sx={{
                              bgcolor: index % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
                            }}
													>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell>
															<Typography variant="subtitle2" color="initial">{item_field}</Typography>
														</TableCell>
                            <TableCell align='center'>
															<Button
																// color={index%2 ==0 ? "success" : "error" }
																color={"success"}
															>
															Yes
															</Button>
														</TableCell>
                            <TableCell align="center">
                              {/* <ControllerTextField
                                control={control}
                                name={item.name}
                                rules={{
                                  required: "This field is required.",
                                  validate: (x) => x !== "",
                                }}
                                CustomComponent={function (props) {
                                  return ( */}
                                    <FormControl component="fieldset">
                                      {/* <FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Ability to organize workload</FormLabel> */}
																				<RadioGroup 
																				// {...props}
																					value={item.is_relevance}
																					onChange={(event, data) => {
																					let temps = [...refereeList]
																						// temps[].is_relevance = !!data
																					temps[index - 5].is_relevance = String(data) == 'true'
																					temps[index - 5].verifier = session.user.ID
																					// temps[index].notes = event.target.value
																					setRefereeList(temps)
																				}}
																			>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          sx={{
                                            width: "100%",
                                          }}
                                        >
                                          <FormControlLabel
                                            value={true}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Yes"
                                          />
                                          <FormControlLabel
                                            value={false}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="No"
                                          />
                                        </Stack>
                                      </RadioGroup>
                                      <FormHelperText></FormHelperText>
                                    </FormControl>
                                  {/* );
                                }}
                              /> */}
                            </TableCell>
														<TableCell>
                              <TextField
                                // control={control}
																value={item.notes}
																onChange={(event) => {
																	let temps = [...refereeList]
																	temps[index - 5].notes = event.target.value
																	temps[index - 5].verifier = session.user.ID
																	setRefereeList(temps)
																}}
                                name={item.name + ' notes'}
																label={null}
																InputLabelProps={{shrink: false}}
                                // rules={{
                                //   required: "This field is required.",
                                //   validate: (x) => x !== "",
                                // }}
																/>
														</TableCell>
														<TableCell>
															<a href={
																`https://${window.location.hostname}/referee/${item.id}`
															} target="_blank" rel="noopener noreferrer">
															<Button
																size="small"
																variant="contained"
																color="info"
																// onClick={() => {
																	// router.push('/referee/'+item.id)
																// }}
															>
																View
															</Button>
															</a>
														</TableCell>
                          </TableRow>
                        )
													}
													const item = documentList.filter(x => x.name == item_field)[0]
													if(!item)
														return (
														<TableRow
															sx={{
																bgcolor: index % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
															}}
														>
															<TableCell align="center">{index + 1}</TableCell>
															<TableCell>
																<Typography variant="subtitle2" color="initial">{item_field}</Typography>
															</TableCell>
															<TableCell align='center'>
																<Button
																	color={"error"}
																>
																	No
																</Button>
															</TableCell>
															<TableCell></TableCell>
															<TableCell></TableCell>
															<TableCell></TableCell>
														</TableRow>
														)

													return (
                          <TableRow
                            sx={{
                              bgcolor: index % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
                            }}
													>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell>
															<Typography variant="subtitle2" color="initial">{item.name}</Typography>
														</TableCell>
                            <TableCell align='center'>
															<Button
																// color={index%2 ==0 ? "success" : "error" }
																color={"success"}
															>
															Yes
															</Button>
														</TableCell>
                            <TableCell align="center">
                                    <FormControl component="fieldset">
                                      {/* <FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Ability to organize workload</FormLabel> */}
                                      <RadioGroup 
																			// {...props}
																				value={item.is_relevance}
																				onChange={(event, data) => {
																					let temps = [...documentList]
																					temps[index >= temps.length ? temps.length - 1 : index].is_relevance = String(data) == 'true'
																					temps[index >= temps.length ? temps.length - 1 : index].verifier = session.user.ID
																					setDocumentList(temps)
																				}}
																			>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          sx={{
                                            width: "100%",
                                          }}
                                        >
                                          <FormControlLabel
                                            value={true}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Yes"
                                          />
                                          <FormControlLabel
                                            value={false}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="No"
                                          />
                                        </Stack>
                                      </RadioGroup>
                                      <FormHelperText></FormHelperText>
                                    </FormControl>
                              {/* <ControllerTextField
                                control={control}
                                name={item.name}
                                rules={{
                                  required: "This field is required.",
                                  validate: (x) => x !== "",
                                }}
                                CustomComponent={function (props) {
                                  return (
                                    <FormControl component="fieldset">
                                      <RadioGroup {...props}
																				onChange={(event, data) => {
																					let temps = [...documentList]
																					temps[index].is_relevance = !!data
																					setDocumentList(temps)
																				}}
																			>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          sx={{
                                            width: "100%",
                                          }}
                                        >
                                          <FormControlLabel
                                            value="true"
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Yes"
                                          />
                                          <FormControlLabel
                                            value="false"
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="No"
                                          />
                                        </Stack>
                                      </RadioGroup>
                                      <FormHelperText></FormHelperText>
                                    </FormControl>
                                  );
                                }}
                              /> */}
                            </TableCell>
														<TableCell>
                              {/* <ControllerTextField
                                control={control}
																value={item.notes}
                                name={item.name + ' notes'}
																label={null}
																InputLabelProps={{shrink: false}}
                                rules={{
                                  required: "This field is required.",
                                  validate: (x) => x !== "",
                                }}
																/> */}
																<TextField
																	size='small'
																	onChange={(event) => {
																		let temps = [...documentList]
																		// temps[index].notes = event.target.value
																		temps[index >= temps.length ? temps.length - 1 : index].notes = event.target.value
																		temps[index >= temps.length ? temps.length - 1 : index].verifier = session.user.ID
																		setDocumentList(temps)
																	}}
																	value={item.notes}
																	sx={{
																		margin : '.25rem 0',
																		width : '100%',
																		maxWidth : '600px',
																	}}
																/>														
														</TableCell>
														<TableCell>
															<a href={item.url_link} target="_blank" rel="noopener noreferrer">
															<Button
																size="small"
																variant="contained"
																color="info"
															>
																View
															</Button>
															</a>
														</TableCell>
                          </TableRow>
                        )
											}
												)}
                      </TableBody>
                    </Table>
                    {session?.user.ROLE_ID == 1 && documentList.length > 0 && (
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        sx={{
                          width: "100%",
                          // position : 'absolute',
                          bottom: 0,
                          right: "1rem",
                        }}
                      >
                        <Button
                          variant="contained"
                          type="submit"
                          sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                          disable={loading}
                          // onClick={async () => {
													// 	try {
														// console.log("check documentlist", documentList)
														// let prepareDocumentVerifData = JSON.parse(JSON.stringify(documentList))
														// let prepareStudentData = JSON.parse(JSON.stringify(studentSelected))
														// prepareStudentData.document_upload = prepareDocumentVerifData
														// await axios.patch('/api/admission/' + prepareStudentData.id, prepareStudentData)
														// await axios.post('/api/referee-detail', refereeList)
														// await axios.post('/api/document-upload', documentList)
														// alert("Data Verification Saved.")
														// prepareDocumentVerifData.map(item => {
														// 	Object.keys(watchAllFields).filter(x => x.includes(' notes')).map(watchItem => {
														// 		if(watchItem.split(' notes')[0] === item.name) {
														// 			item.notes = watchAllFields[watchItem]
														// 		}
														// 	})
														// })
                            // router.query.state = "applicant-declaration"
                            // router.push(router)
													// 	} catch (error) {
													// 		handleError(error)	
													// 	}
                          // }}
                        >
                          Save
                        </Button>
                      </Stack>
                    )}
                  </form>
                </LocalizationProvider>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        <Modal
          open={loading}
          onClose={() => setLoading(false)}
          sx={{ display: "flex" }}
        >
          <CircularProgress sx={{ margin: "auto" }} />
        </Modal>
      </DashboardLayout>
    );
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
					defaultValue=""
					ref={ref}
					label={label === null ? label : (label || (name ? name.split('_').map(x => capitalize(x)).join(' ') : ''))}
					sx={{
						margin : '.25rem 0',
						width : '100%',
						maxWidth : '600px',
					}}
				/>														
				}
				</>
			)}
		/>
	)	
}