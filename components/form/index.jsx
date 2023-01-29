
import React, { useState, useEffect, useRef } from "react";
import {
	Button,
	CircularProgress,
  Stack,
  Select,
  FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Modal,
  MenuItem,
  InputLabel,
  TextField,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { MultiSelectUnstyled } from "@mui/base/SelectUnstyled";

import FormContainer from "./FormContainer";
import FormLayout from "./FormLayout";
import FormParent from "./FormParent";

import axios from "axios";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import capitalize from "../../utils/capitalize";
const filter = createFilterOptions();

function splitOptions(string) {
	let result = []
    const split = string.split(', ')
    split.map(item => result = [...result, ...item.split(',')])
  	return result
}

function SelectOptions({ field, item, label, multipleChoice }) {
	if(!multipleChoice)
		return (
    <FormControl
			key={item.id}
      sx={{
        width: "100%",
        my: 3,
      }}
    >
			<FormLabel id="demo-row-radio-buttons-group-label" sx={{ textAlign : 'left', color : 'black', }}>{label}  :</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
				sx={{
					display : 'flex',
					justifyContent : 'left',
				}}
        defaultValue={item.value || (multipleChoice ? [] : '')}
        {...field}
				value={field.value}
				onChange={field.onChange}
      >
        {/* {item.option_value.split(",").map((x, idx) => { */}
        {splitOptions(item.option_value).map((x, idx) => {
					const menuValue = item.option_number? splitOptions(item.option_number)[idx] : x
					// if(menuValue == field.value)
					// 	console.log("ini : ", field.value, menuValue)
          return (
						<Button key={x} variant="contained" sx={{ margin : '1em'}} color={menuValue == field.value ? 'secondary' : 'primary'}
								endIcon={menuValue == field.value && <CheckIcon />}
						>
        			<FormControlLabel 
								// value={item.option_number? item.option_number.split(",")[idx] : x} 
								value={menuValue}
								control={<Radio sx={{ display : 'none'}} />} label={x} 
							sx={{
								margin : 0,
							}} 
							/>
						</Button>
          );
        })}
      </RadioGroup>
		</FormControl>
		)
  return (
    <FormControl
      sx={{
        width: "100%",
        my: 1,
      }}
    >
      {/* <InputLabel id={item.id}>
        {label}
      </InputLabel>
      <Select
        size="small"
        sx={{
          textAlign: "left",
        }}
        // displayEmpty
        // label={item.label || item.name}
        label={label}
        labelId={item.name}
        multiple={multipleChoice != false ? true : false}
        // multiple
        defaultValue={item.value || (multipleChoice ? [] : '')}
        // value={item.value || (multipleChoice ? [] : '')}
        // value={item.value ?? []}
        {...field}
      >
				<MenuItem
					key={1}
					value=""
				>
				Tidak ada
				</MenuItem>
        {splitOptions(item.option_value).map((x, idx) => {
					const menuValue = item.option_number? splitOptions(item.option_number)[idx] : x
          return (
            <MenuItem key={x} value={item.option_number? splitOptions(item.option_number)[idx] : x}>
              {x}
            </MenuItem>
          );
        })}
      </Select> */}
       <Autocomplete
        key={item.id}
        size="small"
        options={
          item.option_value? item.option_value.split(",") : []
        }
        // autoHighlight
        value={
          item.option_value[item.name]
            ? item.option_value[item.name].filter(
                (data) => data.id == field.value || data === field.value
              )[0]
            : multipleChoice && !field.value
            ? []
            : field.value
        }
        getOptionLabel={(option1) => {
          // let selected = item.option_value[item.name] ? item.option_value[item.name].filter(
          //   (data) => data.id === option1 || data === option1
          // ) : [];
          return option1[item.option_name || "name"] || (typeof(option1) == 'number' ? option1.toString() : option1);
          // return option1
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          console.log({options, params, filtered});
  
          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option);
          if (inputValue !== '' && !isExisting) {
            filtered.push(
              inputValue
             );
          }
  
          return filtered;
        }}
        // getOptionSelected={(option, data) => {
        //   console.log({ value, option });
        //   return option.id === value || option === value;
        // }}
        // renderOption={(option, data) => {
        //   console.log({ option, data });
        //   return (
        //     <React.Fragment>
        //       <span>{option[item.option_name || 'name'] || option}</span>
        //     </React.Fragment>
        //   );
        // }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            item={item.id}
            fullWidth
            inputProps={{
              ...params.inputProps,
              // autoComplete: "disabled", // disable autocomplete and autofill
            }}
          />
        )}
        multiple={
          multipleChoice != false && multipleChoice != undefined ? true : false
        }
        // multiple
        onChange={(event, data) => {
          data =
            data && data.id
              ? data.id
              : multipleChoice
              ? data.map((dt) => dt.id || dt)
              : data;
          field.onChange(data);
        }}
				isOptionEqualToValue={(option, value) => option === value || option.id === value.id || option.id === value}
        defaultValue={multipleChoice ? [] : ""}
        // {...field}
      />
    </FormControl>
  );
}


