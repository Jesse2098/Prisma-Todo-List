import Image from "next/image"
import Lime from "../../public/lime.png"

function Logo() {
  return (
    <div className="flex gap-3">
        <Image src={Lime} alt="Lemon Logo" width={30} height={30}/>
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent">
            Lemon
        </h1>
    </div>
  )
}

export default Logo