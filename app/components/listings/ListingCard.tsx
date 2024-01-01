"use client"

import { useRouter } from "next/navigation";
import { SafeUser } from "../../types";
import { Listing, Reservation } from "@prisma/client";
import useCountries from "../../hooks/useCountries";
import { useCallback, useMemo } from "react";
import { format } from "date-fns"
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
    data: Listing,
    reservation?: Reservation,
    onAction?: (id: string)=>void,
    disabled?: boolean
    actionLabel?: string,
    actionId?: string,
    currentUser?: SafeUser | null,
}


const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId="",
    currentUser,
}) => {

    //getting our router
    const router = useRouter()

    //getting our countries from "get by value"
    const { getByValue } = useCountries()

    //getting our location from the location value
    const location = getByValue(data.locationValue)

    //function for handling the cancellation of the trips
    const handleCancel = useCallback((
        e: React.MouseEvent<HTMLButtonElement>
    )=>{
        //stopping the propogation
        e.stopPropagation()

        //check if the current card is disabled
        if(disabled)
        {
            return;
        }

        //execution the action
        onAction?.(actionId) //since the onAction function can be undefined

    }, [onAction, actionId, disabled])

    //getting the price
    const price = useMemo(()=>{
        if(reservation)
        {
            return reservation.totalPrice
        }

        return data.price
    }, [reservation, data.price])

    //calculating our reservation date
    const reservationDate = useMemo(()=>{
        if(!reservation)
        {
            return null
        }

        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)

        return `${format(start, "PP")} - ${format(end ,"PP")}`
    }, [reservation])

    return ( 
        <div 
            onClick={() => router.push(`/api/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square relative overflow-hidden w-full rounded-xl">
                    <Image 
                        alt="listing"
                        src={data.imageSrc}
                        className="object-cover h-full w-full group-hover:scale-110 transition"
                        fill
                    />
                        
                    <div className="absolute top-3 right-3">
                        <HeartButton 
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>

                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>

                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        $ {price}
                    </div>

                    {!reservation && (
                        <div className="font-light">night</div>
                    )}
                </div>

                {onAction && actionLabel && (
                    <Button 
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}

            </div>
        </div>
     );
}
 
export default ListingCard;