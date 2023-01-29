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
import { Controller, useForm, useWatch } from 'react-hook-form';
import React, { useState, useEffect, useMemo } from 'react';
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

function handleError(error) {
	if(error.response)	
		alert(error.response.data)
	else alert(error)
}

let notesChange

export default function FormAdmission() {
		const router = useRouter()
		const { id } = router.query
		const { data: session, status : statusSession } = useSession();

		const [tabActive, setTabActive] = useState(router.query.state)
		// const [tabState, setTabState] = useState(states.indexOf(tabActive))
		const [understanding, setUnderstanding] = useState(false)
		const [agreement, setAgreement] = useState(false)
		const [otherDocument, setOtherDocument] = useState("")
		const [loading, setLoading] = useState(true)

		const [aspectList, setAspectList] = useState([])
		const [scoreList, setScoreList] = useState([])

		const [dataSaved, setDataSaved] = useState(null)
		const [notes, setNotes] = useState(null)
		const [studentData, setStudentData] = useState(null)
		const [reload, setReload] = useState(true)

		const { handleSubmit, watch, setValue, control, formState : { errors } } = useForm();
		// const watchJobStatus = watch("job_status_type")
		// const watchAllFields = watch()
		// const watchController = watch()

		// const watchAllFields = useMemo(() => watch(), [watch])

		// useEffect(() => {
		// }, [watchAllFields])
		

		useEffect(() => {
			if(id && reload && session)
				getDataSaved()

			async function getDataSaved() {
				try {
					const score = await axios.get(`/api/interview-score?personal_id=${id}&teacher_id=${session.user.ID}`)
					if(score.data) {
						setDataSaved(score.data)
						score.data.map(eachData => {
							setValue(eachData.aspect.name, eachData.score)
						})
					}
					const response = await axios.get('/api/admission?id=' + id)
					if(response.data[0])
						setStudentData(response.data[0])

					const note = await axios.get(`/api/interview-notes?personal_id=${id}&teacher_id=${session.user.ID}`)
					if(note.data[0]) {
						setNotes(note.data[0])
						// score.data.map(eachData => {
						// 	setValue(eachData.aspect.name, eachData.score)
						// })
					} else {
						setNotes({
							teacher_id : session.user.ID,
							personal_id : id,
							notes : '',
						})
					}
					setReload(false)
					setLoading(false)

				} catch (error) {
						handleError(error)	
				}	
			}
		}, [reload, id, session])
		
		useEffect(() => {
			getAspectAndScoreList()	

			async function getAspectAndScoreList() {
				try {
					const { data : dataAspect } = await axios.get('/api/aspect?type=2')
					setAspectList(dataAspect)
					const { data } = await axios.get('/api/score?type=1')
					setScoreList(data)
				} catch (error) {
					handleError(error)	
				}	
			}
		}, [])
		

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

		async function submitForm(dataForm) {
			if(confirm("Save data?"))
				try {
					setLoading(true)
					let prepareData = []

					aspectList.map(item => {
						const getId = dataSaved.filter(x => x.aspect.name == item.name)[0]?.id??null
						prepareData.push({
							id : getId,
							personal_id : id,
							aspect_id : item.id,
							score : parseInt(dataForm[item.name]),
							teacher_id : session.user.ID,
						})
					})
					await axios.post('/api/interview-score', prepareData)
					await axios.post('/api/interview-notes', [notes])
					alert("Data Saved.")
					setReload(true)
					// setLoading(false)
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
                    Desk Review Form
                  </Typography>
									{/* <Autocomplete 
										sx={{ minWidth : 250, ml : 3, }}
										value={null}
										onChange={(event, data) => { console.log(data) }}
										options={[]}
										getOptionLabel={(option) => option.fullname}
										renderInput={(params) => (
										<TextField
											{...params}
											// label={params.fullname}
											label="Choose Student"
											item={params.id}
											// fullWidth
											inputProps={{
												...params.inputProps,
												// autoComplete: "disabled", // disable autocomplete and autofill
											}}
										/>
										)}
									/> */}
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
                          value={studentData?.id??""}
                          disabled={true}
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
                        <TextField value={studentData?.name??""} disabled={true}
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
                        <TextField value={studentData?.email??""} disabled={true}
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
                        <TextField value={studentData?.proposed_study[0]?.course_title} disabled={true}
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
													Reviewer
                        </Typography>
                        <TextField value={(dataSaved ? dataSaved[0]?.teacher.name : null) || session?.user.name} disabled={true}
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
													Reviewer Date
                        </Typography>
                        <TextField
                          value={new Date().toLocaleString()}
                          disabled={true}
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
                            Aspects
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
                          >
                            Rating
                          </TableCell>
                          <TableCell
                            sx={{
                              bgcolor: "#003B5C",
                              color: "#fff",
                            }}
                            align="center"
                          >
                            Score
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
												// [
                        //   "Academic background",
                        //   "Leadership",
                        //   "Social engagement",
                        //   "Language proficiency",
                        //   "Purpose of study",
                        // ]
												aspectList.map(x => x.name)
												.map((item, index) => (
                          <TableRow
														key={index}
                            sx={{
                              bgcolor: index % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
                            }}
													>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell>
															<Typography variant="subtitle2" color="initial">{item}</Typography>
														</TableCell>
                            <TableCell>
                              <ControllerTextField
                                control={control}
                                name={item}
                                rules={{
                                  required: "This field is required.",
                                  validate: (x) => x !== "",
                                }}
                                CustomComponent={function (props) {
                                  return (
                                    <FormControl component="fieldset">
                                      {/* <FormLabel component="legend"
																		sx={{ fontWeight : 700, }} 
																	>Ability to organize workload</FormLabel> */}
                                      <RadioGroup {...props}>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          sx={{
                                            width: "100%",
                                          }}
                                        >
																					{
																						scoreList.map(scoreItem => (
																							<FormControlLabel
																								key={scoreItem.id}
																								// value={1}
																								value={scoreItem.value}
																								control={
																									<Radio
																										disabled={
																											session?.user.ROLE_ID !== 3
																										}
																									/>
																								}
																								label={`${scoreItem.name} (${scoreItem.value})`}
																							/>
																						))
																					}
                                          {/* <FormControlLabel
                                            value={1}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Poor (1)"
                                          />
                                          <FormControlLabel
                                            value={2}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Moderate (2)"
                                          />
                                          <FormControlLabel
                                            value={3}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Good (3)"
                                          />
                                          <FormControlLabel
                                            value={4}
                                            control={
                                              <Radio
                                                disabled={
                                                  session?.user.ROLE_ID == 3
                                                }
                                              />
                                            }
                                            label="Very Good (4)"
                                          /> */}
                                        </Stack>
                                      </RadioGroup>
                                      <FormHelperText></FormHelperText>
                                    </FormControl>
                                  );
                                }}
                              />
                            </TableCell>
                            {/* <TableCell align="center">
                              {watchAllFields[item] ?? ""}
                            </TableCell> */}
														<Score control={control} item={item} />
                          </TableRow>
                        ))}
												<TotalScore control={control} />
												{/* <TableRow>
													<TableCell></TableCell>
													<TableCell></TableCell>
													<TableCell align="right">
														<Typography variant="subtitle2" color="initial">Total Score</Typography>
													</TableCell>
													<TableCell align="center">{Object.keys(watchAllFields).reduce((a,b) => a + (!isNaN(parseInt(watchAllFields[b])) ?parseInt(watchAllFields[b]) : 0),0)}</TableCell>
												</TableRow> */}
                      </TableBody>
                    </Table>
										<Stack
											pt={2}
											px={3}
											sx={{
												width: "100%",
											}}
										>
											<Typography variant="h6" color="initial" m={1}>Interview Notes : </Typography>
											<TextField 
												value={notes?.notes}
												onChange={e => {
													clearTimeout(notesChange)
													notesChange = setTimeout(setNotes(prev => ({...prev, notes : e.target.value})),1000)
												}}
												disabled={session.user.ROLE_ID !== 3}
											/>
										</Stack>
										{
											session.user.ROLE_ID === 3 &&
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
                          onClick={() => {
                            // router.query.state = "applicant-declaration"
                            // router.push(router)
                          }}
                        >
                          Save
                        </Button>
                      </Stack>
										}
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
					ref={ref}
					label={label || (name ? name.split('_').map(x => capitalize(x)).join(' ') : '')}
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

function Score({control, item}) {
	const score = useWatch({
		control,
		name : item,
	})
	return (
		<TableCell align="center">
			{score ?? ""}
		</TableCell>
	)	
}

function TotalScore({control}) {
	const totalScore = useWatch({
		control,
	})
	return (
		<TableRow>
			<TableCell></TableCell>
			<TableCell></TableCell>
			<TableCell align="right">
				<Typography variant="subtitle2" color="initial">Total Score</Typography>
			</TableCell>
			<TableCell align="center">{Object.keys(totalScore).reduce((a,b) => a + (!isNaN(parseInt(totalScore[b])) ?parseInt(totalScore[b]) : 0),0)}</TableCell>
		</TableRow>
	)	
}