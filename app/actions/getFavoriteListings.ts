//action to get the favorite listings


import prisma from "../libs/prismadb"
import getCurrentUser from "./getCurrentUser"

export default async function getFavoriteListings() {


    try {
        
        //get the current user
        const currentUser = await getCurrentUser()

        //if current user is not present
        if(!currentUser)
        {
            return []
        }

        //finding our favorites
        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favoriteIds || [])]
                }
            }
        })

        //sanitize our favorites
        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString()
        }))

        //return the safe favorites
        return safeFavorites


    } catch (error: any) {
        throw new Error(error)
    }

}