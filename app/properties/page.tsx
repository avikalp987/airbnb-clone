import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import PropertiesClient from "./PropertiesClient";

const PropertiesPage = async () => {

    //getting the current user
    const currentUser = await getCurrentUser()

    //if no current user is present
    if(!currentUser)
    {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        )
    }

    //getting our listings
    const listings = await getListings({
        userId: currentUser.id
    })

    //if there are no reservations
    if(listings.length===0)
    {
        return <ClientOnly>
            <EmptyState 
                title="No properties found"
                subtitle="Looks like you have no properties"
            />
        </ClientOnly>
    }


    return ( 
        <ClientOnly>
            <PropertiesClient 
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
     );
}
 
export default PropertiesPage;