'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useCallback, useState } from "react"

type Variant = 'LOGIN' | 'REGISTER'

const formSchema = z.object({
    name: z.string().min(2, {message: "Username must be at least 2 characters.",}),
    email: z.string().email(),
    password: z.string().min(8)
  })

export default function AuthForm() {
    const [variant, setVariant] = useState<Variant>('LOGIN')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const toggleVariant = useCallback(() => {
        if(variant === 'LOGIN'){
            setVariant('REGISTER')
        } else{
            setVariant('LOGIN')
        }
    }, [variant])

    const {register, handleSubmit, formState:{errors}} = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
        setIsLoading(true);

        if(variant === 'REGISTER'){
            // axios register
        }

        if(variant === 'LOGIN'){
            // Next Auth SignIn
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);

        //Next Auth social Sign In
    }

    return (
        <section>
            AuthForm2
        </section>
    )
}