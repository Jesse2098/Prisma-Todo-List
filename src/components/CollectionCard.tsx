"use client"

import { Collection, Task } from '@prisma/client'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { useMemo, useState, useTransition } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { CollectionColor, CollectionColors } from '@/lib/constants'
import { CaretDownIcon, CaretUpIcon, TrashIcon } from '@radix-ui/react-icons'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import PlusIcon from '../components/icons/PlusIcon'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { deleteCollection } from '../../actions/collection'
import { toast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import CreateTaskDialog from './CreateTaskDialog'
import TaskCard from './TaskCard'

interface Props {
    collection: Collection & {
        tasks: Task[];
    }

}


const CollectionCard = ({collection} : Props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
    const [isLoading, startTransition] = useTransition()

    const router = useRouter();
    const tasks = collection.tasks;

    const removeCollection = async () => {
        try {
            await deleteCollection(collection.id)
            toast({
                title:"Success",
                description:"Collection deleted successfully.",
                variant: "default"
            })
            router.refresh()
        } catch (error) {
            console.log("Error:" + error)
            toast({
                title:"Error",
                description:"Cannot delete collection.",
                variant: "destructive"
            })
        }
    }

    const tasksDone = useMemo(() => {
        return collection.tasks.filter(task => task.done).length
    }, [collection.tasks])
    const totalTasks = collection.tasks.length

    const progress = totalTasks === 0 ? 0 : (tasksDone/totalTasks) * 100 

  return (
    <>
        <CreateTaskDialog
            open={showCreateTaskModal}
            setOpen={setShowCreateTaskModal}
            collection={collection}
        />
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <Button 
                    variant={"outline"}
                    className={cn("flex w-full justify-between p-6", isOpen && "rounded-b-none",
                        CollectionColors[collection.color as CollectionColor]
                    )}
                >
                    <span className='text-white font-bold'>
                        {collection.name}   
                    </span>
                    {!isOpen && <CaretDownIcon className='h-6 w-6'/>}
                    {isOpen && <CaretUpIcon className='h-6 w-6'/>}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg'>
                {tasks.length === 0 && (
                    <Button 
                        variant={'ghost'}
                        className='flex items-center jsutify-center gap-1 p-8 py-12 rounded-none'
                        onClick={() => setShowCreateTaskModal(true)}
                    >
                        <p>There are no tasks yet:</p>
                        <span className={cn(
                            "text-sm bg-clip-text text-transparent",
                            CollectionColors[collection.color as CollectionColor]
                        )}>Create one</span>
                    </Button>
                )}
                {tasks.length > 0 && (
                    <>
                        <Progress className='rounded-none' value={progress}/>
                        <div>
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task}/>
                            ))}
                        </div>
                    </>
                )}
                <Separator/>
                <footer className='h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center'>
                    <p>Created at {collection.createdAt.toLocaleDateString("en-UK")}</p>
                    {isLoading && <div>Deleting...</div>}
                    {!isLoading && (
                        <div>
                        <Button size={"icon"} variant={"ghost"} onClick={() => setShowCreateTaskModal(true)}>
                            <PlusIcon/>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size={"icon"} variant={"ghost"}>
                                    <TrashIcon/>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will permanently delete this collection.
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                                startTransition(removeCollection);
                                        }}
                                    >
                                        Proceed
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    )}
                    
                </footer>
            </CollapsibleContent>
        </Collapsible>
    </>
    
  )
}

export default CollectionCard