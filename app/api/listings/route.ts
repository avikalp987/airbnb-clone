//creating the route for "/api/listings"

import { NextResponse } from "next/server"
import getCurrentUser from "../../actions/getCurrentUser"
import prisma from "../../libs/prismadb"

export async function POST (
    request: Request
) {
    //getting our current user from the action
    const currentUser = await getCurrentUser()

    //if we dont have the user
    if(!currentUser)
    {
        return NextResponse.error()
    }

    //getting our body
    const body = await request.json()

    //extracting the fields from the body
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathRoomCount,
        guestCount,
        location,
        price,
    } = body

    //if any of the value is missing
    Object.keys(body).forEach((value: any) => {
        if(!body[value]) {
            NextResponse.error()
        }
    })

    //creating the listing
    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathRoomCount,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    })

    //returnung the listing as response
    return NextResponse.json(listing)
}