"use client"

import { useMemo, useState } from "react";
import useRentModal from "../../hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS{
    CATEGORY=0,
    LOCATION=1,
    INFO=2,
    IMAGES=3,
    DESCRIPTION=4,
    PRICE=5,
}

const RentModal = () => {

    const rentModal = useRentModal()

    const [step,setStep] = useState(STEPS.CATEGORY)
    const [isLoading,setIsLoading] = useState(false)

    const router = useRouter()

    //setting up the use form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category:"",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathRoomCount: 1,
            imageSrc: "",
            price: 1,
            title: "",
            description: "",
        }
    })

    //custom way to watch our category
    const category = watch("category")
    const location = watch("location")
    const guestCount = watch("guestCount")
    const roomCount = watch("roomCount")
    const bathRoomCount = watch("bathRoomCount")
    const imageSrc = watch("imageSrc")

    //rendering the map in the dynamic way
    const Map = useMemo(()=> dynamic(() => import("../Map"), {
        ssr: false
    }), [location])

    //cutsom Set Value
    const setCustomValue = (id: string, value: any)=>{
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }


    //function to fo backwards
    const onBack = () => {
        setStep((value)=>value-1)
    }

    //function to go forward
    const onNext = () => {
        setStep((value)=>value+1)
    }

    //function for submitting the form
    const onSubmit: SubmitHandler<FieldValues> = (data) => {

        //checking if we are on our last step
        if(step !== STEPS.PRICE){
            return onNext();
        }

        //setting the loading to true
        setIsLoading(true)

        //sending the data to our api
        axios.post("/api/listings", data)
        .then(() => {
            toast.success("Listing Created!")
            router.refresh()
            reset()
            setStep(STEPS.CATEGORY)
            rentModal.onClose()
        })
        .catch(() => {
            toast.error("Something went wrong")
        })
        .finally(() => {
            setIsLoading(false)
        })

    }

    //writing our action labels
    const actionLabel = useMemo(()=>{
        if(step===STEPS.PRICE)
        return "Create"

        return "Next"
    }, [step])

    //secondary action label
    const secondaryActionLabel = useMemo(()=>{
        if(step===STEPS.CATEGORY)
        return undefined

        return "Back"
    }, [step])

    //writing our body content
    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Which of these best describes your place?"
                subTitle="Pick a category"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div
                        key={item.label}
                        className="col-span-1"
                    >
                        <CategoryInput 
                            onClick={(category) => setCustomValue("category", category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if(step === STEPS.LOCATION)
    {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Where is your place located?"
                    subTitle="Help guests find you!"
                /> 
                <CountrySelect 
                    value={location}
                    onChange={(value)=>setCustomValue("location", value)}
                />
                <Map 
                    center={location?.latlng}
                />
            </div>
        )
    }

    if(step === STEPS.INFO){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Share some basics about your place"
                    subTitle="What amenities do you have?"
                />
                <Counter
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value)=>setCustomValue("guestCount", value)}
                />

                <hr />

                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value)=>setCustomValue("roomCount", value)}
                />

                <hr />

                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathRoomCount}
                    onChange={(value)=>setCustomValue("bathRoomCount", value)}
                />
            </div>
        )
    }

    if(step === STEPS.IMAGES){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Add a photo of your place"
                    subTitle="Show guests what your place looks like!"
                />

                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue("imageSrc", value)}
                />
            </div>
        )
    }

    if(step === STEPS.DESCRIPTION){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="How would you describe your place?"
                    subTitle="Short and sweet works best!"
                />

                <Input 
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input 
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />

            </div>
        )
    }

    if(step === STEPS.PRICE){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Now, set your price"
                    subTitle="How much do you charge per night?"
                />

                <Input 
                    id="price"
                    label="Price"
                    formatPrice={true}
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return ( 
        <Modal
            title="Airbnb your home"
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step===STEPS.CATEGORY ? undefined : onBack}
            body={bodyContent}
        />
    );
}
 
export default RentModal;