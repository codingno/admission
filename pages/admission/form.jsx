import {
  Autocomplete,
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
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { TabPanel, TabContext, LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import React, { useState, useEffect, useRef } from "react";
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
import FormContainer from "../../components/form/FormContainer";

const states = [
  "personal-details",
  "contact-details",
  // 'emergency-contact-details',
  "financial-support",
  "proposed-study-program",
  "education-background",
  "language-ability",
  "job-status",
  "referee-details",
  "applicant-declaration",
  "document-to-be-upload",
];

const documentForUpload = [
  "ID or Passport (2 pages, cover passport and ID page passport)",
  "Vaccine certificate",
  "Education certificate",
  "Certified copies of academic transcripts",
  "Motivation Letter",
  "English Certificate",
  "Arabic Certificate",
  "Curriculum Vitae",
  "Self photo",
  "Research proposal (doctoral program only)",
  "Publication (doctoral program only)",
  "Proof of Payment",
];

const options = [
  {
    faculty: "Education",
    major: ["Master of Education", "PhD of Education"],
  },
  {
    faculty: "Economics and Business",
    major: [
      "Master of Economics and Business",
      "PhD of Economics and Business",
    ],
  },
  {
    faculty: "Social Sciences",
    major: ["Master of Political Science", "PhD of Political Science"],
  },
  {
    faculty: "Islamic Studies",
    major: ["Master of Islamic Studies", "PhD of Islamic Studies"],
  },
];

const optionsFaculty = [
  {
    faculty: "Education",
    major: ["Education"],
  },
  {
    faculty: "Economics and Business",
    major: ["Economics"],
  },
  {
    faculty: "Social Sciences",
    major: ["Political Science"],
  },
  {
    faculty: "Islamic Studies",
    major: ["Islamic Studies"],
  },
];

function handleError(error) {
  if (error.response) alert(error.response.data);
  else alert(error);
}

let render = 0;

export default function FormAdmission() {
  render++;
  console.log("🚀 ~ file: form.jsx ~ line 65 ~ render", render);
  const router = useRouter();
  const { data: session, status: statusSession } = useSession();

  const [tabActive, setTabActive] = useState(router.query.state);
  const [tabState, setTabState] = useState(states.indexOf(tabActive));
  const [understanding, setUnderstanding] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [otherDocument, setOtherDocument] = useState("");
  const [loading, setLoading] = useState(true);

  const [preAdmission, setPreAdmission] = useState(true);
  const [preAdmissionLoading, setPreAdmissionLoading] = useState(false);
  const preAdmissionFacultyRef = useRef(null);
  const [preFaculty, setPreFaculty] = useState({});
  console.log(
    "🚀 ~ file: form.jsx ~ line 116 ~ FormAdmission ~ preFaculty",
    preFaculty
  );
  const [preMajor, setPreMajor] = useState("");
  console.log(
    "🚀 ~ file: form.jsx ~ line 118 ~ FormAdmission ~ preMajor",
    preMajor
  );
  const preAdmissionMajorRef = useRef(null);
  const preAdmissionNationalityRef = useRef(null);
  const [preAdmissionGender, setPreAdmissionGender] = useState("Male");

  const [faculty, setFaculty] = useState(optionsFaculty[0].faculty);
  const [major, setMajor] = useState(optionsFaculty[0].major);

  const [dataSaved, setDataSaved] = useState(null);
  const [reload, setReload] = useState(true);

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const watchJobStatus = watch("job_status_type");

  useEffect(() => {
    setPreMajor("");
  }, [preFaculty]);

  useEffect(() => {
    setMajor(optionsFaculty.filter((x) => x.faculty == faculty)[0].major[0]);
  }, [faculty]);

  useEffect(() => {
    if (faculty && major) {
      setValue("course_title", `${major} at the Faculty of ${faculty}`);
    }
  }, [faculty, major]);

  useEffect(() => {
    if (session?.user && reload) getDataSaved();

    async function getDataSaved() {
      try {
        const { data } = await axios.get("/api/admission/" + session.user.ID);
        if (data.submitted === null && !data.pre_admission)
          setPreAdmission(false);
        setDataSaved(data);
        if (data) {
          if (data.submitted) return router.push("/admission/" + data.id);
          const tableName = Object.keys(data).filter((x) =>
            Array.isArray(data[x])
          );
          tableName.map((x) => {
            if (data[x].length > 0) {
              data[x].map((y, idy) => {
                Object.keys(y).map((z) => {
                  if (z === "id" || z === "personal_id") return;

                  if (x === "language_ability") {
                    if (z === "proficiency_score") {
                      if (y.language_type === "English")
                        setValue("english_proficiency_score", y[z].toString());
                      else if (y.language_type === "Arabic")
                        setValue("arabic_proficiency_score", y[z].toString());
                      else setValue(z, y[z].toString());
                    }
                    return;
                  }

                  if (x === "referee_detail") {
                    const referee_number =
                      idy === 0 ? "referee1_" : "referee2_";
                    setValue(referee_number + z, y[z]);
                    return;
                  }

                  if (x === "education_background") {
                    if (z !== "degree_type") {
                      const education = y.degree_type + "_" + z;
                      setValue(education, y[z]);
                    }
                    return;
                  }

                  if (x === "job_status") {
                    if (z === "unemployed_type" && y[z])
                      setValue("job_status_type", "Unemployed");
                    else if (z === "self_employee_type" && y[z])
                      setValue("job_status_type", "Self Employment");
                    else if (z === "employee_type" && y[z])
                      setValue("job_status_type", "Currently employed");
                    return;
                  }

                  setValue(z, y[z]);
                });
              });
            }
            setReload(false);
          });
        }
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        handleError(error);
      }
    }
  }, [session, reload]);

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
    setLoading(true);
    if (confirm("Save data?"))
      try {
        const { data } = await axios.post(
          "/api/admission/" + session.user.ID,
          prepareData
        );
        alert("Data Saved.");
        setLoading(false);
        router.query.state = "document-to-be-upload";
        router.push(router);
      } catch (error) {
        if (error.response) alert(error.response.data);
        else alert(error);
      }
  }

  async function documentUpload(data, name, filename) {
    try {
      console.log("/api/upload/" + session.user.ID, {
        name: "ID or Passport",
        filename: `id-passport-` + session.user.ID,
        url_link: process.env.NEXT_PUBLIC_API_URL + "/" + data,
      });
      const isExist = dataSaved?.document_upload.filter(
        (x) => x.name == name
      )[0];
      // const resp = await axios.post('/api/upload/' + session.user.ID, { name : 'ID or Passport', filename : data, url_link : router.basePath + '/' + data})
      const response = await axios.post("/api/upload/" + session.user.ID, {
        ...(isExist ?? {}),
        name,
        filename,
        url_link: process.env.NEXT_PUBLIC_API_URL + "/" + data,
      });
      alert("Upload Successfully.");
      setReload(true);
    } catch (error) {
      alert(error);
    }
  }

  if (statusSession === "loading") return "";
  if (statusSession === "unauthenticated") {
    // router.push('/auth/signin')
    router.push("/auth/authentication/signin");
    return "";
  } else if (statusSession === "authenticated" && !router.query.state) {
    // if(session.user.employee_role_id == process.env.NEXT_PUBLIC_QC_ROLE_ID)
    // 	router.push('/dashboard/product/qc-detail')
    // else
    // 	router.push('/dashboard?state=personal-details')
    // 	router.query.id = x[0].id;
    router.query.state = "personal-details";
    router.push(router);
  }

  if (loading) {
    return (
      <Modal
        BackdropProps={{
          style: {
            background: "linear-gradient(75deg, #003b5c 0%, #00778b 100%)",
          },
        }}
        open={loading}
        // onClose={() => setLoading(false)}
        sx={{ display: "flex" }}
      >
        <CircularProgress sx={{ margin: "auto", outline: "none" }} />
      </Modal>
    );
  }

  if (!preAdmission) {
    return (
      <Modal
        open={!preAdmission}
        BackdropProps={{
          style: {
            background: "linear-gradient(75deg, #003b5c 0%, #00778b 100%)",
          },
        }}
      >
        <Card
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 600,
            width: "80%",
            p: 5,
            // '&:focused-visible': {
            outline: "none",
            // }
          }}
        >
          <Stack>
            <Typography variant="h5" color="primary" textAlign="center">
              Considering applying to University?
            </Typography>
            <Typography variant="h5" color="primary" textAlign="center">
              Let us know your interest
            </Typography>
            <FormParent>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={preFaculty}
                onChange={(e, dt) => setPreFaculty(dt)}
                options={options}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Faculty" />
                )}
                getOptionLabel={(x) => x.faculty || ""}
              />
              {/* <FormControl sx={{ 
									width: "100%" 
									}} variant="outlined">
										<TextField label="Faculty" name="faculty" type="text" inputRef={preAdmissionFacultyRef} />
									</FormControl> */}
            </FormParent>
            <FormParent>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={preMajor}
                onChange={(e, dt) => setPreMajor(dt)}
                options={preFaculty?.major ?? []}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Study Program" />
                )}
                // getOptionLabel={x => x.faculty || ""}
              />
              {/* <FormControl sx={{ 
									width: "100%" 
									}} variant="outlined">
										<TextField label="Major" name="major" type="text" inputRef={preAdmissionMajorRef} />
									</FormControl> */}
            </FormParent>
            <FormParent>
              <FormControl
                sx={{
                  width: "100%",
                }}
                variant="outlined"
              >
                <TextField
                  label="Nationality"
                  name="nationality"
                  type="text"
                  inputRef={preAdmissionNationalityRef}
                />
              </FormControl>
            </FormParent>
            <FormControl
              component="fieldset"
              sx={{ my: 1.5, ml: 1 }}
              variant="outlined"
            >
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                value={preAdmissionGender}
                onChange={(e, dt) => setPreAdmissionGender(dt)}
                name="gender"
              >
                <Stack
                  direction="row"
                  // justifyContent="space-between"
                  sx={{
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </Stack>
              </RadioGroup>
              <FormHelperText></FormHelperText>
            </FormControl>
            <LoadingButton
              variant="contained"
              loading={preAdmissionLoading}
              onClick={async () => {
                try {
                  // const faculty = preAdmissionFacultyRef.current.value
                  // const program_study = preAdmissionMajorRef.current.value
                  const nationality = preAdmissionNationalityRef.current.value;
                  const faculty = preFaculty?.faculty ?? "";
                  const program_study = preMajor;
                  if (faculty == "" || program_study == "" || nationality == "")
                    return alert(
                      "Please fill in all the fields to continue the process."
                    );
                  setPreAdmissionLoading(true);
                  const preparePreAdmission = {
                    personal_id: dataSaved.id,
                    faculty,
                    program_study,
                    nationality,
                    gender: preAdmissionGender,
                  };
                  const { data } = await axios.post("/api/pre-admission", [
                    preparePreAdmission,
                  ]);
                  setPreAdmissionLoading(false);
                  setPreAdmission(true);
                  setReload(true);
                } catch (error) {
                  alert(error);
                  setPreAdmissionLoading(false);
                }
              }}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Card>
      </Modal>
    );
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
            <Stack pt={2} px={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography variant="h5" color="primary">
                  {router.query.state
                    ? router.query.state
                        .split("-")
                        .map((x) => capitalize(x))
                        .join(" ")
                    : ""}
                </Typography>
                <TabContext value={router.query.state}>
                  <form onSubmit={handleSubmit(submitForm)}>
                    <TabPanel value="personal-details">
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
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="tittle"
                              rules={{
                                required: "This field is required.",
                                validate: (x) => x !== "",
                              }}
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Title
                                    </FormLabel>
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="Mr"
                                          control={<Radio />}
                                          label="Mr"
                                        />
                                        <FormControlLabel
                                          value="Mrs"
                                          control={<Radio />}
                                          label="Mrs"
                                        />
                                        <FormControlLabel
                                          value="Ms"
                                          control={<Radio />}
                                          label="Ms"
                                        />
                                        <FormControlLabel
                                          value="Miss"
                                          control={<Radio />}
                                          label="Miss"
                                        />
                                        <FormControlLabel
                                          value=""
                                          control={<Radio />}
                                          label="Other"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <ControllerTextField
                              control={control}
                              name="family_name"
                            />
                            <ControllerTextField
                              control={control}
                              name="given_name"
                            />
                            <ControllerTextField
                              control={control}
                              name="place_of_birth"
                            />
                            <Stack
                              direction="row"
                              maxWidth="80%"
                              justifyContent="space-between"
                            >
                              <ControllerTextField
                                control={control}
                                name="date_of_birth"
                                CustomComponent={function (props) {
                                  return (
                                    <DatePicker
                                      shouldDisableTime={() => true}
                                      {...props}
                                      value={props.value || null}
                                      // label="Date&Time picker"
                                      // value={start_time}
                                      // onChange={setStartTime}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ margin: ".5rem 0" }}
                                        />
                                      )}
                                    />
                                  );
                                }}
                              />
                              <ControllerTextField
                                control={control}
                                name="gender"
                                CustomComponent={function (props) {
                                  return (
                                    <FormControl component="fieldset">
                                      <FormLabel component="legend">
                                        Gender
                                      </FormLabel>
                                      <RadioGroup {...props}>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          sx={{
                                            width: "100%",
                                          }}
                                        >
                                          <FormControlLabel
                                            value="Female"
                                            control={<Radio />}
                                            label="Female"
                                          />
                                          <FormControlLabel
                                            value="Male"
                                            control={<Radio />}
                                            label="Male"
                                          />
                                        </Stack>
                                      </RadioGroup>
                                      <FormHelperText></FormHelperText>
                                    </FormControl>
                                  );
                                }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="country_citizen"
                              label="Citizenship"
                            />
                            <ControllerTextField
                              control={control}
                              name="national_identity_number"
                            />
                            <ControllerTextField
                              control={control}
                              name="passport_no"
                            />
                            <Stack
                              direction="row"
                              maxWidth="80%"
                              justifyContent="space-between"
                            >
                              <ControllerTextField
                                control={control}
                                name="issue_date"
                                CustomComponent={function (props) {
                                  return (
                                    <DatePicker
                                      shouldDisableTime={() => true}
                                      {...props}
                                      value={props.value || null}
                                      // label="Date&Time picker"
                                      // value={start_time}
                                      // onChange={setStartTime}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ margin: ".5rem 0" }}
                                        />
                                      )}
                                    />
                                  );
                                }}
                              />
                              <ControllerTextField
                                control={control}
                                name="expiry_date"
                                CustomComponent={function (props) {
                                  return (
                                    <DatePicker
                                      shouldDisableTime={() => true}
                                      {...props}
                                      value={props.value || null}
                                      // label="Date&Time picker"
                                      // value={start_time}
                                      // onChange={setStartTime}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ margin: ".5rem 0" }}
                                        />
                                      )}
                                    />
                                  );
                                }}
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem auto" }}
                            onClick={() => {
                              router.query.state = "contact-details";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel value="contact-details">
                      <Stack justifyContent="center" alignItems="center">
                        <Grid
                          container
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignContent="center"
                          wrap="wrap"
                        >
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="address_1"
                            />
                            <ControllerTextField
                              control={control}
                              name="address_2"
                            />
                            <ControllerTextField
                              control={control}
                              name="country"
                            />
                            <ControllerTextField
                              control={control}
                              name="province"
                            />
                            <ControllerTextField
                              control={control}
                              name="city"
                              label="District / City"
                            />
                            <ControllerTextField
                              control={control}
                              name="postal_code"
                            />
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="home_number"
                            />
                            <ControllerTextField
                              control={control}
                              name="mobile_number"
                              label="Mobile Phone Number"
                            />
                            <ControllerTextField
                              control={control}
                              name="work_number"
                              label="Office Phone Number"
                            />
                            <ControllerTextField
                              control={control}
                              name="primary_email"
                            />
                            <ControllerTextField
                              control={control}
                              name="alternative_email"
                            />
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "personal-details";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                            onClick={() => {
                              router.query.state = "financial-support";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
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
                    <TabPanel value="financial-support">
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
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="admission_type"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">Admission Type</FormLabel> */}
                                    <RadioGroup {...props}>
                                      <Stack
                                        // direction="row"
                                        // justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="Self financing"
                                          control={<Radio />}
                                          label="Self financing"
                                        />
                                        <Typography
                                          variant="body1"
                                          color="initial"
                                          mt={2}
                                          mb={1}
                                        >
                                          Apply for Scholarship :
                                        </Typography>
                                        <Stack
                                        // ml={3}
                                        >
                                          <FormControlLabel
                                            value="IIIU Admission for Master Program"
                                            control={<Radio />}
                                            label="IIIU Admission for Master Program"
                                          />{" "}
                                          <FormControlLabel
                                            value="LPDP - IIIU Admission for Doctor Program"
                                            control={<Radio />}
                                            label="LPDP - IIIU Admission for Doctor Program"
                                          />
                                          {/* <FormControlLabel value="BAZNAS - IIIU Admission for Doctor Program" control={<Radio />} label="BAZNAS - IIIU Admission for Doctor Program" /> */}
                                        </Stack>
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "contact-details";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                            onClick={() => {
                              router.query.state = "proposed-study-program";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel value="proposed-study-program">
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
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="level_study"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Degree
                                    </FormLabel>
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="Master"
                                          control={<Radio />}
                                          label="Master"
                                        />
                                        <FormControlLabel
                                          value="PhD"
                                          control={<Radio />}
                                          label="PhD"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <br />
                            <FormControl component="fieldset">
                              <FormLabel component="legend">Faculty</FormLabel>
                              <RadioGroup onChange={(e, v) => setFaculty(v)}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  sx={{
                                    width: "100%",
                                  }}
                                >
                                  {optionsFaculty.map((x) => (
                                    <FormControlLabel
                                      value={x.faculty}
                                      control={<Radio />}
                                      label={x.faculty}
                                      checked={faculty == x.faculty}
                                    />
                                  ))}
                                </Stack>
                              </RadioGroup>
                              <FormHelperText></FormHelperText>
                            </FormControl>
                            <br />
                            <FormControl component="fieldset">
                              <FormLabel component="legend">
                                Study Program
                              </FormLabel>
                              <RadioGroup onChange={(e, v) => setMajor(v)}>
                                <Stack
                                  // direction="row"
                                  justifyContent="space-between"
                                  sx={{
                                    width: "100%",
                                  }}
                                >
                                  {!faculty
                                    ? ""
                                    : optionsFaculty
                                        .filter((x) => x.faculty == faculty)[0]
                                        ?.major.map((x) => (
                                          <FormControlLabel
                                            value={x}
                                            control={<Radio />}
                                            label={x}
                                            checked={x == major}
                                          />
                                        ))}
                                </Stack>
                              </RadioGroup>
                              <FormHelperText></FormHelperText>
                            </FormControl>
                            {/* <ControllerTextField control={control} name="course_title" 
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend">Study Program</FormLabel>
																	<RadioGroup  {...props} >
																		<Stack
																			// direction="row"
																			justifyContent="space-between"
																			sx={{
																				width : '100%',
																			}}
																		>
																		<FormControlLabel value="Education at the Faculty of Education" control={<Radio />} label="Education at the Faculty of Education" />
																		<FormControlLabel value="Economics at the Faculty of Economics and Business" control={<Radio />} label="Economics at the Faculty of Economics and Business" />
																		<FormControlLabel value="Political Science at the Faculty of Social Sciences" control={<Radio />} label="Political Science at the Faculty of Social Sciences" />
																		<FormControlLabel value="Islamic Studies at the Faculty of Islamic Studies" control={<Radio />} label="Islamic Studies at the Faculty of Islamic Studies" />
																		</Stack>
																	</RadioGroup>
																	<FormHelperText></FormHelperText>
																</FormControl>
															)
														}}
													/> */}
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "financial-support";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                            onClick={() => {
                              router.query.state = "education-background";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel value="education-background">
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
                          <Grid item lg={6} xs={12}>
                            <Typography variant="h4" color="primary" pb={2}>
                              Undergraduate Degree
                            </Typography>
                            <ControllerTextField
                              control={control}
                              name="undergraduate_institution_name"
                              label="Institution Name"
                            />
                            <ControllerTextField
                              control={control}
                              name="undergraduate_country"
                              label="Country"
                            />
                            <ControllerTextField
                              control={control}
                              name="undergraduate_province"
                              label="Province"
                            />
                            <ControllerTextField
                              control={control}
                              name="undergraduate_language"
                              label="Language of Instruction (Maximum 3 languages)"
                            />
                            {/* <ControllerTextField control={control} name="undergraduate_graduation_date" /> */}
                            <Stack
                              direction="row"
                              maxWidth="80%"
                              justifyContent="space-between"
                            >
                              <ControllerTextField
                                control={control}
                                name="undergraduate_graduation_date"
                                CustomComponent={function (props) {
                                  return (
                                    <DatePicker
                                      shouldDisableTime={() => true}
                                      {...props}
                                      value={props.value || null}
                                      // label="Date&Time picker"
                                      label="Graduation Date"
                                      // value={start_time}
                                      // onChange={setStartTime}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ margin: ".5rem 0" }}
                                        />
                                      )}
                                    />
                                  );
                                }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <Typography variant="h4" color="primary" pb={2}>
                              Master Degree
                            </Typography>
                            <ControllerTextField
                              control={control}
                              name="master_institution_name"
                              label="Institution Name"
                            />
                            <ControllerTextField
                              control={control}
                              name="master_country"
                              label="Country"
                            />
                            <ControllerTextField
                              control={control}
                              name="master_province"
                              label="Province"
                            />
                            <ControllerTextField
                              control={control}
                              name="master_language"
                              label="Language of Instruction (Maximum 3 languages)"
                            />
                            {/* <ControllerTextField control={control} name="undergraduate_graduation_date" /> */}
                            <Stack
                              direction="row"
                              maxWidth="80%"
                              justifyContent="space-between"
                            >
                              <ControllerTextField
                                control={control}
                                name="master_graduation_date"
                                CustomComponent={function (props) {
                                  return (
                                    <DatePicker
                                      shouldDisableTime={() => true}
                                      {...props}
                                      value={props.value || null}
                                      // label="Date&Time picker"
                                      label="Graduation Date"
                                      // value={start_time}
                                      // onChange={setStartTime}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          sx={{ margin: ".5rem 0" }}
                                        />
                                      )}
                                    />
                                  );
                                }}
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "proposed-study-program";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                            onClick={() => {
                              router.query.state = "language-proficiency";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel
                      value="language-proficiency"
                      title="Language Proficiency"
                    >
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
                          <Grid item lg={12} xs={12}>
                            <Alert severity="info">
                              <p>Please rate your language proficiency :</p>
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  style={{
                                    paddingRight: "1rem",
                                  }}
                                >
                                  1 = no proficiency
                                </span>
                                <span
                                  style={{
                                    paddingRight: "1rem",
                                  }}
                                >
                                  2 = elementary proficiency
                                </span>
                                <span>3 = limited working proficiency</span>
                              </p>
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  style={{
                                    paddingRight: "1rem",
                                  }}
                                >
                                  4 = professional working proficiency
                                </span>
                                <span
                                  style={{
                                    paddingRight: "1rem",
                                  }}
                                >
                                  5 = full professional proficiency
                                </span>
                                <span>6 = native/bilingual proficiency</span>
                              </p>
                            </Alert>
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="english_proficiency_score"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      English
                                    </FormLabel>
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="1"
                                          control={<Radio />}
                                          label="1"
                                        />
                                        <FormControlLabel
                                          value="2"
                                          control={<Radio />}
                                          label="2"
                                        />
                                        <FormControlLabel
                                          value="3"
                                          control={<Radio />}
                                          label="3"
                                        />
                                        <FormControlLabel
                                          value="4"
                                          control={<Radio />}
                                          label="4"
                                        />
                                        <FormControlLabel
                                          value="5"
                                          control={<Radio />}
                                          label="5"
                                        />
                                        <FormControlLabel
                                          value="6"
                                          control={<Radio />}
                                          label="6"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <br />
                            <ControllerTextField
                              control={control}
                              name="arabic_proficiency_score"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Arabic
                                    </FormLabel>
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="1"
                                          control={<Radio />}
                                          label="1"
                                        />
                                        <FormControlLabel
                                          value="2"
                                          control={<Radio />}
                                          label="2"
                                        />
                                        <FormControlLabel
                                          value="3"
                                          control={<Radio />}
                                          label="3"
                                        />
                                        <FormControlLabel
                                          value="4"
                                          control={<Radio />}
                                          label="4"
                                        />
                                        <FormControlLabel
                                          value="5"
                                          control={<Radio />}
                                          label="5"
                                        />
                                        <FormControlLabel
                                          value="6"
                                          control={<Radio />}
                                          label="6"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <br />
                            <ControllerTextField
                              control={control}
                              name="language_type"
                              label="Language"
                            />
                            <ControllerTextField
                              control={control}
                              name="proficiency_score"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">Arabic</FormLabel> */}
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="1"
                                          control={<Radio />}
                                          label="1"
                                        />
                                        <FormControlLabel
                                          value="2"
                                          control={<Radio />}
                                          label="2"
                                        />
                                        <FormControlLabel
                                          value="3"
                                          control={<Radio />}
                                          label="3"
                                        />
                                        <FormControlLabel
                                          value="4"
                                          control={<Radio />}
                                          label="4"
                                        />
                                        <FormControlLabel
                                          value="5"
                                          control={<Radio />}
                                          label="5"
                                        />
                                        <FormControlLabel
                                          value="6"
                                          control={<Radio />}
                                          label="6"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="test_name"
                              label="Test name (IELTS, TOEFL or PTE Academic)"
                            />
                            <ControllerTextField
                              control={control}
                              name="date_test_taken"
                              CustomComponent={function (props) {
                                return (
                                  <DatePicker
                                    shouldDisableTime={() => true}
                                    {...props}
                                    value={props.value || null}
                                    // label="Date&Time picker"
                                    label="Certificate Date"
                                    // value={start_time}
                                    // onChange={setStartTime}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        sx={{ margin: ".5rem 0" }}
                                      />
                                    )}
                                  />
                                );
                              }}
                            />
                            <ControllerTextField
                              control={control}
                              name="overall_score"
                            />
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "education-background";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                            onClick={() => {
                              router.query.state = "job-status";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel value="job-status">
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
                          <Grid item lg={6} xs={12}>
                            <ControllerTextField
                              control={control}
                              name="job_status_type"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="Unemployed"
                                          control={<Radio />}
                                          label="Unemployed"
                                        />
                                        <FormControlLabel
                                          value="Self Employment"
                                          control={<Radio />}
                                          label="Self Employment"
                                        />
                                        <FormControlLabel
                                          value="Currently employed"
                                          control={<Radio />}
                                          label="Employed"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <br />
                            {/* <ControllerTextField control={control} name="unemployed_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend">Unemployed?*</FormLabel>
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
                            {/* <ControllerTextField control={control} name="self_employee_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend">Self Employment*</FormLabel>
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
													<br />
													<ControllerTextField control={control} name="employee_type"
														CustomComponent={function(props) {
															return (
																<FormControl component="fieldset">
																	<FormLabel component="legend">Are you currently employed?*</FormLabel>
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
                            {watchJobStatus === "Currently employed" && (
                              <>
                                <ControllerTextField
                                  control={control}
                                  name="position_title"
                                />
                                <ControllerTextField
                                  control={control}
                                  name="organization_name"
                                />
                                <ControllerTextField
                                  control={control}
                                  name="organization_address"
                                />
                                <ControllerTextField
                                  control={control}
                                  name="date_commenced"
                                  CustomComponent={function (props) {
                                    return (
                                      <DatePicker
                                        shouldDisableTime={() => true}
                                        {...props}
                                        value={props.value || null}
                                        // label="Date&Time picker"
                                        label="Starting Date"
                                        // value={start_time}
                                        // onChange={setStartTime}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            sx={{ margin: ".5rem 0" }}
                                          />
                                        )}
                                      />
                                    );
                                  }}
                                />
                                <br />
                                <ControllerTextField
                                  control={control}
                                  name="organization_type"
                                  CustomComponent={function (props) {
                                    return (
                                      <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                          Organization Type
                                        </FormLabel>
                                        <RadioGroup {...props}>
                                          <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            sx={{
                                              width: "100%",
                                            }}
                                          >
                                            <FormControlLabel
                                              value="Goverment/public"
                                              control={<Radio />}
                                              label="Goverment / public"
                                            />
                                            <FormControlLabel
                                              value="Private"
                                              control={<Radio />}
                                              label="Private"
                                            />
                                            <FormControlLabel
                                              value="Education"
                                              control={<Radio />}
                                              label="Education"
                                            />
                                            <FormControlLabel
                                              value="NGO/civil society"
                                              control={<Radio />}
                                              label="NGO / civil society"
                                            />
                                            <FormControlLabel
                                              value="Others"
                                              control={<Radio />}
                                              label="Others"
                                            />
                                          </Stack>
                                        </RadioGroup>
                                        <FormHelperText></FormHelperText>
                                      </FormControl>
                                    );
                                  }}
                                />
                              </>
                            )}
                            <br />
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "language-proficiency";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "250px", margin: "1rem 0 1rem 0" }}
                            onClick={() => {
                              router.query.state = "referee-details";
                              router.push(router);
                            }}
                          >
                            Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel value="referee-details">
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
                          <Grid item lg={6} xs={12}>
                            <Typography variant="h4" color="primary" pb={2}>
                              Referee 1
                            </Typography>
                            <ControllerTextField
                              control={control}
                              name="referee1_title"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Title
                                    </FormLabel>
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="Mr"
                                          control={<Radio />}
                                          label="Mr"
                                        />
                                        <FormControlLabel
                                          value="Mrs"
                                          control={<Radio />}
                                          label="Mrs"
                                        />
                                        <FormControlLabel
                                          value="Ms"
                                          control={<Radio />}
                                          label="Ms"
                                        />
                                        <FormControlLabel
                                          value="Miss"
                                          control={<Radio />}
                                          label="Miss"
                                        />
                                        <FormControlLabel
                                          value=""
                                          control={<Radio />}
                                          label="Other"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_family_name"
                              label="Family Name"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_given_name"
                              label="Given Name"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_position"
                              label="Position / Title"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_relationship_to_applicant"
                              label="Relation to applicant"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_country"
                              label="Country"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_address"
                              label="Address"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_phone_number"
                              label="Phone Number"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee1_email_address"
                              label="Email Address"
                            />
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <Typography variant="h4" color="primary" pb={2}>
                              Referee 2
                            </Typography>
                            <ControllerTextField
                              control={control}
                              name="referee2_title"
                              CustomComponent={function (props) {
                                return (
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Title
                                    </FormLabel>
                                    <RadioGroup {...props}>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <FormControlLabel
                                          value="Mr"
                                          control={<Radio />}
                                          label="Mr"
                                        />
                                        <FormControlLabel
                                          value="Mrs"
                                          control={<Radio />}
                                          label="Mrs"
                                        />
                                        <FormControlLabel
                                          value="Ms"
                                          control={<Radio />}
                                          label="Ms"
                                        />
                                        <FormControlLabel
                                          value="Miss"
                                          control={<Radio />}
                                          label="Miss"
                                        />
                                        <FormControlLabel
                                          value=""
                                          control={<Radio />}
                                          label="Other"
                                        />
                                      </Stack>
                                    </RadioGroup>
                                    <FormHelperText></FormHelperText>
                                  </FormControl>
                                );
                              }}
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_family_name"
                              label="Family Name"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_given_name"
                              label="Given Name"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_position"
                              label="Position / Title"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_relationship_to_applicant"
                              label="Relation to applicant"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_country"
                              label="Country"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_address"
                              label="Address"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_phone_number"
                              label="Phone Number"
                            />
                            <ControllerTextField
                              control={control}
                              name="referee2_email_address"
                              label="Email Address"
                            />
                          </Grid>
                        </Grid>
                        <Stack
                          direction="row"
                          sx={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            right: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
                              margin: "1rem 1rem 1rem auto",
                            }}
                            onClick={() => {
                              router.query.state = "job-status";
                              router.push(router);
                            }}
                          >
                            Back
                          </Button>
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
                            Save and Next
                          </Button>
                        </Stack>
                      </Stack>
                    </TabPanel>
                    <TabPanel value="applicant-declaration">
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
                          <Grid item lg={6} xs={12}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={understanding}
                                    onChange={(e) =>
                                      setUnderstanding(e.target.checked)
                                    }
                                  />
                                }
                                label="Understanding"
                                sx={{
                                  ".MuiFormControlLabel-label": {
                                    fontWeight: 700,
                                  },
                                }}
                                disabled={dataSaved?.submitted}
                              />
                              <Typography variant="body1" color="initial">
                                I understand and confirm that:
                              </Typography>
                              <ul>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    I have read and complied with the IIIU
                                    Admission Guidelines and that the contents
                                    of my application are true and correct.
                                  </Typography>
                                </li>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    I authorize IIIU to make enquiries and to
                                    obtain official records from any university
                                    and tertiary educational institution
                                    concerning my current or previous attendance
                                    which, in its absolute discretion, it
                                    believes are necessary.
                                  </Typography>
                                </li>
                                <li>
                                  {/* <Typography variant="body1" color="error">
																			IIIU has the right to vary or cancel any made on the basis of incorrect or incomplete information provided by me or by my referees.
																		</Typography> */}
                                  <Typography variant="body1" color="error">
                                    University has the right to vary or cancel
                                    any incorrect or incomplete information,
                                    made on the basis provided by me or by my
                                    referees.
                                  </Typography>
                                </li>
                                <li>
                                  {/* <Typography variant="body1" color="initial">
																			Decisions of the admission panel are final and confidential and no correspondence about outcomes of the selection process will be entered into.
																		</Typography> */}
                                  <Typography variant="body1" color="initial">
                                    Decisions of the admissions committee are
                                    final and confidential and no correspondence
                                    about outcomes of the admission process will
                                    be entered to
                                  </Typography>
                                </li>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    All documents submitted become the property
                                    of IIIU and will not be returned.
                                  </Typography>
                                </li>
                              </ul>
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={agreement}
                                    onChange={(e) =>
                                      setAgreement(e.target.checked)
                                    }
                                  />
                                }
                                label="Agreement"
                                sx={{
                                  ".MuiFormControlLabel-label": {
                                    fontWeight: 700,
                                  },
                                }}
                                disabled={dataSaved?.submitted}
                              />
                              {/* <Typography variant="body1" color="initial">If successful in gaining IIIU Admission, I agree that I will:</Typography> */}
                              <Typography variant="body1" color="initial">
                                If successful in being accepted by the
                                University Admissions, I agree that I will:
                              </Typography>
                              <ul>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    Immediately provide IIIU with details of any
                                    incident that may reflect badly on the
                                    prestige of IIIU.
                                  </Typography>
                                </li>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    Not hold another equivalent award or
                                    scholarship at the same time, if I will be
                                    granted IIIU related scholarship.
                                  </Typography>
                                </li>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    Act in a manner befitting a recipient of
                                    IIIU Admission.
                                  </Typography>
                                </li>
                                <li>
                                  <Typography variant="body1" color="initial">
                                    Acknowledge the assistance given by IIIU in
                                    any written report, publications or
                                    publicity associated with IIIU.
                                  </Typography>
                                </li>
                              </ul>
                            </FormGroup>
                            <Typography variant="h6" color="initial">
                              Declaration and acknowledgement
                            </Typography>
                            <Typography variant="body1" color="initial">
                              In submitting this application form, I declare
                              that the information contained in it and provided
                              in connection with it is true and correct.
                            </Typography>
                            <Stack
                              direction="row"
                              sx={{
                                width: "100%",
                                position: "absolute",
                                bottom: 0,
                                right: "1rem",
                              }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  width: "250px",
                                  margin: "1rem 0 1rem auto",
                                }}
                                onClick={() => {
                                  router.query.state = "document-to-be-upload";
                                  router.push(router);
                                }}
                              >
                                Back
                              </Button>
                              {!dataSaved?.submitted ? (
                                <>
                                  {/* <Button variant="contained" sx={{ width : '250px', margin : '1rem', }} onClick={() => {
																		// router.query.state = "applicant-declaration"	
																		// router.push(router)
																}}
																// disabled={(!understanding || !agreement) && !loading}
																type="submit"
																>
																	Save</Button> */}
                                  <Button
                                    variant="contained"
                                    sx={{
                                      width: "250px",
                                      margin: "1rem 0 1rem 1rem",
                                    }}
                                    onClick={async () => {
                                      if (
                                        confirm("Are you sure to submit data?")
                                      )
                                        try {
                                          // await handleSubmit(submitForm)
                                          const watchAllFields = watch();
                                          await axios.post(
                                            "/api/admission/" + session.user.ID,
                                            watchAllFields
                                          );
                                          await axios.patch(
                                            "/api/admission/" + session.user.ID,
                                            { submitted: true }
                                          );
                                          alert("Data Submitted.");
                                          // router.query.state = "document-upload"
                                          // router.push(router)
                                          router.reload();
                                        } catch (error) {
                                          if (error.response)
                                            alert(error.response.data);
                                          else alert(error);
                                        }
                                    }}
                                    disabled={
                                      (!understanding || !agreement) && !loading
                                    }
                                  >
                                    Submit
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="contained"
                                  sx={{
                                    width: "250px",
                                    margin: "1rem 0 1rem 1rem",
                                  }}
                                  onClick={() => {
                                    router.query.state =
                                      "document-to-be-upload";
                                    router.push(router);
                                  }}
                                >
                                  Next
                                </Button>
                              )}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>
                    </TabPanel>
                  </form>
                  <TabPanel value="document-to-be-upload">
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
                          <Grid item lg={6} xs={12}>
                            {documentForUpload
                              .slice(0, documentForUpload.length / 2)
                              .map((document) => (
                                <li>
                                  <Typography
                                    variant="body1"
                                    color="initial"
                                    mr={5}
                                  >
                                    {document}
                                  </Typography>
                                  {dataSaved?.document_upload
                                    .filter((x) => x.name == document)
                                    .map((item) => (
                                      <a
                                        href={item.url_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ marginLeft: "1rem" }}
                                      >
                                        {item.filename}
                                      </a>
                                    ))}
                                  {session.user.role_id === 2 && (
                                    <Upload
                                      onUploadSuccess={(data) =>
                                        documentUpload(
                                          data,
                                          document,
                                          document
                                            .toLowerCase()
                                            .split("/")
                                            .join("-")
                                            .split(" ")
                                            .join("-") +
                                            "-" +
                                            session.user.ID
                                        )
                                      }
                                      attach={{
                                        image_url:
                                          dataSaved?.document_upload.filter(
                                            (x) => x.name == document
                                          )[0]?.url_link,
                                      }}
                                      name={
                                        document
                                          .toLowerCase()
                                          .split("/")
                                          .join("-")
                                          .split(" ")
                                          .join("-") +
                                        "-" +
                                        session.user.ID
                                      }
                                    />
                                  )}
                                </li>
                              ))}
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            {documentForUpload
                              .slice(documentForUpload.length / 2)
                              .map((document) => (
                                <li>
                                  <Typography
                                    variant="body1"
                                    color="initial"
                                    mr={5}
                                  >
                                    {document}
                                  </Typography>
                                  {dataSaved?.document_upload
                                    .filter((x) => x.name == document)
                                    .map((item) => (
                                      <a
                                        href={item.url_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ marginLeft: "1rem" }}
                                      >
                                        {item.filename}
                                      </a>
                                    ))}
                                  {session.user.role_id === 2 && (
                                    <Upload
                                      onUploadSuccess={(data) =>
                                        documentUpload(
                                          data,
                                          document,
                                          document
                                            .toLowerCase()
                                            .split("/")
                                            .join("-")
                                            .split(" ")
                                            .join("-") +
                                            "-" +
                                            session.user.ID
                                        )
                                      }
                                      attach={{
                                        image_url:
                                          dataSaved?.document_upload.filter(
                                            (x) => x.name == document
                                          )[0]?.url_link,
                                      }}
                                      name={
                                        document
                                          .toLowerCase()
                                          .split("/")
                                          .join("-")
                                          .split(" ")
                                          .join("-") +
                                        "-" +
                                        session.user.ID
                                      }
                                    />
                                  )}
                                </li>
                              ))}
                            <li>
                              <TextField
                                size="small"
                                onChange={(e) =>
                                  setOtherDocument(e.target.value)
                                }
                                // onBlur={onBlur}
                                value={otherDocument}
                                label="Other"
                                sx={{
                                  margin: ".25rem 0",
                                  width: "100%",
                                  maxWidth: "600px",
                                }}
                              />
                              {dataSaved?.document_upload
                                .filter((x) => x.name == otherDocument)
                                .map((item) => (
                                  <a
                                    href={item.url_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginLeft: "1rem" }}
                                  >
                                    {item.filename}
                                  </a>
                                ))}
                              {otherDocument.length > 0 &&
                                session.user.role_id == 2 && (
                                  <Upload
                                    onUploadSuccess={(data) =>
                                      documentUpload(
                                        data,
                                        otherDocument,
                                        `${otherDocument.toLowerCase()}-` +
                                          session.user.ID
                                      )
                                    }
                                    // attach={item}
                                    attach={{
                                      image_url:
                                        dataSaved?.document_upload.filter(
                                          function (x) {
                                            return this.indexOf(x.name) >= 0;
                                          },
                                          documentForUpload
                                        )[0]?.url_link,
                                    }}
                                    name={
                                      `${otherDocument.toLowerCase()}-` +
                                      session.user.ID
                                    }
                                  />
                                )}
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
                      {/* <ol>
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
																dataSaved?.document_upload.filter(x => x.name == 'IELTS-TOEFL-Pearson Academic Results').map(item => (
																<a href={item.url_link} target="_blank" rel="noopener noreferrer" style={{ marginLeft : '1rem'}}>{item.filename}</a>
																))
															}
															<Upload onUploadSuccess={(data) => documentUpload(data, 'IELTS-TOEFL-Pearson Academic Results', `english-test-` + session.user.ID)} 
																// attach={item} 
																name={`english-test-` + session.user.ID}
															/>
															</li>
													</Grid>
													<Grid
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
															<Upload onUploadSuccess={(data) => documentUpload(data, 'Publication', `publication-` + session.user.ID)} 
																// attach={item} 
																name={`publication-` + session.user.ID}
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
																name={`${otherDocument.toLowerCase()}-` + session.user.ID}
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
													</Grid>
												</Grid>
														</ol> */}
                    </Stack>
                  </TabPanel>
                </TabContext>
              </LocalizationProvider>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

function ControllerTextField({ control, name, CustomComponent, label, rules }) {
  return (
    <Controller
      control={control}
      rules={{
        required: rules?.required,
        validate: rules?.validate,
      }}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <>
          {CustomComponent ? (
            <CustomComponent
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={ref}
              label={
                name
                  ? name
                      .split("_")
                      .map((x) => capitalize(x))
                      .join(" ")
                  : ""
              }
            />
          ) : (
            <TextField
              size="small"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={ref}
              label={
                label ||
                (name
                  ? name
                      .split("_")
                      .map((x) => capitalize(x))
                      .join(" ")
                  : "")
              }
              sx={{
                margin: ".25rem 0",
                width: "100%",
                maxWidth: "600px",
              }}
            />
          )}
        </>
      )}
    />
  );
}
