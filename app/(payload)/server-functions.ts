'use server'

import configPromise from '@payload-config'
import { handleServerFunctions as payloadHandleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import type { ServerFunctionClient } from 'payload'

export const handleServerFunctions: ServerFunctionClient = async (args) => {
  'use server'
  return payloadHandleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}
