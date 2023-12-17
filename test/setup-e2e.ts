import { envSchema } from '@/infra/env/env'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Redis } from 'ioredis'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { DomainEvents } from '../src/core/events/domain-events'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

const generateUniqueDatabaseURL = (schemaId: string) => {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL must be set')
  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

// beforeAll e afterAll executam antes e depois de cada ARQUIVO de teste
// beforeEach e afterEach executam antes e depois de cada TESTE

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseUrl

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
