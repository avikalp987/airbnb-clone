"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeListing, SafeReservation, SafeUser } from "../../types";
import { categories } from "../../components/navbar/Categories";
import Container from "../../components/Container";
import ListingHead from "../../components/listings/ListingHead";
import ListingInfo from "../../components/listings/ListingInfo";
import useLoginModal from "../../hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingReservation from "../../components/listings/ListingReservation";
import { Range } from "react-date-range"

//creating a initial date range
const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
}

//defining the interface
interface ListingClientProps {
    reservations?: SafeReservation[],
    listing: SafeListing & {
        user: SafeUser
    },
    currentUser?: SafeUser | null,

}

const ListingClient: React.FC<ListingClientProps> = ({
    reservations = [], //giving the reservations a default value of empty array
    listing,
    currentUser,
}) => {

    //getting our loginModal
    const loginModal = useLoginModal()
    
    //getting our router
    const router = useRouter()

    //defining a constant for disabled dates
    const disabledDates = useMemo(()=>{
        let dates: Date[] = []

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            })

            dates=[...dates, ...range]
        })

        return dates
    }, [reservations])

    //loading state
    const [isLoading, setIsLoading] = useState(false)

    //total price state
    const [totalPrice, setTotalPrice] = useState(listing.price)

    //date range state
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    //function to create reservation
    const onCreateReservation = useCallback(()=>{

        //if no current user is present
        if(!currentUser)
        {
            return loginModal.onOpen()
        }

        setIsLoading(true);

        axios.post("/api/reservations", {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(() => {
            toast.success("Listing Reserved!");
            setDateRange(initialDateRange)
            // redirect to "/trips"
            router.refresh()
        })
        .catch(() => {
            toast.error("Something went wrong")
        })
        .finally(() => {
            setIsLoading(false)
        })

    } ,[totalPrice, dateRange, listing?.id, router, currentUser, loginModal])

    //setting the total price on how user selects the date on calender
    useEffect(()=>{

        if(dateRange.startDate && dateRange.endDate)
        {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            )

            if(dayCount && listing.price)
            {
                setTotalPrice(dayCount*listing.price)
            }
            else
            {
                setTotalPrice(listing.price)
            }
        }

    }, [dateRange, listing.price])

    //getting our category
    const category = useMemo(()=>{
        return categories.find((item) => item.label===listing.category)
    }, [listing.category])

    return ( 
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead 
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo 
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathRoomCount={listing.bathRoomCount}
                            locationValue={listing.locationValue}
                        />

                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation 
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
     );
}
 
export default ListingClient;