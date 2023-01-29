import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import plusFill from "@iconify/icons-eva/plus-fill";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  Divider,
  Grid,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
} from "@mui/material";
// import Scrollbar from "./Scrollbar";
import SearchNotFound from "./SearchNotFound";
import CategoryListHead from "./CategoryListHead";
// import TopMenu from "./TopMenu";
import MoreMenu from "./MoreMenu";
import ListToolbar from "./ListToolbar";

import axios from "axios";
import { useSession } from "next-auth/react";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function getObjectValue(source, objects) {
	const object = objects[0]
	if(objects.length > 1)
		return getObjectValue(source[object], objects.slice(1))
	return source[object]
}

function applySortFilter(array, comparator, query, filterObject) {
	// const filterObject = 'seller.fullname'
	// const filterObject = ['seller','fullname']
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
		const queryLowerCase = query.toLowerCase()
		const isExist = (x) => x ? x.toLowerCase().indexOf(queryLowerCase) !== -1 : false
    return filter(
      array,
      (_user) => 
			// !filterObject ? isExist(_user.name) : isExist(getObjectValue(_user, filterObject))
			{
				return !filterObject ? isExist(_user.name) : 
					!Array.isArray(filterObject[0]) ?
					isExist(getObjectValue(_user, filterObject)) :
					filterObject.map(x => isExist(getObjectValue(_user, x))).filter(x => x)[0]
				// return false
				// return _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
			}
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

export default function List(props) {
  const { title, name, tableHead, getUrl, addLink, addModal, moremenu, deleteOptions, isUserList, readOnly, disableAdd, reload, setReload, filterObject, additionalToolbar } =
    props;

  const router = useRouter();
	const { data : session, status : statusSession } = useSession()

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage || 50);

  const [isLoading, setLoading] = useState(false);

  const [dataList, setDataList] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  useEffect(() => {
    if (dataList.length == 0 || reload) getDataList();
  }, [reload]);

  async function getDataList() {
    try {
			setLoading(true)
      const { data, error } = await axios.get(getUrl);
			if(data.data)
      	setDataList(data.data);
			else
      	setDataList(data);
				if(setReload)
        	setReload(false)
			setLoading(false)
    } catch (error) {
      if (error.response) {
        if ((error.response.status = 404)) return;
      }
      alert(error);
			if(setReload)
      	setReload(false)
			setLoading(false)
    }
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataList.length) : 0;

  // const filteredUsers = courseList ? applySortFilter(courseList, getComparator(order, orderBy), filterName) : [];
  const filteredUsers =
    dataList.length > 0
      ? applySortFilter(dataList, getComparator(order, orderBy), filterName, filterObject)
      : [];
  const isUserNotFound = filteredUsers.length === 0;

	if(statusSession === 'loading')
		return ""

  return (
    <>
      <Grid item xs={12} p={1}>
        <Card
					sx={{
						// maxHeight : `calc(100vh + ${-120 + (emptyRows * 47) + 52}px)`,
					}}
				>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={5}
						pb={1}
          >
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
						{
							(((!readOnly && !disableAdd) || session.user.isAdmin) && addLink ) &&
            <Button
              variant="contained"
              onClick={() => addModal ? addModal() : router.push(addLink)}
              startIcon={<Icon icon={plusFill} />}
            >
              Add {name}
            </Button>
						}
          </Stack>
          <Divider />

          <ListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            toolbarName={name}
						additionalToolbar={additionalToolbar}
						
            // refresh={() => dispatch({type : 'refresh_start'})}
          />

          {/* <Scrollbar> */}
            {isLoading ? (
              <div
                style={{
                  margin: "auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <TableContainer
              // sx={{ minWidth: 800 }}
							sx={{ 
								// minWidth: 800,
								maxHeight : '100vh',
								// overflowX : "initial",
								// position : "relative",
							}}
              >
                <Table size="small"
									stickyHeader
									aria-label="sticky table"	
								>
                  <CategoryListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHead}
                    rowCount={dataList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((initialRow, indexRow) => {
                        const {
                          id,
                          name,
                          shortname,
                          code,
                          category_code,
                          position,
                          status,
                          image_url,
                          user_enrollment,
                          createdBy,
                        } = initialRow;
                        const isItemSelected = selected.indexOf(id) !== -1;
												let row = JSON.parse(JSON.stringify(initialRow))

                        delete row.id;
                        const tableHeadId = tableHead.map((item) => item.id);
                        Object.keys(row).map((item, id) => {
                          const tableHeadIndex =  tableHeadId.indexOf(item)           
                          if (tableHeadIndex < 0) {
														if(isUserList && item == 'user')
															row.name = row.user.name
														delete row[item];
													}
                          if(row[item] && tableHead[tableHeadIndex].key_value) {
														// const key_value = 
                            row[item] = 
															Array.isArray(tableHead[tableHeadIndex].key_value) ?
															getObjectValue(row[[tableHeadIndex].key || item][0] || row[[tableHeadIndex].key || item],tableHead[tableHeadIndex].key_value) :
															row[item][tableHead[tableHeadIndex].key_value]
														console.log(row[item])
													}
                          if(row[item] && row[item].name)
                            row[item] = row[item].name
                          if(typeof row[item] === 'boolean')
                            row[item] = row[item] ? 'True' : 'False'
                        });
												// const arrayRow = Object.keys(row)
												let arrayRow = []
												Object.keys(row).map(item => arrayRow[tableHeadId.indexOf(item)] = item)
												const lisCustomComponent = tableHeadId.filter((x, idx) => Object.keys(row).indexOf(x) < 0 && !!tableHead[idx].CustomComponent)
												// lisCustomComponent.map(item => arrayRow[tableHeadId.indexOf(item)] = tableHead[tableHeadId.indexOf(item)].CustomComponent(initialRow))
												lisCustomComponent.map(item => arrayRow[tableHeadId.indexOf(item)] = item)
												// if(isUserList) {
												// 	arrayRow.unshift(arrayRow[arrayRow.length - 1])
												// 	arrayRow.pop()
												// }
                        const columCell = arrayRow.map(
                          (item, index) => {
														let render = row[item]
														if(tableHead[index].type == 'boolean') {
															render = <Button
																variant="contained"
																color={ render ? 'success' : 'error'}
																size="small"
																disabled={render == null}	
															>
															{(!render ? render == null ? 'Pending' : 'Not ' : '') + (render == null ? '' : tableHead[index].label)}	
															</Button>
															return (
																<TableCell align="center" key={index} sx={{ maxWidth : 100}}>
																	<Stack
																		direction="row"
																		alignItems="center"
																		justifyContent="center"
																		spacing={1}
																		onClick={() => tableHead[index].onClick ? tableHead[index].onClick(initialRow) : null}
																		sx={tableHead[index].sx}
																	>
																		<Typography variant="subtitle2" noWrap>
																			{/* {row[item]} */}
																			{render}
																		</Typography>
																	</Stack>
																</TableCell>
															)
														}
														if(tableHead[index].type == 'Date' && render) {
															const options = { year: 'numeric', month: 'long', day: 'numeric', hour : 'numeric', minute : 'numeric', hour12 : false };
															render = new Date(row[item]).toLocaleString('default', options)
														}
														else if(tableHead[index].type == 'Time' && render) {
															render = new Date(row[item]).toTimeString().split('GMT')[0]
														}
														else if(tableHead[index].type == 'float' && render) {
															render = row[item].toFixed(2)
														}
														else if(tableHead[index].link === true)
															render = <a href={router.basePath + row[item]} target="_blank" rel="noreferrer">link</a>
														else if(!!tableHead[index].CustomComponent) {
															render = tableHead[index].CustomComponent(initialRow)
															return (
																<TableCell align="left" key={index} sx={{ maxWidth : 100}}
																		onClick={() => tableHead[index].onClick ? tableHead[index].onClick(initialRow) : null}
																>
																	{/* <Stack
																		direction="row"
																		alignItems={tableHead[index].center || 'center'}
																		justifyContent="center"
																		spacing={1}
																		onClick={() => tableHead[index].onClick ? tableHead[index].onClick(initialRow) : null}
																		sx={tableHead[index].sx}
																	> */}
																			{/* {row[item]} */}
																			{render}
																	{/* </Stack> */}
																</TableCell>
															);
														}
                            return (
                              <TableCell align="left" key={index} sx={{ maxWidth : 100}}>
                                <Stack
                                  direction="row"
                                  // alignItems="left"
            											justifyContent={tableHead[index].alignRight ? 'flex-end' :  (tableHead[index].center || 'flex-start')}
                                  spacing={1}
																		onClick={() => tableHead[index].onClick ? tableHead[index].onClick(initialRow) : null}
																		sx={tableHead[index].sx}
                                >
                                  {/* <Typography variant="subtitle2" noWrap> */}
                                  <Typography variant="subtitle2" >
                                    {/* {row[item]} */}
																		{render}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          }
                        );
                        // if(user.role_id == 1 || user_enrollment.split(',').indexOf(user.id) >= 0 || createdBy == user.id)
                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                            sx={{
                              bgcolor: indexRow % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
                            }}
                          >
                            {/* <TableCell padding="checkbox" key="uniqueKey1">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, id)}
                              />
                            </TableCell> */}
                            {columCell}
                            {/* <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
																{name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{status || "None"}</TableCell> */}
                            {
                              <TableCell align="right"
																sx={{
																	position : 'sticky',
																	right : 0,
																	zIndex : 999,
                              		bgcolor: indexRow % 2 > 0 ? "#F4F4F4" : "#E9E9E9",
																}}
															>
																{
																	((!readOnly || session.user.isAdmin) && (moremenu.length > 0 || deleteOptions)) &&
																	<MoreMenu
																		id={id}
																		name={name}
																		moremenu={moremenu}
																		deleteOptions={deleteOptions}
																	/>
																}
                              </TableCell>
                            }
                          </TableRow>
                        );
                      })}
                    {/* {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )} */}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            )}
          {/* </Scrollbar> */}

          <TablePagination
            // rowsPerPageOptions={[5, 10, 25]}
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={dataList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Item per page"
          />
        </Card>
      </Grid>
    </>
  );
}
