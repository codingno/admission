import { motion } from 'framer-motion';
// import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
// import Page from '../components/Page';

// ----------------------------------------------------------------------

// const RootStyle = styled(Page)(({ theme }) => ({
//   display: 'flex',
//   minHeight: '100%',
//   alignItems: 'center',
//   paddingTop: theme.spacing(15),
//   paddingBottom: theme.spacing(10)
// }));

// ----------------------------------------------------------------------

export default function Custom404() {
  return (
    // <RootStyle title="404 Page Not Found">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', mt:20, textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/illustration_404.svg"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>

            <Button href="/" size="large" variant="contained">
              Go to Home
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    // </RootStyle>
  );
}
