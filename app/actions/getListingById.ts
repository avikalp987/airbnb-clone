//getting the listing from our database without using api 

import prisma from "../libs/prismadb"

interface IParams {
    listingId?: string
}

export default async function getListingById(
    params: IParams
) {
    try {
        //getting our listing id
        const { listingId } = params

        //getting our actual listing
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        })

        //if there is no listing
        if(!listing)
        {
            return null
        }

        //returning our listing in a sanitized way
        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null,
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}