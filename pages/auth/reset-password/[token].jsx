import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'



export default function ResetPasswordToken() {
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
					height : '100vh',
				}}
				
			>
				<Grid item
					sx={{
							maxWidth : '400px',
							width : '100%',
							height : '50vh',
							margin : '20px',
							'&.MuiGrid-item' : {
								paddingLeft : 0,
								paddingTop : 0,
							}
					}}
				>
					<Card 
						sx={{
							backgroundColor : '#aaa',
							width : '100%',
							height : '100%',
						}}
					>

					</Card>
				</Grid>	
			</Grid>
		</>
	)
}
