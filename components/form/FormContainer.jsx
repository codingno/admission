import React from "react";
import FormParent from "./FormParent";
import { FormControl, OutlinedInput, TextField, FormHelperText } from "@mui/material";

export default function FormContainer(props) {
  return (
    <FormParent>
      <FormControl sx={{ 
        width: "100%" 
        }} variant="outlined">
        <TextField
					inputProps={{
						autoComplete: 'new-password',
						form: {
							autoComplete: 'off',
						},
					}}
					// inputRef={props.ref}
          size="small"
          label={props.label}
          name={props.name}
          type={props.type}
          value={props.value}
          // onChange={(e) => props.setValue(e.target.value)}
          onChange={props.onChange}
					InputLabelProps={{ shrink: true }}
          // sx={{
          //   background: "#E0E0E0",
          // }}
        />
        {props.helper && <FormHelperText>{props.helper}</FormHelperText>}
      </FormControl>
    </FormParent>
  );
}