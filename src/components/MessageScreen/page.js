import Image from "next/image"
import User from "@/public/user.svg"
import Organization from '@/public/organization.svg'
import UserNotFound from "@/public/userNotFound.svg"

const MessageScreen = ({text}) => {
  return (
    <div className="w-full h-full md:flex flex-col items-center justify-start text-4xl font-semibold text-grey hidden">
        <Image
          width={200}
          height={200}
          alt={`${text === "Choose a User" ? "User" : "Organization"} icon`}
          src={text === "Choose a User" ? User : text === "Choose an Organization" ? Organization : UserNotFound}
          className="scale-75"
        />
        <p>{text}</p>
    </div>
  )
}

export default MessageScreen