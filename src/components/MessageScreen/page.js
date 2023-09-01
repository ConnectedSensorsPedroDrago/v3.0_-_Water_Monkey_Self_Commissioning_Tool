import Image from "next/image"
import User from "@/public/user.svg"
import Organization from '@/public/organization.svg'
import UserNotFound from "@/public/userNotFound.svg"
import OrgNotFound from '@/public/orgNotFound.svg'

const MessageScreen = ({text}) => {
  return (
    <div className={`${(text === "Choose a User" || text === "Choose an Organization") ? "hidden md:flex" : "flex"} w-full h-full flex flex-col items-center justify-center md:justify-start text-4xl font-semibold text-grey`}>
        <Image
          width={200}
          height={200}
          alt={`${text === "Choose a User" ? "User" : "Organization"}`}
          src={text === "Choose a User" ? User : text === "Choose an Organization" ? Organization : text === "User not found" ? UserNotFound : OrgNotFound}
          className="scale-75"
        />
        <p className="text-center">{text}</p>
    </div>
  )
}

export default MessageScreen