'use server'

import { currentUser } from "@clerk/nextjs";
import { createTaskSchemaType } from "../schema/createTask";
import prisma from "@/lib/prisma";

export async function createTask(data: createTaskSchemaType) {

    const user = await currentUser()

    if(!user) {
        throw new Error("User has not been found")
    }

    const {collectionId,content,expiresAt} = data;

    return await prisma.task.create({
        data: {
            userId: user.id,
            content,
            expiresAt,
            Collection: {
                connect: {
                    id: collectionId,
                }
            }
        }
    })
} 

export async function setTaskToDone(id: number) {
    const user = await currentUser()

    if(!user) {
        throw new Error("User has not been found")
    }
    
    return await prisma.task.update({
        where: {
            id: id,
            userId: user.id,
        },
        data: {
            done: true,
        }
    })

}