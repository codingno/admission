import { Card, Modal, Stack, TextField, Typography, FormControl, InputLabel, Select, MenuItem, } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from "react";
import axios from "axios";

import capitalize from "../../utils/capitalize";
import alertError from "../../utils/alertError";

import FormMaster from "../form";

export default function FormPriceReferenceSub(props) {
	const { id, method, data } = props

	const [newData, setNewData] = useState(null)
	const [masterFormulaOptions, setMasterFormulaOptions] = useState([])

	useEffect(() => {
		setNewData(data)
	}, [data])
	

	useEffect(() => {
		getMasterFormula()

		async function getMasterFormula() {
			try {
				const response = await axios.get('/api/master/pricing-formula')
				if(response.data)
					if(response.data.length > 0)
						setMasterFormulaOptions(response.data)
			} catch (error) {
				alertError(error)	
			}	
		}
	}, [])
	
	async function submitPrice(e) {
		e.preventDefault()
		try {
			await axios.post('/api/product/specification-sub-list', newData)
			alert("Data berhasil disimpan.")	
			props.handleClose(newData)
		} catch (error) {
			alertError(error)	
		}	
	}

	if(!data)
		return ""

  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            px: 5,
            py: 5,
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "60%",
						maxWidth: "600px",
          }}
        >
          <Typography variant="h4" >{data.name}</Typography>
					<Stack
						sx={{ 
							mt : 3 ,
						}}
					>
						{
							newData &&
						<form onSubmit={submitPrice} style={{ display : 'flex', flexDirection : 'column', alignItems : 'center', }}>
					<Stack
						maxWidth={400}
						minHeight={300}
						justifyContent="space-around"
					>
						<FormControl
								sx={{
									minWidth : 150,
									width : '100%',
									// mx : 3,
								}}
						>
							<InputLabel id="labelGroup">Golongan</InputLabel>
							<Select 
							 	labelId="labelGolongan"
								label="Golongan"
								displayEmpty
								value={newData.master_pricing_formula_id} 
								onChange={e => setNewData(prev => ({...prev, master_pricing_formula_id : e.target.value }))}
								>
									<MenuItem value="">none</MenuItem>
								{masterFormulaOptions.length > 0 && masterFormulaOptions.map((y, idy) => 
									<MenuItem value={y.id} key={idy}>{y.group_name}</MenuItem>
								)}
							</Select>
						</FormControl>
						<TextField 
							label="Harga Rilis"
							value={newData.cross_price}
							// onChange={(e) => console.log(e.target.value)}
							onChange={e => setNewData((prev) => ({...prev, cross_price : e.target.value }))}
						/>
						<TextField 
							label="Harga Referensi"
							value={newData.price_reference}
							// onChange={(e) => console.log(e.target.value)}
							onChange={e => setNewData((prev) => ({...prev, price_reference : e.target.value }))}
						/>
					</Stack>
						<Stack 
						sx={{ 
							mt : 3 ,
							// ml: "25%", 
							width: "50%", 
							}}
							>
							<LoadingButton type="submit" variant="contained" 
							// loading={loading}
							loading={false}
							// disabled={props.disableSubmit}
							// sx={{
								// ...submitStyleButton, 
								// visibility : !props.disableSubmit? 'visible' : 'hidden',
									// }} 
									id="submit" 
									// ref={loadingButtonRef}
									>
									Simpan Harga
							</LoadingButton>
						</Stack>
						</form>
						}

					</Stack>
					{/* <FormMaster
								title={`${capitalize(method == 'create' ? 'tambah' : 'ubah')} Harga Referensi ${data?.name}`}
								titlePage={`Harga Referensi ${data?.name}`}
								submitUrl="/api/product/specification-sub"
								createUrl="/api/product/qc"
								id={id}
								name= "qc"
								// getUrlForm= "user/create"
								isCollection= {false}
								isGetField={true && method === "create"}
								label={{
									price_reference : ''
								}}
								column={
									{
										price_reference: {
											value: "",
											type: "number",
										},
									} 
								}
								method={props.method}
								onClose={props.handleClose}
							/> */}
        </Card>
      </Modal>
    </>
  );
}
