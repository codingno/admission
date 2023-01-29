import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import Dashboard from './dashboard'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function Home() {
	// const [userRole, setUserRole] = useState('')
	const router = useRouter();
	const { data, status } = useSession();
	
	useEffect(() => {
		if(data){
		// console.log(status);
		// setUserRole(data.user.employee_role_id);
		}
	}, [data])
//   console.log(session);
	if(status === 'unauthenticated'){
		// router.push('/auth/signin')
		router.push('/auth/authentication/signin')
	} 
	else if(status === 'authenticated'){
		if(data?.user.ROLE_ID != 2)
			router.push('/dashboard')
		// if(data?.user.ROLE_ID == 1)
		// 	router.push('/admission/list')
		// else if(data?.user.ROLE_ID == 3)
		// 	router.push('/verification/list')
		else
			router.push('/admission/form')
	} 

	return ""
}
