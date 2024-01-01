import prisma from "../libs/prismadb"

export default async function getListings() {

    //getting our listings according to the filters
    try {
        
        //fetching all of the listings
        const listings = await prisma.listing.findMany({
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