import { NextResponse } from "next/server"
import getCurrentUser from "../../../actions/getCurrentUser"
import prisma from "../../../libs/prismadb"

//interface 
interface IParams {
    reservationId?: string
}

export async function DELETE (
    request: Request,
    { params }: { params: IParams }
) {
    //fetch the current user
    const currentUser = await getCurrentUser()

    //if no current user is present
    if(!currentUser)
    {
        return NextResponse.error()
    }

    const { reservationId } = params

    //if no reservation id is present
    if(!reservationId || typeof reservationId !== "string")
    {
        throw new Error("Invalid ID")
    }

    //deleting the reservation
    //ensuring that the creator of reservation or the creator of listing can delete the reservation
    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            OR: [
                {userId: currentUser.id},
                {listing: { userId: currentUser.id }}
            ],
        }
    })

    //returning the response
    return NextResponse.json(reservation)
}