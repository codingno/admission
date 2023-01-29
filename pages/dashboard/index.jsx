import React, { useState, useEffect } from 'react'
import { Button, Card, Grid, Stack, Typography, Autocomplete, TextField, } from '@mui/material'

import DashboardLayout from '../../components/dashboard'
import List from '../../components/list/ListMaster'
import router from 'next/router'
import axios from 'axios'

function Dashboard() {
	// const [data, setData] = useState([])
	const [data, setData] = useState([
	])
	const [facultyOptions, setFacultyOptions] = useState([{id : null, name : "" }])
	const [facultySelected, setFacultySelected] = useState({id : null, name : "" })
	const [submitOptions, setSubmitOptions] = useState([{id : null, name : "" },{id : null, name : "All data" }, {id : 1, name : "Submitted" }, {id : 0, name : "Not Submitted" }, ])
	const [submitSelected, setSubmitSelected] = useState({id : null, name : "" })
	const [reload, setReload] = useState(true)

	useEffect(() => {
		getFacultyOptions()
		
		async function getFacultyOptions() {
			try {
				const { data } = await axios.get('/api/proposed-study')
				if(data)
					setFacultyOptions([{id : null, name : "" }, ...data.map(x => ({ id : x, name : x })), {id : null, name : "All Data"}])
				setReload(false)
			} catch (error) {
				handleError(error)	
			}	
		}
	},[])

	useEffect(() => {
		getDashboardData()

		async function getDashboardData() {
			try {
				const { data }	= await axios.get('/api/dashboard')
				if(data)
					setData(data)
			} catch (error) {
				if(error.response)
					alert(error.response.data)
				else
					alert(error)
			}	
		}
	}, [])
	
	return (
		<DashboardLayout>
			<Grid
				container
				spacing={1}
				direction="row"
				justifyContent="center"
				alignItems="center"
				// alignContent="center"
				wrap="wrap"
				sx={{
					width : '100%',
					// height : '100%',
					minHeight : '600px',
				}}						
			>
				<Grid
					xs={12}
					item
					sx={{
						width : '100%',
						height : '100%',
					}}						
				>
					<Stack
						direction="row"
						justifyContent="space-around"
						padding={2}
						sx={{
							flexWrap : 'wrap',
						}}
					>
					{
						// data.filter(x => x.position == 'top').map((item, indexItem) => (
						data?.dashboardTop &&
						Object.keys(data.dashboardTop[0]).map((item, indexItem) => (
							<Card
							sx={{
								minWidth : '150px',
								height : '100%',
								// backgroundColor : '#000',
								// backgroundColor : getRandomColor(),
								// color : '#FFF',
								...randomColorUIII(indexItem),
								// paddingBottom : '100px',
								display : 'flex',
								margin : '.5rem 0',
								padding : '1rem 1.5rem',
								flexDirection : 'column',
								justifyContent : 'center',
								alignItems : 'center',
							}}						
							>
								<Typography variant="h4" >
								{data.dashboardTop[0][item]}
								</Typography>
								<Typography variant="h6" >
								{item}
								</Typography>
							</Card>
						))
					}
					</Stack>
					<Stack
						direction="row"
						justifyContent="space-around"
						padding={2}
						sx={{
							flexWrap : 'wrap',
						}}
					>
					{
						// data.filter(x => x.position == 'bottom').map(item => (
						data?.dashboardBottom &&
						Object.keys(data.dashboardBottom[0]).map((item, indexItem) => (
							<Card
							sx={{
								minWidth : '150px',
								height : '100%',
								backgroundColor : '#003b5c',
								// backgroundColor : getRandomColor(),
								// color : '#FFF',
								color : '#FFBF30',
								// paddingBottom : '100px',
								display : 'flex',
								margin : '.5rem 0',
								padding : '1rem 2rem',
								flexDirection : 'column',
								justifyContent : 'center',
								alignItems : 'center',
							}}						
							>
								{
									item.type == 'double' ?
									<>
								<Typography variant="h3" >
								{
									item.data.map((y,iDy) => (
										<>{y.total}{iDy !== item.data.length - 1 ? ' / ' : ''}</>
									))
								}
								</Typography>
								<Typography variant="h5" >
								{item.name}
								</Typography> 
									</> :
									<>
								<Typography variant="h3" >
								{data.dashboardBottom[0][item]}
								</Typography>
								<Typography variant="h5" >
								{item}
								</Typography>
									</>
								}
							</Card>
						))
					}
					</Stack>
				</Grid>
				<Grid
					xs={12}
					item
					sx={{
						width : '100%',
						height : '100%',
					}}						
				>
            <Stack pt={2} px={3}>
							<List
								title="List Pass Selection"
								name="student"
								getUrl={
									!facultySelected ?
									"/api/admission?role_id=2&submitted=1&passed=1" :
									facultySelected.id ?
									"/api/admission?role_id=2&submitted=1&passed=1&course_title=" + facultySelected.name :
									`/api/admission?role_id=2&submitted=1&passed=1`
								}
								additionalToolbar={
									<>
									{
									facultyOptions.length > 0 &&
									<Autocomplete 
										sx={{ minWidth : 250, ml : 3, }}
										value={facultySelected}
										onChange={(event, data) => { setFacultySelected(data); setReload(true)}}
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
									}
									{/* <Autocomplete 
										sx={{ minWidth : 250, ml : 3, }}
										value={submitSelected}
										onChange={(event, data) => { setSubmitSelected(data); setReload(true)}}
										options={submitOptions}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
										<TextField
											{...params}
											// label={params.fullname}
											label="Submit Status"
											item={params.id}
											// fullWidth
											inputProps={{
												...params.inputProps,
												// autoComplete: "disabled", // disable autocomplete and autofill
											}}
										/>
										)}
									/> */}
									</>
								}
								reload={reload}
								setReload={setReload}
								// addLink="/dashboard/seller/create"
								// addModal={handleOpen}
								tableHead={[
									// { id: "id", label: "Personal ID", key: "personal_detail", key_value : ["personal_id"], alignRight: false },
									{ id: "personal_id", label: "ID", sx: { minWidth : 30 }, center : "center", 
										CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="center"
												justifyContent="center"
												spacing={1}
											>
												<Typography variant="subtitle2" color="initial">{x?.id}</Typography> 
											</Stack>
										)
									},
									// { id: "submitted", label: "Status Submit", sx: { minWidth : 150, justifyContent : 'center', }, center : "center", 
									// 	CustomComponent : (x) => (
									// 		<Stack
									// 			direction="row"
									// 			alignItems="center"
									// 			justifyContent="center"
									// 			spacing={1}
									// 		>
									// 			{
									// 				x.submitted ?
									// 				<Button 
									// 				color="success">
									// 				<Typography variant="subtitle2" 
									// 				>Submitted</Typography>
									// 				</Button>:
									// 				<Typography variant="subtitle2" color="error">Not Submitted</Typography> 
									// 			}
									// 		</Stack>
									// 	)
									// },
									{ id: "name", label: "Name", alignRight: false, sx: {minWidth : 150 },
										CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="flex-start"
												justifyContent="flex-start"
												spacing={1}
												onClick={() => router.push('/admission/' + x.id)}
											>
												<Typography variant="subtitle2" color="initial">{x.name}</Typography> 
											</Stack>
										)
								 },
									{ id: "gender", label: "Gender", alignRight: false, center : 'center', sx: {minWidth : 50 },
										CustomComponent : (x) => (
											<Stack
												direction="row"
												// alignItems="flex-start"
												// justifyContent="flex-start"
												alignItems="center"
												justifyContent="center"
												spacing={1}
												onClick={() => router.push('/admission/' + x.id)}
											>
												<Typography variant="subtitle2" color="initial">{x.personal_detail[0]?.gender}</Typography> 
											</Stack>
										)
								 },
									// { id: "email", label: "Email", alignRight: false, sx: {minWidth : 250 } },
									// { id: "status", label: "Status", alignRight: false },
									// { id: "personal_detail", label: "Date of Birth", sx: {minWidth : 100 }, key: "personal_detail", key_value : ["date_of_birth"], },
									{ id: "country", label: "Citizenship", sx: {minWidth : 110 }, CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="flex-start"
												justifyContent="flex-start"
												spacing={1}
											>
												<Typography variant="subtitle2" color="initial">{x?.personal_detail[0]?.country_citizen}</Typography> 
											</Stack>
										)
									},
									{ id: "financial", label: "Financial", sx: {minWidth : 150 }, CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="flex-start"
												justifyContent="flex-start"
												spacing={1}
											>
												<Typography variant="subtitle2" color="initial">{x?.financial_support[0]?.admission_type}</Typography> 
											</Stack>
										)
									},
									{ id: "program", label: "Program", sx: {minWidth : 50 }, CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="flex-start"
												justifyContent="flex-start"
												spacing={1}
											>
												<Typography variant="subtitle2" color="initial">{x?.proposed_study[0]?.level_study}</Typography> 
											</Stack>
										)
									},
									{ id: "course_title", label: "Faculty", sx: { minWidth : 200 },  CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="center"
												justifyContent="center"
												spacing={1}
											>
												<Typography variant="subtitle2" color="initial">{x?.proposed_study[0]?.course_title}</Typography> 
											</Stack>
										)
									},
									{
										id: "interview_score_value",
										label: "Score",
										center: "center",
										sx: { minWidth: 50, justifyContent : 'center', },
									},
									// { id: "date_of_birth", label: "Date of Birth", key : "personal_detail", key_value : ["date_of_birth"], center : "center"},
									// { id: "" },
								]}
								moremenu={[
								]}
								// moremenu={[
								// 	{
								// 		name: "Review",
								// 		function : (item) => router.push('/admission/' + item),
								// 		link: "/dashboard/seller/edit/",
								// 	},
								// ]}
								rowsPerPage={10}
								// deleteOptions={{
								// 	link: "/api/users/",
								// 	note: "Are you sure to delete this item?",
								// }}
							/>
						</Stack>
				</Grid>
			</Grid>
		</DashboardLayout>
	)
}

export default Dashboard

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomColorUIII(index) {
	var listColor = [
		{
			backgroundColor : '#31261D',
			color : '#FFF',
		},
		{
			backgroundColor : '#E3A130',
			color : '#FFF',
		},
		{
			backgroundColor : '#47977D',
			color : '#FFF',
		},
		{
			backgroundColor : '#84754E',
			color : '#FFF',
		},
		{
			backgroundColor : '#C7C9C7',
			color : '#003B5C',
		},
		{
			backgroundColor : '#003B5C',
			// color : '#FFE16A',
			color : '#FFBF30',
		},
		{
			backgroundColor : '#00778B',
			color : '#FFF',
		},
	]
	const checkIndex = index % listColor.length
	return listColor[checkIndex]
}