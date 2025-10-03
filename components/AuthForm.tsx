"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { signIn, signUp } from '@/lib/actions/user.actions'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { getLoggedInUser } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'



const AuthForm = ({type} : {type:string}) => {

    const router = useRouter();
    const [user,setUser] =useState(null);
    const [isLoading,setIsLoading] = useState(false);


    const formSchema = authFormSchema(type)

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
      firstName: "",
      lastName: "",
      address1: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      city: "",
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    setIsLoading(true)
    try{

      // sign-up avec Appwrite et plaid token

      if(type==='sign-up'){

        const userData={
          //Sans ! : TypeScript pense que firstName pourrait être undefined
          //Avec ! : Tu dis à TypeScript "Ne t'inquiète pas, cette valeur est bien là"
          email: data.email,
          password: data.password,
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          city: data.city!,
        }

        const newUser = await signUp(userData)

        setUser(newUser)
      }

      if(type==='sign-in'){
        
        const response = await signIn({
          email: data.email,
          password : data.password
        })

        if(response) router.push('/')
        
      }

    } catch(error){

      console.log(error)

    } finally{

      setIsLoading(false)

    }
    
  }


  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href='/' className="cursor-pointer flex items-center gap-1">
            <Image 
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="Horizon logo"
            />
            <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
              Horizon
            </h1>
          </Link>

          <div className='flex flex-col gap-1 md:gap-3'>
            <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                {user
                    ? 'lier le compte'
                    : type === 'sign-in'
                        ? 'Se connecter'
                        : ' Creer un compte'
                }

                <p className='text-16 font-normal text-gray-600'>
                    {user
                       ? 'Liez votre compte pour commencer'
                       : 'Veuillez entrer vos informations' 
                    }
                </p>
            </h1>
          </div>

        </header>
            {user ? ( 
                <div className='flex flex-col gap-4'>
                    <PlaidLink user={user} variant="primary"/>
                </div>
            ):( 
                <>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {type === 'sign-up' && (
                          <>
                            <div className='flex gap-4'>

                              <CustomInput 
                                control={form.control} name='firstName' label="Nom(s)" placeholder="entrer votre nom"
                              />

                              <CustomInput 
                                control={form.control} name='lastName' label="Prenom(s)" placeholder="entrer votre prenom"
                              />

                            </div>
                            
                            <CustomInput 
                              control={form.control} name='address1' label="Adresse" placeholder="entrer votre adresse"
                            />

                            <CustomInput 
                              control={form.control} name='city' label="Ville" placeholder="entrer votre ville"
                            />

                            <div className='flex gap-4'>

                              <CustomInput 
                                control={form.control} name='state' label="Région" placeholder="Exemple: Analamanga"
                              />

                              <CustomInput 
                                control={form.control} name='postalCode' label="Code Postal" placeholder="Exemple: 501"
                              />

                            </div>
                            
                            <div className='flex gap-4'>

                              <CustomInput 
                                control={form.control} name='dateOfBirth' label="Date de Naissance" placeholder="Exemple: YYYY-MM-DD"
                              />

                              <CustomInput 
                                control={form.control} name='ssn' label="CIN" placeholder="Exemple: 896-784-201-001"
                              />

                            </div>
                            
                          </>
                        )}

                        <CustomInput 
                          control={form.control} name='email' label="Email" placeholder="entrer votre email"
                        />
                        <CustomInput 
                          control={form.control} name='password' label="Mot de passe" placeholder="entrer votre mot de passe"
                          
                        />

                        <div className='flex flex-col gap-4'>
                          <Button type="submit" disabled={isLoading} className='form-btn'>
                            {isLoading ? (
                              <>
                                <Loader2 size={20} className="animate-spin"/> &nbsp;
                                CHARGEMENT...
                              </>
                            ) : type === 'sign-in'
                              ? 'Se Connecter' : 'Enregistrer' }
                          </Button>
                        </div>
      
                      </form>
                    </Form>

                    <footer className='flex justify-center gap-1'>
                      <p className='text-14 font-normal text-gray-600'>
                        {type === 'sign-in'
                          ? "Vous n'avez pas de compte ?"
                          : "Vous avez déjà un compte ?"
                        }
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>

                          {type == 'sign-in' ? 'Créer un compte' : 'Se connecter'}

                        </Link>
                      </p>
                    </footer>
                </>
             )} 
    </section>
  )
}

export default AuthForm