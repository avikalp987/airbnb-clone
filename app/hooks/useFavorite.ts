import { useRouter } from "next/navigation";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

//interface
interface IUseFavorite {
    listingId: string,
    currentUser?: SafeUser | null
}

//our custom hook
const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) => {

    //adding our router
    const router = useRouter()

    //get our login modal
    const loginModal = useLoginModal()


    //function to check weather a particular listing has been favorited or not
    const hasFavorited = useMemo(()=>{

        //getting our already favorited list
        const list = currentUser?.favoriteIds || []

        return list.includes(listingId)
    }, [currentUser, listingId])


    //function to toggle favorite on and off
    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    )=>{

        //stopping the propogation
        e.stopPropagation()

        //if we dont have the current user
        if(!currentUser)
        {
            return loginModal.onOpen()
        }

        try {
            
            //initializing the request
            let request

            //if already liked then unlike the listing and if not liked please like it
            if(hasFavorited)
            {
                request = ()=>axios.delete(`/api/favorites/${listingId}`)
            }
            else
            {
                request = ()=>axios.post(`/api/favorites/${listingId}`)
            }

            //call the request
            await request()

            //refreshing the page
            router.refresh()

            //toast the notification
            toast.success("Success")

        } catch (error: any) {
            //toasting the error
            toast.error("Something went wrong.")
        }


    } ,[currentUser, hasFavorited, listingId, loginModal, router])

    return {hasFavorited, toggleFavorite}
}

export default useFavorite