/* This file is required for Payload to work with the App Router */
import configPromise from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from '@/app/(payload)/admin/importMap'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={handleServerFunctions as (args: unknown) => Promise<unknown>}>
    {children}
  </RootLayout>
)

export default Layout
