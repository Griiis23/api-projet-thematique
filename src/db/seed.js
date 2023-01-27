//Import de prisma
import pkg from '@prisma/client'

//équivaut à const PrismaClient = pkg.PrismaClient (déstructuration)
const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { user: User } = prisma

//fonction de création de données
async function main() {
    await User.create({
        data: {
            name: 'Adrien',
            posts: {
                create: [
                    {
                        title: 'js destructuration',
                        content: '...',
                    },
                    {
                        title: 'js destructuration2',
                        content: '...',
                    },
                    {
                        title: 'js destructuration3',
                        content: '...',
                    },
                    {
                        title: 'js destructuration4',
                        content: '...',
                    },
                ],
            },
        },
    })
}

//appel de la fonction (npx prisma db seed)
main()
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
