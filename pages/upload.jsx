import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Image from 'next/image';

import { Card, Input, Button, Grid, Modal, CircularProgress, Typography, Box, Stack } from '@mui/material';
// import Input from '@mui/material/Input'
// import Button from '@mui/material/Button'
// import Grid from '@mui/material/Grid'
// import Modal from '@mui/material/Modal'
// import CircularProgress from '@mui/material/CircularProgress'
import FormParent from '../components/form/FormParent';

const imageLoader = ({ src, width, quality }) => {
  return `https://dtq2i388ejbah.cloudfront.net/${src}?w=${width}&q=${quality || 75}`
}

function NoImage() {
	return <Image loader={imageLoader} src="no_image.png" alt="no_image.png" layout="fill" priority/>
}

export default function Upload(props) {
	const [attachment, setAttachment] = useState(props.attach?.name??"")
	const [attachmentName, setAttachmentName] = useState(props.attach?.image_url ?? "")
	const [openModal, setOpenModal] = useState(false)
	const [progress, setProgress] = useState(0)
	const [progressStatus, setProgressStatus] = useState("Uploading...")
	const submitRef = useRef(null)

	useEffect(() => {
		if(progress == 100) {
			setProgressStatus("Success")
			alert("success")
			setTimeout(() => setProgress(0), 3000)
		}
	},[progress])

	const uploadImage = async (courseImage) => new Promise((resolve, reject) => {
    if (courseImage === "") return null;

    const formData = new FormData();

		formData.append('name', props.name);
    formData.append('uploads', courseImage);
    // try {
			const config = {
					// onUploadProgress: progressEvent => console.log(progressEvent)
					onUploadProgress: (progressEvent) => {
						const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
						console.log("onUploadProgress", totalLength);
						if (totalLength !== null) {
								const uploadProgress = Math.round( (progressEvent.loaded * 100) / totalLength )
								setProgress(uploadProgress);
						}
					},
			}
      // const file = await 
			axios.post("/api/upload", formData, config)
			.then(file => resolve(file))
			.catch(error => {
				reject(error)
      	alert(error);
			});
			// return resolve(file)
    // } catch (error) {
			// return reject(error)
    // }
  });

	const uploadFormHandle = async e => {
		try {
			await submitRef;
			if (e.target.files[0] && submitRef) {
				if (confirm("Are you sure to upload this file?")) {
					const file = e.target.files[0];
					// const file = e.target.files;
					setAttachment(file);
					// setAttachmentName(Array.from(file).map(x => x.name))
					setAttachmentName(file.name)
					const data = await submitRef.current.click();
					// submit()
					// setCourseImage(file)
				}
			}
		} catch (error) {
			alert(error);
		}
	}

	const submit = () => new Promise(async (resolve, reject) => {
		setOpenModal(true)
		try {
			const { data } = await uploadImage(attachment)	
			if(props.onUploadSuccess)
				props.onUploadSuccess(data)
			// const splitSlash = data.split('/')
			// const uploadedName = splitSlash[splitSlash.length - 1]
			// setAttachmentName(uploadedName)
			return resolve(data)
		} catch (error) {
			return reject(error)
		}
	})

	return (

					<Stack
						direction="row"
						justifyContent="flex-start"
						alignItems="flex-start"
						alignContent="flex-start"
						sx={{
							alignContent : "flex-start",
							alignItems : "flex-start",
						}}
					>
						<FormParent sx={{ margin : 0, marginRight : 2, width : 'auto', 
						minHeight : 100, 
						flexDirection : 'column',
							alignItems : "flex-start",
						}}>
								<Box>
								{/* <Box sx={{
									width : 150,
									height : 150,
									position : 'relative',
									margin : 2,
								}}>
									{
										attachmentName.length > 0 ?
										<Image loader={imageLoader} src={attachmentName} alt={attachmentName} 
											width={150}
											height={150}
											// layout="fill" 
											objectFit='cover' 
											/>
										:
										<NoImage />
									}
									<Image loader={imageLoader} src="https://dtq2i388ejbah.cloudfront.net/no_image.png" alt={attachmentName.length > 0 ? attachmentName : ''} />
									<image src={attachmentName.length > 0 ? attachmentName : ''} alt={attachmentName.length > 0 ? attachmentName : ''}/>
								</Box> */}
						{/* {
							!Array.isArray(attachmentName) &&	attachmentName.length > 0 &&
							<Typography variant="body1" color="secondary" pr={2} maxWidth={200} >{attachmentName}</Typography>
						}
						{
							Array.isArray(attachmentName) &&	attachmentName.length > 0 &&
							attachmentName.map(x =>
								<Typography variant="body1" color="secondary" pr={2} >{x}</Typography>
							)
						} */}
								</Box>
							<label >
								<Input
									id="contained-button-file"
									inputProps={{
										multiple : true,
									}}
									type="file"
									sx={{ display: "none" }}
									onChange={uploadFormHandle}
								/>
								<Button variant="contained" component="span" sx={{ whiteSpace : "nowrap",
							marginTop : '1rem',
							}}>
									Upload Files
								</Button>
							</label>
						</FormParent>
						<Input variant="text" color="primary" onClick={submit} type="hidden" ref={submitRef}>
							upload	
						</Input>
						{
							progress > 0 &&
							<>
								<Box sx={{ position: 'relative', display: 'inline-flex' }}>
									<CircularProgress variant="determinate" value={progress} />
									<Box
										sx={{
											top: 0,
											left: 0,
											bottom: 0,
											right: 0,
											position: 'absolute',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Typography variant="caption" component="div" color="text.secondary">
											{`${Math.round(progress)}%`}
										</Typography>
									</Box>
								</Box>
								<Typography variant="body1" color="primary" pl={1}>{progressStatus}</Typography>
							</>
						}
					</Stack>
	)

	return (
		<>
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
				<Grid item>
					<Stack
						direction="row"
						justifyContent="center"
						alignItems="center"
						alignContent="center"
					>
						{
							attachmentName.length > 0 &&
							<Typography variant="body1" color="secondary" pr={2}>{attachmentName}</Typography>
						}
						<FormParent sx={{ margin : 0, marginRight : 1, }}>
							<label >
								<Input
									id="contained-button-file"
									// multiple
									type="file"
									sx={{ display: "none" }}
									onChange={uploadFormHandle}
								/>
								<Button variant="contained" component="span" sx={{ whiteSpace : "nowrap"}}>
									Unggah Data
								</Button>
							</label>
						</FormParent>
						<Input variant="text" color="primary" onClick={submit} type="hidden" ref={submitRef}>
							upload	
						</Input>
						{
							progress > 0 &&
							<>
								<Box sx={{ position: 'relative', display: 'inline-flex' }}>
									<CircularProgress variant="determinate" value={progress} />
									<Box
										sx={{
											top: 0,
											left: 0,
											bottom: 0,
											right: 0,
											position: 'absolute',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Typography variant="caption" component="div" color="text.secondary">
											{`${Math.round(progress)}%`}
										</Typography>
									</Box>
								</Box>
								<Typography variant="body1" color="primary" pl={1}>{progressStatus}</Typography>
							</>
						}
					</Stack>
				</Grid>
			</Grid>
      <Modal open={false} onClose={() => { setOpenModal(false); setProgress(0); setProgressStatus("Uploading...")}}>
				<Card 
					sx={{
							display: "flex",
							flexDirection: "column",
							px: 2,
							py: 5,
							position: "absolute",
							top: "45%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							textAlign: "center",
							width: "200px",
							height: "200px",
							justifyContent: "center",
							alignItems: "center",
					}}>
					<Box sx={{ position: 'relative', display: 'inline-flex' }}>
						<CircularProgress variant="determinate" value={progress} />
						<Box
							sx={{
								top: 0,
								left: 0,
								bottom: 0,
								right: 0,
								position: 'absolute',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Typography variant="caption" component="div" color="text.secondary">
								{`${Math.round(progress)}%`}
							</Typography>
						</Box>
					</Box>
						<Typography variant="body1" color="primary">{progressStatus}</Typography>
				</Card>
			</Modal>
		</>
	)
}
