/* This file is required for Payload to work with the App Router */
import configPromise from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from '@/app/(payload)/admin/importMap'
import { handleServerFunctions } from './server-functions'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={handleServerFunctions}>
    {children}
  </RootLayout>
)

export default Layout
