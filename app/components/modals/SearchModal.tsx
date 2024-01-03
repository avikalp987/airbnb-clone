"use client"

import { useRouter, useSearchParams } from "next/navigation";
import useSearchModal from "../../hooks/useSearchModal";
import Modal from "./Modal";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from "query-string"
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";


enum STEPS{
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {

    //getting our router
    const router = useRouter()

    ////getting our search params
    const params = useSearchParams()

    //getting our search modal
    const searchModal = useSearchModal()

    //the step state
    const [step,setStep] = useState(STEPS.LOCATION)

    //state for guest count
    const [guestCount, setGuestCount] = useState(1)

    //room count
    const [roomCount, setRoomCount] = useState(1)

    //bathroom Count
    const [bathroomCount, setBathroomCount] = useState(1)

    //state for date range
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    })

    //location state
    const [location, setLocation] = useState<CountrySelectValue>()

    //import our map
    const Map = useMemo(()=> dynamic(() => import("../Map"),{
        ssr: false
    }), [location])

    //previous
    const onBack = useCallback(()=>{
        setStep((value) => value-1)
    }, [])

    //next
    const onNext = useCallback(()=>{
        setStep((value) => value+1)
    }, [])

    //function to sumbit
    const onSubmit = useCallback(async ()=>{
        
        //check if we are on the last step
        if(step!==STEPS.INFO)
        {
            return onNext()
        }


        let currentQuery = {}

        //if we have some kind of params
        if(params)
        {
            currentQuery = qs.parse(params.toString())
        }

        //updated query
        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        }

        //adding the date range
        if(dateRange.startDate)
        {
            updatedQuery.startDate = formatISO(dateRange.startDate)
        }

        if(dateRange.endDate)
        {
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        //create our final url
        const url = qs.stringifyUrl({
            url: "/",
            query: updatedQuery,
        }, {skipNull: true})


        //resetting our step
        setStep(STEPS.LOCATION)

        //closing the search modal
        searchModal.onClose()

        //pushing the url into router
        router.push(url)

    }, [step, searchModal, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params])



    //action label and secondary action label
    const actionLabel = useMemo(()=>{
        if(step===STEPS.INFO)
        return "Search"

        return "Next"
    }, [step])

    const secondaryActionLabel = useMemo(()=>{
        if(step === STEPS.LOCATION)
        {
            return undefined
        }

        return "Back"
    }, [step])

    //creating our body content
    let bodyContent = (
        <div className="flex flex-col gap-8">
                <Heading 
                    title="Where do you wanna go?"
                    subTitle="find the perfect location!"

                />

                <CountrySelect 
                    value={location}
                    onChange={(value)=>{
                        setLocation(value as CountrySelectValue)
                    }}
                />
                <hr />

                <Map 
                    center={location?.latlng}
                />
        </div>
    )

    if (step === STEPS.DATE) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="When do you plan to go?"
              subTitle="Make sure everyone is free!"
            />
            <Calender
              onChange={(value) => setDateRange(value.selection)}
              value={dateRange}
            />
          </div>
        )
      }

    if (step === STEPS.INFO) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="More information"
              subTitle="Find your perfect place!"
            />
            <Counter 
              onChange={(value) => setGuestCount(value)}
              value={guestCount}
              title="Guests" 
              subtitle="How many guests are coming?"
            />
            <hr />
            <Counter 
              onChange={(value) => setRoomCount(value)}
              value={roomCount}
              title="Rooms" 
              subtitle="How many rooms do you need?"
            />        
            <hr />
            <Counter 
              onChange={(value) => {
                setBathroomCount(value)
              }}
              value={bathroomCount}
              title="Bathrooms"
              subtitle="How many bahtrooms do you need?"
            />
          </div>
        )
      }

    return ( 
        <Modal 
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            body={bodyContent}
            secondaryAction={step===STEPS.LOCATION ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
        />
     );
}
 
export default SearchModal;