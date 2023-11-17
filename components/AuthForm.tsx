'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useCallback, useEffect, useState } from "react"
import AuthSocialButton from "./AuthSocialButton"
import {BsGithub, BsGoogle} from 'react-icons/bs'
import axios from "axios"
import toast from "react-hot-toast"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from "next/navigation"

type Variant = 'LOGIN' | 'REGISTER'

const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
  })

export default function AuthForm() {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if(session?.status === 'authenticated'){
            router.push('/users')
        }
    }, [session?.status])

    const toggleVariant = useCallback(() => {
        if(variant === 'LOGIN'){
            setVariant('REGISTER')
        } else{
            setVariant('LOGIN')
        }
    }, [variant])

    const form = useForm<z.infer<typeof formSchema>>({
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
            axios.post('/api/register', data).then(() => signIn('credentials', data)).catch(() => toast.error('Something went wrong!')).finally(() => setIsLoading(false))
        }

        if(variant === 'LOGIN'){
            signIn('credentials', {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error){
                    toast.error('Invalid Credentials')
                }

                if (callback?.ok && !callback?.error){
                    toast.success('Logged in!')
                    router.push('/users')
                }
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, {redirect: false}).then((callback) => {
            if(callback?.error){
                toast.error('Invalid Credentials')
            }

            if(callback?.ok && !callback?.error){
                toast.success('Logged in')
            }
        }).finally(() => setIsLoading(false))
    }

    return (
        <section className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {variant === 'REGISTER' && (
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g Mark Cillessen" {...field} />
                                </FormControl>
                                <FormDescription>Type your name. It will be displayed publicly.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )} />
                    )}

                        <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>Type your e-mail</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="" type="password" {...field} />
                            </FormControl>
                            <FormDescription>Type your password</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )} />
                    <Button className="w-full" disabled={isLoading} variant='blue' type="submit">{variant === 'LOGIN' ? 'Sign in' : 'Register'}</Button>
                </form>
            </Form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2 justify-center">
                    <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                    <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                </div>
            </div>
            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                <div>
                    {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer">
                    {variant === 'LOGIN' ? 'Create an Account' : 'Login'}
                </div>
            </div>
            </div>
        </section>
    )
}