import prisma from "../libs/prismadb"

export interface IListingsParams {
    userId?: string,
}

export default async function getListings(
    params: IListingsParams
) {

    //getting our listings according to the filters
    try {

        //extract user id
        const {userId} = params

        //defining the querry
        let query: any = {}

        if(userId)
        {
            query.userId = userId
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