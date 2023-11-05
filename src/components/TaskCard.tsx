'use client'

import { Task } from "@prisma/client"
import { Checkbox } from "./ui/checkbox"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useTransition } from "react"
import { setTaskToDone } from "../../actions/task"
import { useRouter } from "next/navigation"

interface Props {
    task: Task
}

function getExpirationColor(expiresAt: Date) {
    const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 /60 /60;

    if(days < 0) {
        return "text-gray-500 dark:text-gray-300"
    }
    if(days <= 3 * 24) {
        return "text-red-500 dark:text-red-400";
    }
    if(days <= 7 * 24) {
        return "text-orange-500 dark:text-orange-400";
    }
    return "text-green-500 dark:text-green-400";
}

const TaskCard = (
    {task} : Props
) => {

    const {collectionId,content,createdAt,done,expiresAt,id,userId} = task;

    const [isLoading, startTransition] = useTransition()
    const router = useRouter();

  return (
    <div className="flex gap-2 items-start">
        <Checkbox className="w-5 h-5" checked={done} disabled={done || isLoading} id={id.toString()} onCheckedChange={() => {
            startTransition(async () => {
                await setTaskToDone(id)
                router.refresh()
            })
        }}/>
        <label htmlFor={id.toString()} className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white", done && "line-through"
        )}>
            {content}
            {expiresAt && (
                <p className={cn(
                    "text-xs text-neutral-500 dark:text-neutral-400",
                    getExpirationColor(expiresAt)
                )}>
                    {format(expiresAt, "dd/MM/yyyy")}
                </p>
            )}
        </label>
    </div>
  )
}

export default TaskCard