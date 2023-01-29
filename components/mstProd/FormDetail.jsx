import { Card, Modal } from "@mui/material";
import React from "react";

import FormMaster from "../form";

export default function FormDetail (props) {
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
            title="Add Master Product"
            titlePage="Add Master Product"
            submitUrl="/api/product/specification-detail"
            multipleUrl="/api/master/specification"
            multipleChoice={true}
            getDataUrl={`/api/product/specification-detail?product_specification_id=${props.prodId}`}
            prodId={props.prodId}
            // formProps={{
            name="master_specification"
            getUrlForm="specification_detail"
            column={{
              master_specification_id: {
                value: null,
                type: "reference",
              },
              product_specification_id: {
                id: true,
                value: null,
                type: "reference",
              },
              option_value: {
                value: null,
                type: "value",
              },
              highlight: {
                value: null,
                type: "reference",
              },
              position: {
                value: null,
                type: "reference",
              },
              status: {
                value: null,
                type: "reference",
              },
            }}
            isCollection={true}
            // }}
            method={props.method}
            onClose={props.handleClose}
          />
        </Card>
      </Modal>
    </>
  );
}
