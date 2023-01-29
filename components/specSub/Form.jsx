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
            title="Detail Spesifikasi Model"
            titlePage="Detail Spesifikasi Model"
            submitUrl="/api/product/specification-sub"
            id={props.id}
            name="product_specification_sub"
            getUrlForm="product_specification_sub"
            label={{
              product_specification_id: "Model",
              sub_category_id: "Merek",
              master_pricing_formula_id: "Group",
              name: "Nama Produk",
              price_reference: "Harga Referensi",
            }}
            column={{
              product_specification_id: {
                value: null,
                type: "select",
                url: "/api/product/specification",
                name: "product_type"
              },
              name: {
                value: null,
              },
              price_reference: {
                value: null,
              },
              master_pricing_formula_id: {
                value: null,
                type: "select",
                url: "/api/master/pricing-formula",
                name: "group_name"
              }
            }}
            isGetField={props.method == 'create' && true}
            isCollection={false}
            method={props.method}
            onClose={props.handleClose}
          />
        </Card>
      </Modal>
    </>
  );
}
