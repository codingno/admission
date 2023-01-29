import { Card, Modal } from "@mui/material";
import React from "react";

import FormMaster from "../../components/form";

export default function Form(props) {
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
						maxWidth : "800px",
          }}
        >
          <FormMaster
            title="Spesifikasi Model"
            titlePage="Spesifikasi Model"
            submitUrl="/api/product/specification"
            // subCatUrl="/api/category/sub"
            // catUrl="/api/category"
            id={props.id}
            // formProps={{
            name="product_specification"
            getUrlForm="product_specification"
            label={{
              category_id: "Kategori",
              sub_category_id: "Merek",
              product_type: "Nama Model",
              // price_reference: "Price Reference",
            }}
            column={{
              category_id: {
                value: process.env.NEXT_PUBLIC_DEFAULT_CATEGORY,
                url: "/api/category",
                type: "select",
                child: "sub_category_id",
              },
              sub_category_id: {
                value: null,
                url: "/api/category/sub",
                type: "select",
                parent: "category_id",
              },
              product_type: {
                value: null,
              },
              // price_reference: {
              //   value: null,
              // },
            }}
            isGetField={props.method == 'create' && true}
            // isCollection={false}
            // }}
            method={props.method}
            onClose={props.handleClose}
          />
        </Card>
      </Modal>
    </>
  );
}
