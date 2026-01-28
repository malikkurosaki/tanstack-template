import { PrismaClient, UserRole } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

if (!process.env.ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL environment variable is not set')
}

const prisma = new PrismaClient({ adapter })

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: process.env.ADMIN_EMAIL!,
    }
  })

  if (user) {
    await prisma.user.update({
      where: {
        email: process.env.ADMIN_EMAIL!,
      },
      data: {
        role: UserRole.ADMIN,
      },
    })

    console.log('✅ Admin user updated')
  } else {
    console.log(process.env.ADMIN_EMAIL)
    console.log('No admin user found')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
