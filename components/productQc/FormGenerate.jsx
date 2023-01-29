import { Box, Button, Card, CircularProgress, Modal, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

import capitalize from "../../utils/capitalize";

import FormMaster from "../form";

var formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function FormGenerate(props) {
	const { id, method } = props
	const [generate, setGenerate] = useState(null)
	const [updateColumn, setUpdateColumn] = useState(false)

	useEffect(() => {
		if(!generate && id)
			getGeneratedPrice()
		
		async function getGeneratedPrice() {
			try {
				const { data } = await axios.get('/api/calculate/' + id)
				setGenerate(data)
			} catch (error) {
				if(error.response)
					alert(error.response.data)
				else
					alert(error)	
			}	
		}
	},[generate, id])

  return (
    <>
      <Modal open={props.open} onClose={(x) => { props.handleClose(x); setGenerate(null); setUpdateColumn(false)}}>
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
            width: "60%",
          }}
        >
					<Typography variant="subtitle2" noWrap py={2}>
						<Box sx={{ position: 'relative', display: 'inline-flex' }}>
							<CircularProgress variant="determinate" value={generate?.qc_score} size={60} />
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
								<Typography variant="title" component="div" color="text" sx={{ fontSize : '1.2em' }}>
									{`${Math.round(generate?.qc_score??0)}%`}
								</Typography>
							</Box>
						</Box>
					</Typography>
					{
						generate?.qc_price &&
						<>
					<Typography variant="subtitle1" noWrap py={2}>
						QC Price : {formatter.format(generate?.qc_price)}
					</Typography>
					<Button variant="contained" onClick={() => setUpdateColumn(true)} sx={{ maxWidth : 300, margin : ' 0 auto 2em', }}>
						Update Score and Price
					</Button>
						</>
					}
					<FormMaster
								title={`${capitalize(method)} Price Reference`}
								titlePage={`${capitalize(method)} Price Reference`}
								submitUrl="/api/product/qc"
								createUrl="/api/product/qc"
								id={id}
								name= "qc"
								// getUrlForm= "user/create"
								isCollection= {false}
								isGetField={true && method === "create"}
								column={
									{
										qc_score: {
											value: "",
											type: "number",
										},
										qc_price: {
											value: "",
											type: "number",
										},
									} 
								}
								method={props.method}
								onClose={props.handleClose}
								isSubmitDisable={!generate}
								updateColumnValue={ updateColumn && generate && {
									qc_score : generate.qc_score,
									qc_price : generate.qc_price,
								}}
							/>
        </Card>
      </Modal>
    </>
  );
}
