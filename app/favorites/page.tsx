import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoritesClient from "./FavoritesClient";

const FavoriteListingPage = async () => {

    //loading our listings
    const listings = await getFavoriteListings()

    //getting our current user
    const currentUser = await getCurrentUser()

    //ifno listings are present
    if(listings.length === 0)
    {
        return ( 
            <ClientOnly>
                <EmptyState 
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listings."
                />
            </ClientOnly>
         );
    }

    return (
        <ClientOnly>
            <FavoritesClient 
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )

    
}
 
export default FavoriteListingPage;