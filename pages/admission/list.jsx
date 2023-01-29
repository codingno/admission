import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Autocomplete, Button, Grid, Card, Stack, TextField, Typography } from "@mui/material";
import axios from 'axios';

import DashboardLayout from "../../components/dashboard";
import List from "../../components/list/ListMaster";

function handleError(error) {
	if(error.response)	
		alert(error.response.data)
	else alert(error)
}

export default function AdmissionList() {
  const router = useRouter();
  const { data: session, status: statusSession } = useSession();
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

  if (statusSession === "loading") return "";
  else if (statusSession === "unauthenticated") {
    router.push("/auth/authentication/signin");
    return "";
  } else if (statusSession === "authenticated") {
    if (session.user.ROLE_ID !== 1) {
      router.push("/");
      return "";
    }
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
          {/* <Card
            sx={{
              width: "100%",
              height: "100%",
              // backgroundColor : '#000',
              paddingBottom: "100px",
            }}
          > */}
            <Stack pt={2} px={3}>
							<List
								title="Admission List"
								name="student"
								getUrl={
									// !facultySelected ?
									// "/api/admission?role_id=2" :
									// facultySelected.id ?
									// "/api/admission?role_id=2&course_title=" + facultySelected.name :
									`/api/admission?role_id=2${ submitSelected.id == null ? '' : '&submitted=' + submitSelected.id}${ !facultySelected.id ? '' : '&course_title=' + facultySelected.id}`
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
									<Autocomplete 
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
									/>
									</>
								}
								reload={reload}
								setReload={setReload}
								// addLink="/dashboard/seller/create"
								// addModal={handleOpen}
								tableHead={[
									// { id: "id", label: "Personal ID", key: "personal_detail", key_value : ["personal_id"], alignRight: false },
									{ id: "personal_id", label: "Personal ID", sx: { minWidth : 90 }, center : "center", 
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
									{ id: "submitted", label: "Status Submit", sx: { minWidth : 150, justifyContent : 'center', }, center : "center", 
										CustomComponent : (x) => (
											<Stack
												direction="row"
												alignItems="center"
												justifyContent="center"
												spacing={1}
											>
												{
													x.submitted ?
													<Button 
													color="success">
													<Typography variant="subtitle2" 
													>Submitted</Typography>
													</Button>:
													<Typography variant="subtitle2" color="error">Not Submitted</Typography> 
												}
											</Stack>
										)
									},
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
									{ id: "email", label: "Email", alignRight: false, sx: {minWidth : 250 } },
									// { id: "status", label: "Status", alignRight: false },
									{ id: "personal_detail", label: "Date of Birth", sx: {minWidth : 100 }, key: "personal_detail", key_value : ["date_of_birth"], },
									{ id: "country", label: "Citizenship", sx: {minWidth : 150 }, center : "center", CustomComponent : (x) => (
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
									{ id: "course_title", label: "Faculty", sx: { minWidth : 300 },  center : "center", CustomComponent : (x) => (
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
									// { id: "date_of_birth", label: "Date of Birth", key : "personal_detail", key_value : ["date_of_birth"], center : "center"},
									// { id: "" },
								]}
								moremenu={[
									{
										name: "Review",
										function : (item) => router.push('/admission/' + item),
										link: "/dashboard/seller/edit/",
									},
								]}
								// deleteOptions={{
								// 	link: "/api/users/",
								// 	note: "Are you sure to delete this item?",
								// }}
							/>
						</Stack>
          {/* </Card> */}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
