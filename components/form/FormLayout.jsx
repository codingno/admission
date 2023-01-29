import { Stack, Typography } from '@mui/material'
import Head from 'next/head'
import React from 'react'

export default function FormLayout (props) {
    return (
    <>
        <Head>
            <title>{props.title}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Stack sx={props.sx??{}}>
            <Typography variant="h4" >{props.titlePage}</Typography>
            {props.children}
        </Stack>
    </>
    )
}