import LoaderBig from '@/public/loaderBig.svg'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className="z-20 absolute flex flex-col items-center justify-around mb-20 opacity-50 w-screen h-screen bg-white bg-opacity-80">
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