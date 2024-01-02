"use client"

import { useState } from "react";
import useRegisterModal from "../../hooks/useRegisterModal";
import { AiFillGithub } from "react-icons/ai"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "../../hooks/useLoginModal";
import { signIn } from "next-auth/react";

const RegisterModal = () => {

    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        axios.post("/api/register", data)
        .then(()=>{
            toast.success("Success!")
            registerModal.onClose()
            loginModal.onOpen()
        })
        .catch((error)=>{
            toast.error("Something went wrong!")
        })
        .finally(()=>{
            setIsLoading(false)
        })

    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to Airbnb"
                subTitle="Create an account!"
            />

            <Input 
                id="email"
                label="Email"
                type="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

                <Input 
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

                <Input 
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button 
                outline
                label="Continue with github"
                icon={AiFillGithub}
                onClick={()=>signIn("github")}
            />

            <div className="text-netral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center gap-2 justify-center">
                    <div>
                        Already have an account?
                    </div>

                    <div 
                        onClick={()=>{
                            registerModal.onClose()
                            loginModal.onOpen()
                        }}
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Login
                    </div>
                </div>
            </div>
        </div>
    )

    return ( 
        <Modal 
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
     );
}
 
export default RegisterModal;