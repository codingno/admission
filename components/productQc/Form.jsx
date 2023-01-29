import { Card, Modal } from "@mui/material";
import React from "react";

import FormMaster from "../../components/form";

import updatePrice from "../../utils/updatePrice";

// import axios from "axios";

export default function Form(props) {
	// async function updatePrice() {
	// 	try {
	// 		const response = await axios.get('/api/product/qc?id='+props.id)
	// 		const productQc = response.data[0]
	// 		const { data } = await axios.get('/api/calculate/'+props.id)
	// 		let neededData = {...data}
	// 		delete neededData.price_score
	// 		const min_price_1 = 800000, min_price_2 = 3000000
	// 		const seller_fee1 = 95000 
	// 		const seller_fee2 = neededData.qc_price > min_price_2 ? (min_price_2 - min_price_1) * 0.055 : neededData.qc_price > min_price_1 ? (neededData.qc_price - min_price_1) * 0.055 : 0
	// 		const seller_fee3 = neededData.qc_price > min_price_2? (neededData.qc_price - min_price_2) * 0.035 : 0
	// 		let seller_fee = seller_fee1 + seller_fee2 + seller_fee3
	// 		if(seller_fee > 7500000)
	// 			seller_fee = 7500000
	// 		const prepareData = {
	// 			...productQc,
	// 			...neededData,
	// 			seller_fee 
	// 		}
	// 		await axios.patch('/api/product/qc', prepareData)
	// 	} catch (error) {
	// 		if(error.response)	
	// 			alert(error.response.data)
	// 		else
	// 			alert(error)
	// 	}
	// }

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
            title="Model Inspeksi"
            titlePage="Model Inspeksi"
            submitUrl="/api/product/qc"
            // subCatUrl="/api/category/sub"
            // catUrl="/api/category"
            id={props.id}
            // formProps={{
            name="product_qc"
            getUrlForm="product_qc"
            label={{
              seller_id: "Seller",
              product_specification_sub_id: "Nama Model",
              imei: "Nomor IMEI",
              source: "Asal HP",
							is_repair: "Bekas Reparasi",
              // product_year: "Year",
              product_condition: "Kondisi",
							battery_health : "Kesehatan Baterai (Khusus iPhone)",
            }}
            column={{
              seller_id: {
                value: "",
                type: "select",
                url: "/api/user?roles_id=19",
                name: "name",
              },
              product_specification_sub_id: {
                value: "",
                type: "select",
                url: "/api/product/specification-sub?isQc=true",
                // name: "product_specificatin_sub"
              },
              imei: {
                value: "",
              },
              battery_health: {
                value: "",
              },
              source: {
                value: "",
                type: "select",
								option_data: [
									// {
									// 	id: "Konsinyasi",
									// 	name: "Konsinyasi",
									// },
									// { 
									// 	id: "Perusahaan", 
									// 	name: "Perusahaan" 
									// },
									{
										id: "Ex Internasional",
										name: "Ex Internasional",
									},
									{ 
										id: "Ex Resmi Indonesia", 
										name: "Ex Resmi Indonesia" 
									},
									{ 
										id: "Tidak Diketahui", 
										name: "Tidak Diketahui" 
									},
								],
              },
              is_repair: {
                value: "",
                type: "select",
                option_data: [
                  {
                    id: 1,
                    name: "Ya",
                  },
                  { 
                    id: 0, 
                    name: "Tidak" 
                  },
                ],
              },
              // product_year: {
              //   value: "",
              //   type: "number",
              // },
              product_condition: {
                value: "",
                type: "select",
                option_data: [
                  {
                    id: "Baru",
                    name: "Baru",
                  },
                  { 
                    id: "Bekas", 
                    name: "Bekas" 
                  },
                ],
              },
							price_reference: {
								value: "",
								type: "number",
								// disable: true,
								no_display: true,
							}
            }}
            isGetField={props.method == "create" && true}
            isCollection={false}
            // }}
            method={props.method}
            onClose={async (e) => { await updatePrice(props.id); props.handleClose(e); }}
          />
        </Card>
      </Modal>
    </>
  );
}
