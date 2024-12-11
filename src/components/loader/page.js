import LoaderBig from '@/public/loaderBig.svg'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className="fixed top-0 w-full h-full flex flex-col justify-center items-center opacity-50 bg-white bg-opacity-80 z-1000">
        <Image
            src={LoaderBig}
            alt="Loader small"
            className="scale-[250%]"
            priority={true}
        />
    </div>
  )
}

export default Loader