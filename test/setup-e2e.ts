import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()

const generateUniqueDatabaseURL = (schemaId: string) => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set')
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

// beforeAll e afterAll executam antes e depois de cada ARQUIVO de teste
// beforeEach e afterEach executam antes e depois de cada TESTE

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseUrl

  execSync(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
