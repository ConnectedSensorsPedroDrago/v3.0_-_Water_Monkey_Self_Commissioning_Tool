const OrganizationsTable = ({organizations, action, userId}) => {
    console.log(organizations)
  return (
    <div className="mt-4">
        {
            organizations &&
            organizations.map(org =>
                org.users[0].some(({id}) => id === userId) &&
                <div 
                    className="w-full border-b-[0.5px] border-dark-grey h-10 flex flex-row justify-between items-center hover:bg-light-purple cursor-pointer hover:font-semibold pl-1 pr-1"
                    key={org.id}
                >
                    <p className="md:w-full text-start text-sm text-blue-hard">{org.name ? org.name : '-'}</p>
                    <button 
                        className="md:w-24 text-start text-sm text-blue-hard font-bold underline cursor-pointer hover:text-light-purple"
                        onClick={()=> action(org)}
                    >
                        Remove
                    </button>
                </div>
            )
        }
    </div>
  )
}

export default OrganizationsTable