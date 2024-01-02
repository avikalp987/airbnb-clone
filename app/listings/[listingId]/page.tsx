import ClientOnly from "../../components/ClientOnly";
import getListingById from "../../actions/getListingById";
import EmptyState from "../../components/EmptyState";
import getCurrentUser from "../../actions/getCurrentUser";
import ListingClient from "./ListingClient";
import getReservations from "../../actions/getReservations";

interface IParams{
    listingId?: string
}

const ListingPage = async (
    { params }: { params: IParams }
) => {

    //getting our listing by id
    const listing = await getListingById(params)

    //getting our reservations for this particular listing
    const reservations = await getReservations(params)

    //getting the current user
    const currentUser = await getCurrentUser()

    //if there is no listing
    if(!listing)
    {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return ( 
        <ClientOnly>
            <ListingClient 
                listing={listing}
                currentUser={currentUser}
                reservations={reservations}
            />
        </ClientOnly>
     );
}
 
export default ListingPage;