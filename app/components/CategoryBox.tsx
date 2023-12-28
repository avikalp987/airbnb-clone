"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string"

interface CategoryBoxProps {
    label: string,
    description: string,
    icon: IconType,
    selected?: boolean
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    label,
    icon: Icon,
    description,
    selected
}) => {

    const router = useRouter()
    const params = useSearchParams()

    const handleClick = useCallback(()=>{
        //define the query
        let currentQuery = {}

        //check weather we have params or not
        if(params)
        {
            currentQuery = qs.parse(params.toString())
        }

        //make a new updated query
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        //resetting the query on click if it was already set
        if(params?.get("category")===label)
        {
            delete updatedQuery.category
        }

        //defining the url
        const url = qs.stringifyUrl({
            url: "/",
            query: updatedQuery,
        }, { skipNull: true })

        //pushing the url in the router
        router.push(url)
    }, [label, params, router])

    return ( 
        <div 
        onClick={handleClick}
        className={`
        flex
        flex-col
        items-center
        justify-center
        gap-2
        p-3
        border-b-2
        hover:text-neutral-800
        transition
        cursor-pointer
        ${selected ? "border-b-neutral-800" : "border-transparent"}
        ${selected ? "text-neutral-800" : "text-neutral-500"}
        `}
        >
            <Icon size={26} />

            <div className="font-medium text-sm">
                {label}
            </div>
        </div>
     );
}
 
export default CategoryBox;