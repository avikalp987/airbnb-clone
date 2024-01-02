import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import TripsClient from "./TripsClient";

const TripsPage = async () => {

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

    //getting our reservations
    const reservations = await getReservations({
        userId: currentUser.id
    })

    //if there are no reservations
    if(reservations.length===0)
    {
        return <ClientOnly>
            <EmptyState 
                title="No trips found"
                subtitle="Looks like you have&apos;nt reserved any trips"
            />
        </ClientOnly>
    }


    return ( 
        <ClientOnly>
            <TripsClient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
     );
}
 
export default TripsPage;