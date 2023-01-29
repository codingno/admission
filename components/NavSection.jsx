import { useState, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
// import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { useRouter } from "next/router";
import Link from "next/link";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
// material
import { alpha, useTheme, styled } from "@mui/material/styles";
import {
  Box,
  List,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// ----------------------------------------------------------------------

const ListItemStyle = styled(forwardRef(function ForWardRef(props, ref) { return (
  <ListItemButton disableGutters {...props} ref={ref}/>
)}))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  // color: theme.palette.text.secondary,
  color: theme.palette.warning.light,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
};

function NavItem({ item, active }) {
  const router = useRouter();
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    // color: "primary.main",
    color: "#fff",
    fontWeight: "fontWeightMedium",
    // bgcolor: alpha(
    //   theme.palette.primary.main,
    //   theme.palette.action.selectedOpacity
    // ),
    bgcolor: alpha(
      theme.palette.background.default,
      theme.palette.action.selectedOpacity
    ),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "text.primary",
    fontWeight: "fontWeightMedium",
  };


  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path, icon } = item;
              const isActiveSub = active(path);
              return (
                <Link key={title} href={path} passHref >
                  <ListItemStyle
                    // key={title}
                    component="a"
                    sx={{
                      ...(isActiveSub && activeSubStyle),
                    }}
                  >
                    {/* <ListItemIconStyle>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: "flex",
                          borderRadius: "50%",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "text.disabled",
                          transition: (theme) =>
                            theme.transitions.create("transform"),
                          ...(isActiveSub && {
                            transform: "scale(2)",
                            bgcolor: "primary.main",
                          }),
                        }}
                      />
                    </ListItemIconStyle> */}
                    <ListItemIconStyle sx={{ ml: 1 }}>
                      {icon && icon}
                    </ListItemIconStyle>
                    <ListItemText disableTypography primary={title} />
                  </ListItemStyle>
                </Link>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <Link href={path} key={title} passHref >
      <ListItemStyle
        component="a"
        // to={path}
        // key={title}
        sx={{
          ...(isActiveRoot && activeRootStyle),
        }}
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
        <ListItemText disableTypography primary={title} />
        {/* {info && info} */}
      </ListItemStyle>
    </Link>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, ...other }) {
  // const { pathname } = useLocation();
  const [userRole, setUserRole] = useState('')
  const router = useRouter();
  const { data, status } = useSession();
  
  useEffect(() => {
    if(data){
      // console.log(status);
      setUserRole(data.user.employee_role_id);
    }
  }, [data])

  const specModel = navConfig.filter(item => { 
    return Array.isArray(item.role) ? item.role.indexOf(userRole) >= 0 : item.role == userRole
  })
  
  // const match = (path) => (path ? !!matchPath({ path, end: false }, router.pathname) : false);
  const match = (path) => path === router.pathname || path === router.asPath;

  return (
    <>
      {/* <Box {...other}>
        <List disablePadding>
          {specModel.map((item) => (
              <NavItem key={item.title} item={item} active={match} />
            ))}
        </List>
      </Box> */}
      <Box {...other}>
        <List disablePadding>
          {
            (specModel.length > 0)
            ?
            specModel.map((item) => (
              <NavItem key={item.title} item={item} active={match} />
            ))
            :
            navConfig.map((item) => (
              <NavItem key={item.title} item={item} active={match} />
            ))
          }
        </List>
      </Box>
      {/* <Box {...other}>
        <List disablePadding>
          {navConfig.map((item) => (
            <NavItem key={item.title} item={item} active={match} />
          ))}
        </List>
      </Box> */}
    </>
  );
}