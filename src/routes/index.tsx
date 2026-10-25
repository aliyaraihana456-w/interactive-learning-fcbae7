import { createFileRoute } from '@tanstack/react-router'

import { App } from '@/components/dbs/app'

export const Route = createFileRoute('/')({
  component: App,
})
