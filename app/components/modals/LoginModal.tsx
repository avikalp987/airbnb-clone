"use client"

import { useState } from "react";
import useRegisterModal from "../../hooks/useRegisterModal";
import { AiFillGithub } from "react-icons/ai"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "../../hooks/useLoginModal";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";

const LoginModal = () => {

    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        
        signIn("credentials", {
            ...data,
            redirect: false
        })
        .then((callback)=>{
            setIsLoading(false)

            if(callback?.ok)
            {
                toast.success("Logged In")
                router.refresh()
                loginModal.onClose()
            }

            if(callback?.error)
            {
                toast.error(callback.error)
            }
        })

    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome back"
                subTitle="Login to your account!"
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
                        First time using Airbnb?
                    </div>

                    <div 
                        onClick={()=>{
                            loginModal.onClose()
                            registerModal.onOpen()
                        }}
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    )

    return ( 
        <Modal 
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
     );
}
 
export default LoginModal;