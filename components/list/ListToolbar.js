import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  // height: 96,
  display: 'flex',
  // justifyContent: 'space-between',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  // '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, refresh, toolbarName, additionalToolbar }) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder={`Search ${toolbarName}...`}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}
			
			{additionalToolbar || ''}		

      {numSelected > 0 ? (
        <Tooltip title="Hapus">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
				// <div>
        //   <IconButton>
				// 		<RefreshIcon onClick={refresh} sx={{ marginLeft : 0}} />
        //   </IconButton>
        // <Tooltip title="Filter list">
        //   <IconButton>
        //     <Icon icon={roundFilterList} />
        //   </IconButton>
        // </Tooltip>
				// </div>
				<></>
      )}
    </RootStyle>
  );
}
