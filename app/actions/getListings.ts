import prisma from "../libs/prismadb"

export interface IListingsParams {
    userId?: string,
    guestCount?: number,
    roomCount?: number,
    bathroomCount?: number,
    startDate?: string,
    endDate?: string,
    locationValue?: string,
    category?: string,
}

export default async function getListings(
    params: IListingsParams
) {

    //getting our listings according to the filters
    try {

        //extract all of our search params
        const {userId, roomCount, guestCount, bathroomCount, startDate, endDate, locationValue, category} = params

        //defining the querry
        let query: any = {}

        if(userId)
        {
            query.userId = userId
        }

        if(category)
        {
            query.category = category
        }

        if(roomCount)
        {
            query.roomCount = {
                gte: +roomCount
            }
        }

        if(bathroomCount)
        {
            query.bathRoomCount = {
                gte: +bathroomCount
            }
        }

        if(guestCount)
        {
            query.guestCount = {
                gte: +guestCount
            }
        }

        if(locationValue)
        {
            query.locationValue = locationValue
        }

        //filter for date range
        if(startDate && endDate)
        {
            query.NOT = {
                reservations: {
                    some: {
                        OR:[
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: startDate }
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate }
                            } 
                        ]
                    }
                }
            }
        }
        
        //fetching all of the listings
        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: "desc"
            }
        })

        //converting the listings into safe listings
        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString() //converting the date and time component to a safer component
        }))

        //returning the safe listings
        return safeListings

        
    } catch (error: any) {
        throw new Error(error)
    }

}