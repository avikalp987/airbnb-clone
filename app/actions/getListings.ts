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

        //returning all the listings
        return listings

        
    } catch (error: any) {
        throw new Error(error)
    }

}