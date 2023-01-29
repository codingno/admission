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
            title="Detail Product Specification-Sub"
            titlePage="Detail Product Specification-Sub"
            submitUrl="/api/product/specification-sub-detail"
            // multipleUrl="/api/product/specification-detail"
            getDataUrl={`/api/product/specification-sub-detail?product_specification_sub_id=${props.prodId}`}
            multipleUrl={`/api/product/specification-detail?status=1&product_specification_id=${props.specId}`}
            prodId={props.prodId}
            subId={props.specId}
            labelSub="master_specification"
            labelName="name"
            // formProps={{
            name="product_specification_detail"
            getUrlForm="specification_sub_detail"
            multipleChoice={false}
            column={{
              product_specification_sub_id: {
                id: true,
                value: null,
                type: "reference",
              },
              product_specification_detail_id: {
                // id: true,
                value: null,
                type: "reference",
              },
              value: {
                value: null,
                type: "value",
              },
              highlight: {
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
