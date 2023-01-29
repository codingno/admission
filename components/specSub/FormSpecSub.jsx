import { Card, Modal } from "@mui/material";
import React from "react";

import FormMaster from "../form";

export default function FormSpecSub(props) {
  return (
    <>
          <FormMaster
						sx={{
							marginBottom : '3rem',
							marginLeft : '2rem',
						}}
            title="Detail Spesifikasi Model"
            // titlePage="Detail Spesifikasi Model"
            submitUrl="/api/product/specification-sub"
            id={props.id}
            name="product_specification_sub"
            getUrlForm="product_specification_sub"
            label={{
              product_specification_id: "Model",
              sub_category_id: "Merek",
              master_pricing_formula_id: "Group",
              name: "Nama Produk",
            }}
            column={{
              product_specification_id: {
                value: null,
                type: "select",
                url: `/api/product/specification${props.subCategory ? ('?sub_category_id=' + props.subCategory.id) : '' }`,
                name: "product_type"
              },
              name: {
                value: null,
								no_display: true,
              },
              price_reference: {
                value: null,
              },
              master_pricing_formula_id: {
                value: 1,
                type: "select",
                url: "/api/master/pricing-formula",
                name: "group_name",
								no_display : true,
              }
            }}
            isGetField={props.method == 'create' && true}
            isCollection={false}
            method={props.method}
            onClose={props.handleClose}
						updateColumnValue={props.specSub || null}
						submitStyle={{
							marginLeft: 0,
							maxWidth: "250px",
						}}
						// submitStyleButton={{
						// 	backgroundColor : '#FF4842',
						// }}
          />
    </>
  );
}
