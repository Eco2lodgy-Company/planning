"use server"
import {z, ZodError} from "zod";

import { data } from "framer-motion/client";

const schemaLogin = z.object({
    email:z.string().email({
        message:"Entrez votre mail"
    }),
    password:z.string().min(6,{
        message:"Votre mot de passe doive avoir au moins 6 carateres"
    })
})
export async function loginAction(prevState:any, formData:FormData){
    console.log("hello from login action")
    // const fields = {
    //     email: formData.get("email"),
    //     password: formData.get("password"),
    // };

    const validatedFields = schemaLogin.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if(!validatedFields.success){
        return {
            ...prevState,
            ZodErrors:validatedFields.error.flatten().fieldErrors,
            message:"Verfier votre nom dútilisateur ou le mot de passe"
        }
    }
    return {
        ...prevState,
        data:"ok",
    }
}