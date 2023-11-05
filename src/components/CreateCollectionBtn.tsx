"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import Sidebar from "./Sidebar";

const CreateCollectionBtn = () => {
    const [open, setOpen] = useState(false);

    //function to handle sidebar logic
    const handleOpenChange = (open:boolean) => setOpen(open)

  return (
    <div className="w-full rounded-md bg-gradient-to-r from-green-400 via-yellow-200 to-lime-800 p-[1px] ">
        <Button variant={"outline"} className="dark:text-white w-full dark:bg-neutral-950 bg-white"
        onClick={() => setOpen(true)}>
            <span className="bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent hover:to-lime-600">Create Collection</span>
    </Button>
    <Sidebar open={open} onOpenChange={handleOpenChange}/>
    </div>
  )
}

export default CreateCollectionBtn