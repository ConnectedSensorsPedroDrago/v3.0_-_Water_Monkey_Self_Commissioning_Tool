const UserTable = ({users, action}) => {

  return (
    <>
        <div className="w-full h-10 border-b-[0.5px] border-dark-grey mt-4 flex flex-row justify-between items-center pl-1 pr-1">
            <p className="font-light md:w-24 text-start">Username</p>
            {/* <p className="hidden lg:flex font-light w-16 text-start">Name</p> */}
            {/* <p className="hidden lg:flex font-light w-16 text-start">Surname</p> */}
            <p className="hidden lg:flex font-light md:w-28 text-start">Email</p>
            <p className="md:flex font-light md:w-24 text-start"></p>
        </div>
        {
            users &&
            users[0].map(user =>
                <div   
                    className="w-full border-b-[0.5px] border-dark-grey h-10 flex flex-row justify-between items-center hover:bg-light-purple cursor-pointer hover:font-semibold pl-1 pr-1"
                    key={user.id}
                >
                    <p className="md:w-24 text-start text-sm text-blue-hard">{user.username ? user.username : '-'}</p>
                    {/* <p className="hidden lg:flex w-16 text-start text-sm text-blue-hard">{user.firstName ? user.firstName : '-'}</p> */}
                    {/* <p className="hidden lg:flex w-16 text-start text-sm text-blue-hard">{user.lastName ? user.lastName : '-'}</p> */}
                    <p className="hidden lg:flex md:w-28 text-start text-sm text-blue-hard">{user.email ? user.email : '-'}</p>
                    <button 
                        className="md:w-24 text-start text-sm text-blue-hard font-bold underline cursor-pointer hover:text-light-purple"
                        onClick={()=> action(user)}
                    >
                        Edit
                    </button>
                </div>
            )
        }
    </>
  )
}

export default UserTable