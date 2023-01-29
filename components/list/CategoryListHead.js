import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------

CategoryListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func
};

export default function CategoryListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead
			// sx={{
				// bgcolor : 'rgba(0, 171, 85, 0.08)',
				// color : '#fff',
			// }}
			// bgcolor="primary"
			color="primary"
		>
      <TableRow
			// bgcolor="primary"
			// color="white"
			color="primary"
				sx={{
					bgcolor : '#003B5C',
					color : '#fff',
				}}
			>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell> */}
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' :  (headCell.center || 'left')}
            sortDirection={orderBy === headCell.id ? order : false}
						sx={{ backgroundColor : '#003B5C', zIndex : 99,  }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
							// bgcolor="primary"
							// color="white"
							sx={{
								// color : '#00AB55',
            		justifyContent : (headCell.center || 'flex-start'),
								color : '#FFF',
								'&.Mui-active' : {
									color : '#FFE16A',
								},
								...headCell.sx || {}
							}}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
				<TableCell
					sx={{
						position : 'sticky',
						right : 0,
						zIndex : 999,
						// bgcolor: indexRow % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
						bgcolor : '#003B5C',
					}}
				>

				</TableCell>
      </TableRow>
    </TableHead>
  );
}
