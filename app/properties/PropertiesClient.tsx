"use client"

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeListing, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface PropertiesClientProps {
    listings: SafeListing[],
    currentUser?: SafeUser | null
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
    listings,
    currentUser,
}) => {

    //getting our router
    const router = useRouter()

    //state for deleting id
    const [deletingId, setDeletingId] = useState("")

    //cancel function
    const onCancel = useCallback((id: string)=>{
        //setting our deleting id
        setDeletingId(id)

        //calling the delete api route
        axios.delete(`/api/listings/${id}`)
        .then(()=>{
            toast.success("Lsiting deleted")
            router.refresh()
        })
        .catch((error)=>{
            toast.error(error?.response?.data?.error)
        })
        .finally(()=>{
            setDeletingId("")
        })

    }, [router])

    return ( 
        <Container>
            <Heading 
                title="Properties"
                subTitle="List of your properties"
            />

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing)=>(
                    <ListingCard 
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onCancel}
                        disabled={deletingId===listing.id}
                        actionLabel="Delete Property"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
     );
}
 
export default PropertiesClient;