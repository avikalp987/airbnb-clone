import { getServerSession } from "next-auth/next"
import prisma from "../libs/prismadb"
import { authOptions } from "../../pages/api/auth/[...nextauth]"

export async function getSession() {
    return await getServerSession(authOptions)
}

export default async function() {
    try {
        //getting the session
        const session = await getSession()

        //checking weather the session exists or not
        if(!session?.user?.email)
        {
            return null
        }

        //find the current user
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        //checking weather the user exists or not
        if(!currentUser)
        {
            return null
        }

        //returning the user
        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        }

    } catch (error: any) {
        return null
    }
}