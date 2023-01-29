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
  capitalize,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  FormHelperText,
  RadioGroup,
  Radio,
} from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../components/dashboard";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import axios from "axios";

import Upload from "../upload";
import FormParent from "../../components/form/FormParent";

function handleError(error) {
	if(error.response)	
		alert(error.response.data)
	else alert(error)
}

export default function AdmissionData() {
		const router = useRouter()

		const { id } = router.query
		const { data: session, status : statusSession } = useSession();

		const [dataSaved, setDataSaved] = useState(null)
	
		useEffect(() => {
			if(id)
				getDataSaved()

			async function getDataSaved() {
				try {
					const { data } = await axios.get('/api/admission/' + id)
					if(!data)
						return alert("Data not found.")
					setDataSaved(data)
				} catch (error) {
						handleError(error)	
				}	
			}
		}, [id])
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
            <Stack pt={2} px={3}>
							{
								dataSaved &&
								<>
									{
										dataSaved.personal_detail[0] && 
										<>
											<Typography variant="h4" color="primary">Personal Details</Typography>
											<ul style={{ listStyle : 'none'}}>
												<li>
													<Grid container spacing={0}>
														<Grid item xs={2}	>
															<Typography variant="body1" color="initial">Name</Typography>
														</Grid>
														<Grid item xs={8}	>
															<Typography variant="body1" color="initial">: {dataSaved.personal_detail[0].tittle}. {dataSaved.personal_detail[0].given_name} {dataSaved.personal_detail[0].family_name}</Typography>
														</Grid>
													</Grid>
												</li>
												<li>
													<Grid container spacing={0}>
														<Grid item xs={2}	>
															<Typography variant="body1" color="initial">Place of Birth</Typography>
														</Grid>
														<Grid item xs={8}	>
															<Typography variant="body1" color="initial">: {dataSaved.personal_detail[0].pla}. {dataSaved.personal_detail[0].given_name} {dataSaved.personal_detail[0].family_name}</Typography>
														</Grid>
													</Grid>
												</li>
											</ul>
										</>
									}
									<Typography variant="h4" color="primary">Contact Details</Typography>
									<Typography variant="h4" color="primary">Financial Support</Typography>
									<Typography variant="h4" color="primary">Proposed Study Program</Typography>
									<Typography variant="h4" color="primary">Education Background</Typography>
									<Typography variant="h4" color="primary">Proficiency</Typography>
									<Typography variant="h4" color="primary">Job Status</Typography>
									<Typography variant="h4" color="primary">Referee Details</Typography>
									<Typography variant="h4" color="primary">Document Uploads</Typography>
								</>
							}
						</Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
