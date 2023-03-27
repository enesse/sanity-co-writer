import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {customInspector} from './inspectors/customInspector'

export default defineConfig({
  name: 'default',
  title: 'Sanity Co-writer',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
  document: {
    inspectors: (prev) => [...prev, customInspector],
  },
})
