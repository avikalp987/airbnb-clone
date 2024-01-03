//deleting a particular property

import { NextResponse } from "next/server"
import getCurrentUser from "../../../actions/getCurrentUser"
import prisma from "../../../libs/prismadb"

interface IParams {
    listingId?: string,
}

export async function DELETE (
    request: Request,
    { params }: { params: IParams }
) {
    //get the current user
    const currentUser = await getCurrentUser()

    //if no current user
    if(!currentUser)
    {
        return NextResponse.error()
    }

    //extract the listing id 
    const { listingId } = params

    //if no listing id
    if(!listingId || typeof listingId !== "string")
    {
        throw new Error("Invalid ID")
    }

    //delete the listing
    const listing = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            userId: currentUser.id
        }
    })

    //return the response
    return NextResponse.json(listing)
}