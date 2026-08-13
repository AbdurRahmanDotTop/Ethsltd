import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { CreateApiKeyResponse } from '@ethsltd/types'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.get('/', (c) => c.json({ status: 'ok', service: 'Ethsltd API', version: '1.0' }))

app.get('/api/v1/auth/me', (c) => {
  // Placeholder response matching expected interface
  return c.json({
    success: true,
    data: {
      id: "usr_123",
      email: "demo@ethsltd.com",
      status: "ACTIVE",
      role: "USER"
    },
    requestId: "req_" + Date.now()
  })
})

export default app
