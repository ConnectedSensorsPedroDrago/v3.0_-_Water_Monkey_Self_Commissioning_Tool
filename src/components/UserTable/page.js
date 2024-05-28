const UserTable = ({users, action, seeUser}) => {

  return (
    <>
        <div className="w-full h-10 border-b-[0.5px] border-dark-grey mt-4 flex flex-row justify-between items-center pl-1 pr-1">
            <p className="font-light md:w-fukk text-start">Username</p>
            <p className="hidden lg:flex font-light md:w-full text-start">Email</p>
            <p className="md:flex font-light md:w-24 text-start"></p>
        </div>
        {
            users &&
            users[0].map(user =>
                <div   
                    className="w-full border-b-[0.5px] border-dark-grey h-10 flex flex-row grow justify-between items-center hover:bg-light-purple cursor-pointer hover:font-semibold pl-1 pr-1 "
                    key={user.id}
                >
                    <p 
                        className="md:w-full text-start text-sm text-blue-hard"
                        onClick={()=> seeUser(user.id)}
                    >
                        {user.username ? user.username : '-'}
                    </p>
                    <p className="hidden lg:flex md:w-full text-start text-sm text-blue-hard">{user.email ? user.email : '-'}</p>
                    <button 
                        className="md:w-24 text-start text-sm text-blue-hard font-bold underline cursor-pointer hover:text-light-purple"
                        onClick={()=> action(user.username)}
                    >
                        Remove
                    </button>
                </div>
            )
        }
    </>
  )
}

export default UserTable