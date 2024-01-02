//getting the dates which already have been reserved

import prisma from "../libs/prismadb"

interface IParams {
    listingId?: string,
    userId?: string,
    authorId?: string,
}

export default async function getReservations(
    params: IParams
)
{
    try {
        //extract all of our paramsters
        const { listingId, userId, authorId } = params

        //initializing the query
        const query: any = {}

        //for listing id
        if(listingId)
        {
            query.listingId = listingId
        }

        //for user id
        if(userId)
        {
            query.userId = userId
        }

        //for author id
        if(authorId)
        {
            query.listing = { userId: authorId }
        }


        //getting our reservations
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        //returning our reservation in a sanitized way
        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString(),
            }
        }))

        return safeReservations
    } catch (error: any) {
        throw new Error(error)
    }
}