import React, { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'

import FormLayout from './FormLayout'
import FormParent from './FormParent'

import Upload from '../../pages/upload'
import Typography from '@mui/material/Typography'
import capitalize from '../../utils/capitalize'

import axios from 'axios'

const imageNames = [
	'belakang',
	'depan',
	'bawah',
	'atas',
	'kanan',
	'kiri',
	'bawah-kanan',
	'bawah-kiri',
	'atas-kanan',
	'atas-kiri',
]

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function FormQcImage({title, titlePage, prodId, productQc, refresh }) {

	const [attachments, setAttachments] = useState(imageNames.map(item => ({ image_name : item, product_qc_id : prodId, image_url : null})))
	const prevQcImages = usePrevious(productQc.product_qc_image)

	useEffect(() => {
		// if(productQc.product_qc_image.length > 0) {
		if(productQc.product_qc_image.length > 0 && productQc.product_qc_image !== prevQcImages) {
			let temps = [...attachments]
			productQc.product_qc_image.map(item => {
				const attach = attachments.map(x => x.image_name ).indexOf(item.image_name)
				if(attach > -1) {
					temps[attach] = {
						...attachments[attach],
						id : item.id,
						image_url : item.image_url.split('https://dtq2i388ejbah.cloudfront.net/')[1],
					}
				}
			})

			setAttachments(temps)
		}
		return () => {
			// setAttachments(imageNames.map(item => ({ image_name : item, product_qc_id : prodId, image_url : null})))
			setAttachments([])
		}
	},[productQc.product_qc_image])
	// },[attachments, productQc.product_qc_image])

	async function onSubmit() {
		
	}

	async function onUploadSuccess(data, item) {
		try {
			await axios.post('/api/product/qc-image', [{ ...item, image_url : data }])
			refresh()
		} catch (error) {
			
		}
	}

	const ListForm = ({start, end, attach, onUploadSuccess}) => {
		return (
					<Grid item  sx={{ width : '100%'}}>
				{
					attach.slice(start,end).map((item, idx) => 
					<Stack
						key={idx}
						direction="row"
						justifyContent="flex-start"
						alignItems="center"
						my={2}
						sx={{
							border : 'solid thin black',
							borderRadius : '10px',
							padding : '0 3rem',
						}}
					>
						<Typography variant="body1" color="initial" px={2} width="100%" textAlign="left">{capitalize(item.image_name.replaceAll('-',' '))}</Typography>
						<Upload onUploadSuccess={(data) => onUploadSuccess(data, item)} 
							attach={item} 
							/>
					</Stack>
				)
				}
						</Grid>	
		)
	}

	return (
    <FormLayout title={title} titlePage={titlePage}>
      <form onSubmit={onSubmit}>
				<Grid
					container
					spacing={2}
					direction="row"
					justifyContent="space-around"
					alignItems="flex-start"
					// alignContent="stretch"
					wrap="wrap"
					sx={{
						width : '100%',
					}}	
				>
					{/* <ListForm start={0} end={5} attach={attachments} onUploadSuccess={onUploadSuccess}/>
					<ListForm start={5}  attach={attachments} onUploadSuccess={onUploadSuccess}/> */}
					<ListForm start={0} end={10} attach={attachments} onUploadSuccess={onUploadSuccess}/>
					{/* <Grid item >
				{
					attachments.slice(0,5).map((item, idx) => 
					<Stack
						key={idx}
						direction="row"
						justifyContent="flex-start"
						alignItems="center"
						my={2}
					>
						<Typography variant="body1" color="initial" px={2} width={150} textAlign="left">{capitalize(item.image_name.replaceAll('-',' '))}</Typography>
						<Upload onUploadSuccess={(data) => onUploadSuccess(data, item)} 
							attach={item} 
							/>
					</Stack>
				)
				}
						</Grid>	 */}
					{/* <Grid item >
				{
					attachments.slice(5).map((item, idx) => 
					<Stack
						key={idx}
						direction="row"
						justifyContent="flex-start"
						alignItems="center"
						my={2}
					>
						<Typography variant="body1" color="initial" px={2} width={150} textAlign="left">{capitalize(item.image_name.replaceAll('-',' '))}</Typography>
						<Upload onUploadSuccess={(data) => onUploadSuccess(data, item)} 
							attach={item} 
						/>
					</Stack>
				)
				}
						</Grid>	 */}
				</Grid>
			</form>
		</FormLayout>
	)
}

export default FormQcImage