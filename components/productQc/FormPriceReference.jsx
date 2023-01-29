import { Card, Modal } from "@mui/material";
import React from "react";

import capitalize from "../../utils/capitalize";

import FormMaster from "../form";

export default function FormPriceReference(props) {
	const { id, method } = props
  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            px: 2,
            py: 5,
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "60%",
          }}
        >
					<FormMaster
								title={`${capitalize(method)} Price Reference`}
								titlePage={`${capitalize(method)} Price Reference`}
								submitUrl="/api/product/qc"
								createUrl="/api/product/qc"
								id={id}
								name= "qc"
								// getUrlForm= "user/create"
								isCollection= {false}
								isGetField={true && method === "create"}
								column={
									{
										price_reference: {
											value: "",
											type: "number",
										},
									} 
								}
								method={props.method}
								onClose={props.handleClose}
							/>
        </Card>
      </Modal>
    </>
  );
}
