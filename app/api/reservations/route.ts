import { NextResponse } from "next/server"
import getCurrentUser from "../../actions/getCurrentUser"
import prisma from "../../libs/prismadb"

export async function POST (
    request: Request
) {

    //get the current user
    const currentUser = await getCurrentUser()

    //if there is no current user
    if(!currentUser)
    {
        return NextResponse.error()
    }

    //getting our body
    const body = await request.json()
    const { listingId, startDate, endDate, totalPrice } = body

    //if the information is missing
    if(!listingId || !startDate || !endDate || !totalPrice)
    {
        return NextResponse.error()
    }

    //update the listing and create the reservation
    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice
                }
            }
        }
    })

    return NextResponse.json(listingAndReservation)
}