import React from 'react'
import { Stack } from '@mui/material';

export default function FormParent(props) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        // ml={5}
        mt={2}
        sx={{
          width: props.width || "100%",
          // ml: props.marginLeft || "5%",
          display: "flex",
          justifyContent: props.justifyContent || "flex-start",
					...props.sx,
        }}
      >
        {/* <span style={{ width: "35%" }}>{props.label}</span> */}
        {props.children}
      </Stack>
    );
}