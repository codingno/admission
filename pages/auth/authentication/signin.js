// import { Link } from 'react-router-dom';
import { useRouter } from 'next/router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
// import Logo from '../ui-component/Logo';
// import AuthFooter from '../ui-component/cards/AuthFooter';
// import styles from './background.module.css'
// assets
import Image from 'next/image'


// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
		const router = useRouter()
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }} className="auth-bg">
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item 
												sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}
												>
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
                                <Grid container 
																spacing={1} 
																alignItems="center" justifyContent="center">
                                    {/* <Grid item sx={{ mb: 3 }}> */}
                                        {/* <Link to="#">
                                            <Logo />
                                        </Link> */}
                                    {/* </Grid> */}
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    {/* <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        // variant={matchDownSM ? 'h3' : 'h2'}
                                                        variant={'h5'}
                                                    >
																											Universitas Islam International Indonesia
                                                    </Typography> */}
                                                    {/* <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography> */}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AuthLogin />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
																		{
																			process.env.NEXT_PUBLIC_ENABLE_REGISTER == "true" &&
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                // component={Link}
																								onClick={() => router.push('/auth/authentication/signup')}
                                                // to="/pages/register/register3"
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none', cursor : 'pointer', }}
                                            >
                                                Don&apos;t have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid>
																		}
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

export default Login;
