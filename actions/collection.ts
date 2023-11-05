"use server"

import { currentUser } from "@clerk/nextjs";
import { createCollectionSchemaType } from "../schema/createCollection";
import prisma from "@/lib/prisma";
import { wait } from "@/lib/wait";

export async function createCollection(form: createCollectionSchemaType) {
    const user = await currentUser();

    if(!user) {
        throw new Error("User not found!") 
    }
    
    await wait(5000);

    return await prisma.collection.create({
        data: {
            userId: user.id,
            color: form.color,
            name: form.name
        }
    })
}

export async function deleteCollection(id: number) {
    const user = await currentUser();

    if(!user) {
        throw new Error("No user found. Please login or signup.")
    }

    
    return await prisma.collection.delete({
        where: {
            id: id
        }
    })
}
