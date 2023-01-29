// import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
// import Logo from '../ui-component/Logo';
import AuthRegister from '../auth-forms/AuthRegister';
// import AuthFooter from '../ui-component/cards/AuthFooter';
// import styles from './background.module.css'

// assets
import Image from 'next/image'

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
		const router = useRouter()
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

		useEffect(() => {
			if(router && process.env.NEXT_PUBLIC_ENABLE_REGISTER == "false")
				router.push('/auth/authentication/signin')
		}, [router])
		

		if(process.env.NEXT_PUBLIC_ENABLE_REGISTER == "false") {
			return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }} className="auth-bg">
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid> */}
            </Grid>
        </AuthWrapper1>
			)
		}


    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }} className="auth-bg">
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
															<Grid
																container
																// spacing={1}
																direction="row"
																justifyContent="center"
																alignItems="center"
																alignContent="center"
																wrap="wrap"
																
															>
																<Grid item
																	xs={12}
																>
																	<Stack alignItems="center" justifyContent="center">
																				<Typography
																						// color={theme.palette.secondary.main}
																						color="primary"
																						gutterBottom
																						// variant={matchDownSM ? 'h3' : 'h2'}
																						variant={'h4'}
																				>
																					Student Admission System
																				</Typography>
																	</Stack>
																</Grid>
																<Grid item
																	xs={5}
																>
																	<Stack alignItems="center" justifyContent="center" spacing={1}>
																				<div className="login-white-uiii">
																					<Image src="/blue-uiii.png" alt="login-logo" 
																							// width={640}
																							// height={319}
																							width={350}
																							height={174.45}
																							// layout='fill'
																					/>
																				</div>
																	</Stack>
																</Grid>
																<Grid item
																xs={1}
																>
																	<div className="login-line"></div>
																</Grid>
																<Grid item
																	xs={6}
																>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    {/* <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid> */}
                                    <Grid item xs={12}>
                                        <AuthRegister />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                // component={Link}
                                                to="/pages/login/login3"
                                                variant="subtitle1"
																								onClick={() => router.push('/auth/authentication/signin')}
                                                // to="/pages/register/register3"
                                                sx={{ textDecoration: 'none', cursor : 'pointer', }}
                                            >
                                                Already have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
															</Grid>
														</Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid> */}
            </Grid>
        </AuthWrapper1>
    );
};

export default Register;