export default function FormMaster(props) {
  const {
    title,
    titlePage,
    submitUrl,
    createUrl,
    multipleUrl,
    catUrl,
    subCatUrl,
    method,
    id,
    onClose,
    onOpen,
    prodId,
    subId,
    isCollection,
    column,
    isGetField,
    labelSub,
    labelName,
    multipleChoice,
		name,
		submitStyle,
		submitStyleButton,
		submitText,
		updateColumnValue,
		sx,
		defaultNewForm,
  } = props;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({});
  // const { replace } = useFieldArray({ control });
  const router = useRouter();
  // const { id } = router.query;
  const { data: session, status } = useSession();
  // const [values, setValues] = React.useState({});
  const [setForm, setSetForm] = React.useState([]);
  const [newForm, setNewForm] = React.useState([]);
  const [optionForm, setOptionForm] = React.useState([]);
  const [optionCat, setOptionCat] = React.useState({});
  const [optionWatch, setOptionWatch] = React.useState({});
	const [reload, setReload] = React.useState(false)

	const [loading, setLoading] = useState(true)

  let watchAllFields = {};

  if (setForm.length >= 0) watchAllFields = watch();

	const loadingButtonRef = useRef(null)
	
	useEffect(() => {
		if(props.onSubmit)
			submit()
		
		async function submit() {
			await loadingButtonRef	
			if(loadingButtonRef.current)
				loadingButtonRef.current.click()
			// const submitButton = document.getElementById('submit')
		}
	},[props.onSubmit])

	React.useEffect(() => {
		if(watchAllFields.product_specification_sub_id) {
			if(optionCat.product_specification_sub_id) {
				const data = optionCat.product_specification_sub_id.filter(x => x.id == watchAllFields.product_specification_sub_id)[0].price_reference
				setValue('price_reference', data)
			}
		}
	}, [watchAllFields.product_specification_sub_id])

  React.useEffect(() => {
		if(updateColumnValue)
			Object.keys(updateColumnValue).map(item => { setValue(item, updateColumnValue[item]); })
	},[setValue, updateColumnValue])

  React.useEffect(() => {
    async function getField() {
      try {
        const { data } = await axios.get(`${submitUrl}?column_field=true`);
        if (data) {
          setNewForm(data);
					// setLoading(false)
					setTimeout(() => {
						setLoading(false)
					}
					,1000)
        }
      } catch (error){
        }
    }

    async function getData() {
      try {
        const { data } = await axios.get(`${submitUrl}?id=${id}`);
        if (data && data.length > 0) {
          setNewForm(data);
					// setLoading(false)
					setTimeout(() => {
						setLoading(false)
					}
					,1000)
        }
      } catch (error) {}
    }

		async function getDataProdId() {
			try {
				const { data } = await axios.get(props.getDataUrl)
				// const { data } = subId
					// ? await axios.get(`${submitUrl}?product_specification_sub_id=${prodId}`)
					// : await axios.get(`${submitUrl}?product_specification_id=${prodId}`);
				if (data && data.length > 0) {
					setNewForm(data);
					data.map(item => {
						if (labelSub) {
							if(item.name)
								setValue( item.name, 
									splitOptions(item.value) || ""
								)
							else if(item[name])
								setValue(
									item[name][labelSub][labelName || "name"],
									splitOptions(item.value) || ""
								);
							else {
								setValue(
									item[labelSub][labelName || "name"],
									splitOptions(item.value) || ""
								);
							}
						}
						else if (item[name].name) {
							if (subId) {
								setValue(item[name].name, item.criteria_value == null ? 'null' : splitOptions(item.criteria_value.toString()) || splitOptions(item.value) || "");
							} else {
								setValue(
									item[name].name,
									splitOptions(item.option_value) || ""
								);
							}
						}
					});
				}

				else if(newForm.length > 0)
					newForm.map(item => {
						const formName = labelSub ? 
							item.name ? 
							item.name : 
							item[name] ? 
							item[name][labelSub][labelName || "name"] : 
							item[labelSub][labelName || "name"] :
							item[name].name 
						setValue(formName, multipleChoice ? [] : "")
					})
				// setLoading(false)
				setTimeout(() => {
					setLoading(false)
				}
				,1000)
			} catch (error) {}
		}

    if (id && !multipleUrl) {
    // if (id) {
      getData();
    }
    if (isGetField) getField();

    if (prodId) {
      getDataProdId();
    }
		setReload(false)
  }, [id, isGetField, labelName, labelSub, name, prodId, setValue, subId, submitUrl, reload]);


  // React.useEffect(() => {
  //   // if (id) getData();
  //   if (prodId && multipleUrl)
  //     if (optionForm.length > 0) getDataProdId();
  //     else getDataProdId();
  // }, [optionForm]);

  React.useEffect(() => {
    if (column) setOptionField();
    async function setOptionField() {
      let option = {};
      let columnArray = Object.keys(column);
      for await (const x of columnArray) {
        const id = columnArray.indexOf(x);
        if (column[x].url) {
          if (column[x].parent) {
            let parentValue = column[column[x].parent].value;
            if (newForm[0])
              if (newForm[0][column[x].parent])
                parentValue = newForm[0][column[x].parent];
						// if(parentValue)
						// 	setValue(column[x].parent, parentValue)
            const data = await getDatabyUrl(
              x,
              column[x].url,
              column[x].parent,
              watchAllFields[column[x].parent] || parentValue
            );
            option[x] = data;
          } else {
            const data = await getDatabyUrl(x, column[x].url);
            option[x] = data;
          }
        } else if (column[x].option_data) option[x] = column[x].option_data;
        if (id == Object.keys(column).length - 1) setOptionCat(option);
      }
    }

    async function getDatabyUrl(name, url, parent, value) {
      try {
        const { data } = parent && value
          ? await axios.get(url + "?" + parent + "=" + value)
          : await axios.get(url);
        return data;
      } catch (error) {
        return [];
      }
    }
  }, [column, newForm, optionWatch]);

  React.useEffect(() => {
    if (multipleUrl) getDataMultiple();
		async function getDataMultiple() {
			let dataApi;
			try {

				if(!defaultNewForm) {
					const { data } = await axios.get(Array.isArray(multipleUrl) ? multipleUrl[0] : multipleUrl)
					dataApi = data

					if(Array.isArray(multipleUrl) && data.length == 0) {
						let iterable = [...multipleUrl]
						iterable.shift()
						for await (const url of iterable) {
							const { data } = await axios.get(url)
							dataApi = data

						}
					}

				} else {
					dataApi = defaultNewForm
				}
				// const { data } = !subId
				// 	? await axios.get(`${multipleUrl}`)
				// 	: await axios.get(`${multipleUrl}?product_specification_id=${subId}`);
				if (dataApi.length > 0) {
					setOptionForm(dataApi);
					if (!id) {
						let forms = [];
						dataApi.map((x) => {
							let form = {};
							Object.keys(column).filter(z => !column[z].no_display).map((item) => {
								const exist_id = newForm.filter(y => y[name].id == x.id)[0]
								form = {
									...form,
									[item]:
										item == name + "_id"
											? x.id
											: column[item].id
											? prodId
											: column[item].value || x[item] || null,
								};
								if(exist_id)
									form.id = exist_id.id
							});
							forms.push(form);
						});
						if(newForm !== forms) {
							setNewForm(forms);
							setTimeout(() => {
								setLoading(false)
							}
							,1000)
							setReload(false)
						}
					}
				}
			} catch (error) {}
		}
		// setReload(false)
  }, [multipleUrl, reload, loading, newForm]);
  // }, [multipleUrl, subId, column, id, prodId, name, newForm]);

  let newOptionWatch = optionWatch;
  let count = 0;
  column &&
    Object.keys(column).filter(x => !column[x].no_display).map((x, idx) => {
      if (column[x].parent) {
        if (!optionWatch[column[x].parent]) {
          if (watchAllFields[column[x].parent]) {
            newOptionWatch = {
              ...newOptionWatch,
              [column[x].parent]:
                watchAllFields[column[x].parent] ||
                watch(column[x].parent) ||
                "",
            };
            count++;
          }
        } else if (
          optionWatch[column[x].parent] != watchAllFields[column[x].parent]
        ) {
          newOptionWatch = {
            ...newOptionWatch,
            [column[x].parent]: watchAllFields[column[x].parent],
          };
          count++;
        }
      }
      if (idx == Object.keys(column).filter(x => !column[x].no_display).length - 1 && count > 0) {
        setOptionWatch(newOptionWatch);
      }
    });

  const setLabel = (x) => {
    return x
      .split("_id")[0]
      .split("_")
      .map((x) => capitalize(x))
      .join(" ");
  };

  React.useEffect(() => {
    function setNewFormData() {
      const newSetForm =
        props && isCollection
          ? newForm.length !== 0
            ? newForm.map((item) => {
                let detailform = {
                  id: item.id,
                  name: !item[props.name] ? item.name : item[props.name].name,
                  type:
                    item.option_value && item.option_value !== null
                      ? "select"
                      : "text",
                };
                if (item.option_value && item.option_value !== null) {
                  detailform.value = splitOptions(item.option_value);
                }
                if (optionForm && optionForm.length > 0) {
                  const optionFormValue = optionForm.filter(
                    (x) => x.id == item.master_specification_id
                  );
                  detailform.option_value = optionFormValue[0]
                    ? splitOptions(optionFormValue[0].option_value)
                    : [""];
                }
                return detailform;
              })
            : optionForm.length === 0
            ? []
            : optionForm.map((item, id) => ({
                id,
                name: item.name,
                option_value: splitOptions(item.option_value),
                type: "select",
              }))
          : newForm.length !== 0 && column
          ? Object.keys(newForm[0])
              // .filter((item) => item !== "id" && typeof newForm[0][item] !== 'object')
              .filter((item) => item !== "id" && column[item]).filter(x => !column[x].no_display)
              .map((item, id) => {
                if (typeof newForm[0][item] === "boolean") {
                  setValue(item, newForm[0][item] ? 1 : 0);
                } else if (column[item].type === "select") {
									// if(optionCat[item] && optionCat[item].map(x => x.id).indexOf(newForm[0][item]) >= 0) {
										setValue(
											item,
											watchAllFields[item] || newForm[0][item] || ""
										);
									// }
									// else setValue(item, "")
                } else {
                  setValue(
                    item,
                    watchAllFields[item] || newForm[0][item] || ""
                  );
								}
                return {
                  id,
                  name: item,
                  type: column
                    ? column[item].type
                    : item == "password"
                    ? item
                    : "text",
                  option_name: column ? column[item].name : null,
                  option_value: optionCat,
									disable : column[item].disable??false,
                };
              })
          // : props.colum
          // ? Object.keys(column).map((item, id) => ({
          //     id,
          //     name: item,
          //     type: "text",
          //     label: props.label ? props.label[item] : "",
          //   }))
          : newForm.length !== 0
          ? Object.keys(newForm[0])
              .filter((item) => item !== "id")
              .map((item, id) => {
                if (newForm[0][item]) {
                  setValue(
                    item,
                    watchAllFields[item] || newForm[0][item] || ""
                  );
								}

                return {
                  id,
                  name: item,
                  type: column
                    ? column[item].type
                    : item == "password"
                    ? item
                    : "text",
                  option_name: column ? column[item].name : null,
                  option_value: optionCat,
                };
              })
          : column
          ? Object.keys(column).filter(x => !column[x].no_display).map((item, id) => ({
              id,
              name: item,
              type: "text",
              label: props.label ? props.label[item] : "",
            }))
          : [];

			let sortNewSetForm = []
			if(!props.label)
						sortNewSetForm = newSetForm
			else {
				let tempNewSetForm = [...newSetForm]
				Object.keys(props.label).map(x => {
					let found = false
					tempNewSetForm = tempNewSetForm.filter(y => {
						if(!found && x == y.name) {
							sortNewSetForm.push(y)
							found = true
							return false
						}
						return true
					})	
				})
			}
      return setSetForm(sortNewSetForm);
    }
    // if(setForm.length == 0)
    setNewFormData();
  }, [newForm, optionForm, optionCat]);

  const onSubmit = async (data) => {
	// if(!multipleChoice && Array.isArray(data))
	await newForm
	await optionForm
    const sendData = isCollection
      ? newForm.map((item) => {
          const value = optionForm.filter((opt) => {
            return item[props.name + "_id"] == opt.id || item[props.labelSub + "_id"] == opt.id;
          })[0];
					if(!value) {
					// 	return router.reload()
						setReload(true)
						return
					}
          let detail =
            data[
              labelSub
								? value[labelSub]
                ? value[labelSub][labelName || "name"]
                : value[labelName || "name"]
                : value[labelName || "name"]
            ];

          let result = {};
          Object.keys(item).map((y) => {
            if (item[y] || y === props.labelSub + "_id" || column[y].type == "value") {
							if(y === props.labelSub + "_id") result[y] = value.id;
              else if (y === props.getUrlForm + "_id") result[y] = item.id;
              else
                result[y] =
                  column[y] != undefined
                    ? column[y].value ||
                      (item[y] !== undefined && column[y].type !== "value"
                        ? item[y]
                        : Array.isArray(detail)
                        ? detail.toString()
                        : detail)
                    : item[y];
              return y;
            }
          });
					if(result[props.labelSub + "_id"])
						result[props.name + "_id"] = null
          return result;
        })
      : data;

		// return;
		if(props.onSubmit && props.submitForm)
				props.submitForm(sendData)
		else if(props.onSubmit) 
    	submitForm(sendData);
		else 
		// if(confirm("Are you sure to update this data?"))
    	submitForm(sendData);
  };

  async function submitForm(values) {
    let result;
    try {
      if (method == "edit" && !isCollection) {
				let no_display = {}
				Object.keys(column).filter(x => column[x].no_display).map(x => {
					no_display = { ...no_display, [x] : newForm[0][x]}
				})
        const data = await axios.patch(submitUrl, {
          id,
					...no_display,
          ...values,
        });
      } else if (method == "edit" && isCollection) {
				let prepareSubmit = values.filter(x => !x ? false : x.criteria_value !== '').map(x => ({ ...x, criteria_value : x.criteria_value == 'null' ? null : x.criteria_value }))
				// console.log(newForm)
				// console.log(setForm)
				// return alert("sek we")
				if(prepareSubmit.length > 0) {
        	const { data } = await axios.post(submitUrl, prepareSubmit);

					result = data
				}
      } else {
        const { data } = await axios.post(
          createUrl || submitUrl,
          isCollection
            ? values
            : [
                {
                  ...values,
                },
              ]
        );
				result = data
      }
			if(!props.onSubmit) 
      	alert(`Data sudah ${method == "edit" ? "diperbarui" : "ditambahkan"}`);
      onClose ? onClose(result || true) : router.back();
			reset();
			if(!props.onSubmit) {
				setReload(true)
				setLoading(true)
			}
    } catch (error) {
			if(error.response)
				return alert(error.response.data)
			else 
				return alert(error);
    }
  }

  React.useEffect(() => {
    if (!session && status == `unauthenticated`) router.push("/auth/authentication/signin");
    // if (!session && status == `unauthenticated`) router.push("/auth/signin");
  }, [router, session, status]);
  if (status === "loading" || status === "unauthenticated") return "";


  if (setForm.length == 0) {
    return "";
  }
  return (
    <FormLayout title={title} titlePage={titlePage} sx={sx??{}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!multipleUrl
          ? setForm[0].option_value !== {} &&
            setForm.map((item) => {
              const label = setLabel(props.label ? props.label[item.name] : ( item.label || item.name));
              if (item.type === "select") {
                if (!item.option_value) return "";
                return (
                  <Controller
                    name={item.name}
                    control={control}
                    key={item.id}
                    defaultValue={item.value}
                    render={({ field: {onChange, value} }) => {
                      return (
											<FormParent>
                        <FormControl
                          sx={{
                            width: "100%",
                            my: 1,
                          }}
                        >
                          {/* <InputLabel id={item.id}>{label}</InputLabel>
                          <Select
                            size="small"
                            sx={{
                              textAlign: "left",
                            }}
                            // displayEmpty
                            label={label}
                            labelId={item.name}
                            // defaultValue={item.value}
        										defaultValue={item.value || (multipleChoice ? [] : '')}
        										// value={item.value || (multipleChoice ? [] : '')}
                            // value={item.value ?? []}
                            {...field}
                          >
														<MenuItem
															key={1}
															value=""
														>
														Tidak ada
														</MenuItem>
                            {item.option_value[item.name] &&
                              item.option_value[item.name].map((x) => {
                                return (
                                  <MenuItem
                                    key={x.id || x}
                                    value={typeof x === "object" ? x.id : x}
                                  >
                                    {x[item.option_name || "name"] || x}
                                  </MenuItem>
                                );
                              })}
                          </Select> */}
                           <Autocomplete
                            size="small"
                            options={
                              item.option_value[item.name]
                                ? item.option_value[item.name]
                                : []
                            }
                            // autoHighlight
                            value={
                              item.option_value[item.name]
                                ? item.option_value[item.name].filter(
                                    (data) => data.id == value || data === value
                                  )[0]
                                : value
                            }
                            getOptionLabel={(option1) => {
                              // return (
                              //   option1[item.option_name || "name"] || option1
                              // );
          										return option1[item.option_name || "name"] || (typeof(option1) == 'number' ? option1.toString() : option1);
                              // return option1
                            }}
                            // getOptionSelected={(option, data) => {
                            //   return option.id === value || option === value;
                            // }}
                            // renderOption={(option, data) => {
                            //   console.log({ option, data });
                            //   return (
                            //     <React.Fragment>
                            //       <span>{option[item.option_name || 'name'] || option}</span>
                            //     </React.Fragment>
                            //   );
                            // }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={label}
                                item={item.id}
                                fullWidth
                                inputProps={{
                                  ...params.inputProps,
                                  // autoComplete: "disabled", // disable autocomplete and autofill
                                }}
                              />
                            )}
                            multiple={
                              multipleChoice != false &&
                              multipleChoice != undefined
                                ? true
                                : false
                            }
                            // multiple
                            onChange={(event, item) => {
                              item =
                                item && item.id
                                  ? item.id
                                  : multipleChoice
                                  ? item.map((data) => data.id || data)
                                  : item;
                              onChange(item);
                            }}
                            defaultValue={multipleChoice ? [] : ""}
                            // {...field}
                          />
                        </FormControl>
											</FormParent>
                      );
                    }}
                  />
                );
              }

              return (
                <Controller
                  key={item.id}
                  name={item.name}
                  control={control}
                  // defaultValue={[]}
                  render={({ field: { ref, ...rest } }) => {
                    return (
                      <FormContainer
                        // label={item.label || item.name}
                        label={label}
                        type={item.type}
                        // onChange={onChange}
                        {...rest}
                      />
                    );
                  }}
                />
              );
            })
          : optionForm.map((item) => {
              const label = setLabel(
                labelSub
									? item[labelSub]
                  ? item[labelSub][labelName || "name"]
                  : item.label || item[labelName || "name"]
                  : item.label || item[labelName || "name"]
              );
              if (item.option_value) {
                if (!item.option_value) return "";
                setForm.map((x) => {
                  x.name == item.name ? (item.value = x.value) : "";
                });
                return (
                  <Controller
                    name={
                      labelSub
												? item[labelSub]
                        ? item[labelSub][labelName || "name"]
                        : item.label || item[labelName || "name"]
                        : item.label || item[labelName || "name"]
                    }
                    control={control}
                    // key={
                    //   labelSub
                    //     ? item[labelSub][labelName || "name"]
                    //     : item.label || item[labelName || "name"]
                    // }
										key={item.id}
                    defaultValue={item.value || []}
                    // render={({ field }) => {
                    //   return (
                    //     <FormControl
                    //       sx={{
                    //         width: "90%",
                    //         my: 1,
                    //       }}
                    //     >
                    //       <InputLabel id={item.id}>
                    //         {/* {item.label || item.name} */}
                    //         {label}
                    //       </InputLabel>
                    //       <Select
                    //         size="small"
                    //         sx={{
                    //           textAlign: "left",
                    //         }}
                    //         displayEmpty
                    //         // label={item.label || item.name}
                    //         label={label}
                    //         labelId={item.name}
                    //         multiple={multipleChoice != false ? true : false}
                    //         // multiple
                    //         defaultValue={item.value || []}
                    //         // value={item.value ?? []}
                    //         {...field}
                    //       >
                    //         {item.option_value.split(",").map((x) => {
                    //           return (
                    //             <MenuItem key={x} value={x}>
                    //               {x}
                    //             </MenuItem>
                    //           );
                    //         })}
                    //       </Select>
                    //     </FormControl>
                    //   );
                    // }}
										render={({field}) => 
											<FormParent>
												<SelectOptions field={field} item={item} multipleChoice={multipleChoice} label={label}/>
											</FormParent>
									}
                  />
                );
              }

              return (
                <Controller
                  key={item.id}
                  name={item.name}
                  control={control}
                  // defaultValue={[]}
                  render={({ field: { ref, ...rest } }) => {
                    return (
                      <FormContainer
                        // label={item.label || item.name}
                        label={label}
                        // onChange={onChange}
                        {...rest}
                      />
                    );
                  }}
                />
              );
            })}
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <p>This field is required</p>}
					 
        <Stack sx={{ 
					mt : !props.disableSubmit? 3 : 0,
					ml: "25%", width: "50%", ...submitStyle }}>
          <LoadingButton type="submit" variant="contained" 
					loading={loading}
					// disabled={props.disableSubmit}
					 sx={{...submitStyleButton, 
					 	visibility : !props.disableSubmit? 'visible' : 'hidden',
						  }} id="submit" ref={loadingButtonRef}>
						{
							submitText || 'Simpan'
						}
          </LoadingButton>
        </Stack>
      </form>
      {/* <Modal open={loading} onClose={() => setLoading(false)} sx={{ display : 'flex'}}>
				<CircularProgress sx={{ margin : "auto", }} /> 
			</Modal> */}
    </FormLayout>
  );
}