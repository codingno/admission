import { Card, Modal } from "@mui/material";
import React from "react";

import FormMaster from "../../components/form";

export default function PriceRef(props) {
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
            width: "60%"
        }}>
          <FormMaster
            title="Price Reference"
            titlePage="Price Reference"
            submitUrl="/api/product/specification"
            id={props.id}
            formProps={{
              name: "product_specification",
              getUrlForm: "product_specification",
              column: {
                product_type: null,
                price_reference: null
              },
              isCollection: false
            }}
            method={props.method}
            onClose={props.handleClose}
          />
        </Card>
      </Modal>
    </>
  );
}
