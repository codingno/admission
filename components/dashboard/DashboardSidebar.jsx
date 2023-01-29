import PropTypes from 'prop-types';
import { useEffect } from 'react';
// import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router'
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
// components
// import Logo from '../../components/Logo';
// import Scrollbar from '../../components/Scrollbar';
import NavSection from '../NavSection';
import MHidden from '../MHidden';
//
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';

import { useSession } from "next-auth/react"
import Image from 'next/image';


// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  // const { pathname } = useLocation();
  const router = useRouter()
  const { data } = useSession()

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const renderContent = (
    // <Scrollbar
    //   sx={{
    //     height: '100%',
    //     '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
    //   }}
    // >
    <>
      {/* <Box sx={{ my: 5, mx: 2.5 }}>
        <Link underline="none" to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {data && data.user.fullname}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {data && data.user.employee_code}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box> */}

      <Box 
			// sx={{ my: 5, mx: 2.5 }}
			>
				<Image src="/head-logo.jpg" alt="login-logo" 
						// width={640}
						// height={319}
						width={300}
						height={168.75}
						onClick={() => router.push('/')}
						// layout='fill'
				/>
      </Box>

      {/* <NavSection navConfig={sidebarConfig} /> */}
      {/* <NavSection navConfig={router.asPath.split('/')[1] === "admission" && router.asPath.split('/')[2]?.includes("form") ? sidebarConfig : data?.user.ROLE_ID === 1 ? [
  {
    title: "Admission List",
    path: "/admission/list",
    icon: getIcon(peopleFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Verification List",
    path: "/verification/list",
    icon: getIcon(checkmarkSquare2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
			] :  []} /> */}

			<NavSection navConfig=
			{
				data?.user.ROLE_ID === 1 ?
				[
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: getIcon(pieChart2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Admission List",
    path: "/admission/list",
    icon: getIcon(peopleFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Verification and Desk Review",
    path: "/verification/list",
    icon: getIcon(checkmarkSquare2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
			] :
				data?.user.ROLE_ID === 3 ?
				[
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: getIcon(pieChart2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Student Interview",
    path: "/verification/list",
    icon: getIcon(checkmarkSquare2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
			] :
			data && router.asPath.split('/')[1] === "admission" && router.asPath.split('/')[2]?.includes("form") ?
			sidebarConfig : []
			} />


      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            // bgcolor: 'grey.200'
          }}
        >
          {/* <Box
            component="img"
            src="/static/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          /> */}
          <Box sx={{ textAlign: 'center' }}>
            {/* <Typography gutterBottom variant="h6">
							Scholarship UIII
            </Typography> */}
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              @{new Date().getFullYear()}
            </Typography> */}
          </Box>
          {/* <Button
            fullWidth
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button> */}
        </Stack>
      </Box>
      </>
    // </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: '#003b5c',
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
