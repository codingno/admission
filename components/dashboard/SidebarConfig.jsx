import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
import clipboardFill from '@iconify/icons-eva/clipboard-fill';
import smartphoneFill from '@iconify/icons-eva/smartphone-fill';
import bluetoothFill from '@iconify/icons-eva/bluetooth-fill';
import barChart2Fill from '@iconify/icons-eva/bar-chart-2-fill';
import phoneCallFill from '@iconify/icons-eva/phone-call-fill'
import bookFill from '@iconify/icons-eva/book-fill'
import micFill from '@iconify/icons-eva/mic-fill'
import linkedInFill from '@iconify/icons-eva/linkedin-fill'
import shareFill from '@iconify/icons-eva/share-fill'
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill'
import priceTagFill from '@iconify/icons-eva/pricetags-fill'


// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon(pieChart2Fill)
  // },
  {
    title: "Personal Details",
    path: "/admission/form?state=personal-details",
    icon: getIcon(peopleFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Contact Details",
    path: "/admission/form?state=contact-details",
    icon: getIcon(personAddFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Financial Support",
    path: "/admission/form?state=financial-support",
    icon: getIcon(priceTagFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  // {
  //   title: "Emergency Contact Details",
  //   path: "/admission/form?state=emergency-contact-details",
  //   icon: getIcon(phoneCallFill),
  //   // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  // },
  {
    title: "Proposed Study Program",
    path: "/admission/form?state=proposed-study-program",
    icon: getIcon(bookFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Education Background",
    path: "/admission/form?state=education-background",
    icon: getIcon(barChart2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Language Proficiency",
    path: "/admission/form?state=language-proficiency",
    icon: getIcon(micFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Job Status",
    path: "/admission/form?state=job-status",
    icon: getIcon(linkedInFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Referee Details",
    path: "/admission/form?state=referee-details",
    icon: getIcon(shareFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Document to be Upload",
    path: "/admission/form?state=document-to-be-upload",
    icon: getIcon(cloudUploadFill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  {
    title: "Applicant's Declaration",
    path: "/admission/form?state=applicant-declaration",
    icon: getIcon(checkmarkSquare2Fill),
    // role: process.env.NEXT_PUBLIC_ROLE_INSPEKTUR,
  },
  // {
  //   title: "spesifikasi model",
  //   // path: "/dashboard/product",
	// 	// path: "/dashboard/product/specification-sub", 
	// 	path: "/dashboard/product/specification", 
  //   icon: getIcon(smartphoneFill),
  //   role: process.env.NEXT_PUBLIC_ROLE_CONTENT_CREATOR,
  //   // children: [
  //   //   { title: "model", path: "/dashboard/product/specification", icon: getIcon(smartphoneFill) },
  //   //   { title: "detail model", 
	// 	// 	path: "/dashboard/product/specification-sub", 
	// 	// 	icon: getIcon(fileTextFill) },
  //   // ],
  // },
  // {
  //   title: "harga model",
  //   path: "/dashboard/product/specification-sub",
  //   icon: getIcon(shoppingBagFill),
  //   role: process.env.NEXT_PUBLIC_ROLE_OPERATION_INVENTORY,
  // },
  // {
  //   title: "Produk Inspeksi",
  //   // path: "/dashboard/product",
	// 	path: "/dashboard/product/qc-scored", 
  //   icon: getIcon(checkmarkSquare2Fill),
  //   role: [
  //     parseInt(process.env.NEXT_PUBLIC_ROLE_OPERATION_INVENTORY)
  //   ],
  // },
  // {
  //   title: "inspeksi",
  //   // path: "/dashboard/product",
	// 	path: "/dashboard/product/qc-detail", 
  //   icon: getIcon(checkmarkSquare2Fill),
  //   role: [
  //     parseInt(process.env.NEXT_PUBLIC_ROLE_INSPEKTUR),
  //     // parseInt(process.env.NEXT_PUBLIC_ROLE_OPERATION_INVENTORY)
  //   ],
  //   // children: [
  //   //   { title: "daftar inspeksi", path: "/dashboard/product/qc", icon: getIcon(clipboardFill) },
  //   //   { title: "detail inspeksi", 
	// 	// 		path: "/dashboard/product/qc-detail", 
	// 	// 		icon: getIcon(bluetoothFill) },
  //   // ],
  // },
  // {
  //   title: 'price reference',
  //   path: '/dashboard/price-reference',
  //   icon: getIcon(barChart2Fill)
  // },
  // {
  //   title: "product list",
  //   path: "/dashboard/product-list",
  //   icon: getIcon(fileTextFill),
  // },
  // {
  //   title: "product qc",
  //   icon: getIcon(checkmarkSquare2Fill),
  //   children: [
  //     { title: "product data", path: "/dashboard/qc-product-data", icon: getIcon(clipboardFill) },
  //     { title: "inspeksi eksternal", path: "/dashboard/qc-external", icon: getIcon(smartphoneFill) },
  //     { title: "inspeksi fungsi", path: "/dashboard/qc-funtion", icon: getIcon(bluetoothFill) },
  //   ],
];

export default sidebarConfig;
