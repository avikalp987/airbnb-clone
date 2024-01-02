import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import Reservationsclient from "./ReservationClient";

const ReservationsPage = async () => {

    //fetch the current user
    const currentUser = await getCurrentUser()

    if(!currentUser)
    {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="Please login and try again"
                />
            </ClientOnly>
        )
    }

    //fetching the reservations
    const reservations = await getReservations({
        authorId: currentUser.id
    })

    if(reservations.length === 0)
    {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No reservations found"
                    subtitle="Looks like you have no reservations on your property"
                />
            </ClientOnly>
        )
    }


    return ( 
        <ClientOnly>
            <Reservationsclient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
     );
}
 
export default ReservationsPage;