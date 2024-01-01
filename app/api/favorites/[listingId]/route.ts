import { NextResponse } from "next/server"
import getCurrentUser from "../../../actions/getCurrentUser"
import prisma from "../../../libs/prismadb"

//interface
interface IParams {
    listingId?: string,
}

export async function POST(
    request: Request,
    { params }: { params: IParams } //getting the params [params]
) {
    //getting our current user
    const currentUser = await getCurrentUser()

    //if no current user is present
    if(!currentUser)
    {
        return NextResponse.error()
    }

    //getting our listing id from the params
    const { listingId } = params

    //if there is no listing id present or type mismatch
    if(!listingId || typeof listingId !== "string")
    {
        throw new Error("Invalid ID")
    }

    //initializing our favorite ids
    let favoriteIds = [...(currentUser.favoriteIds || [])]

    //pushing the current listing into favorites
    favoriteIds.push(listingId);


    //updating the user
    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds: favoriteIds
        }
    })

    //returing the updated user
    return NextResponse.json(user)
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    //getting our current user
    const currentUser = await getCurrentUser()

    //if there is no current user
    if(!currentUser)
    {
        return NextResponse.error()
    }

    //extract our listing id from params
    const { listingId } = params

    //if listing id is not present or type mismatch
    if(!listingId || typeof listingId !== "string")
    {
        throw new Error("Invalid ID")
    }

    //initializing the favorite ids
    let favoriteIds = [...(currentUser.favoriteIds || [])]

    //removing the current listing from the list
    favoriteIds = favoriteIds.filter((currentId) => currentId!==listingId)

    //update the user
    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds: favoriteIds
        }
    })

    //return the updated user
    return NextResponse.json(user)
}
