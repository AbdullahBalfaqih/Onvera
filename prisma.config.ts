import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: {
    datasource: {
      url: 'file:./dev.db',
    },
  },
})
