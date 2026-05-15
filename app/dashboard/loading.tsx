import { Spinner } from "@/components/ui/spinner"

const Loading = () => {
  return (
    <div className='w-full bg-white/30
    
    flex gap-4 h-screen p-4 items-center justify-center'>
        {/* <div className='bg-gray-200 animate-pulse w-[30%] rounded-3xl h-screen'></div>
        <div className='bg-gray-200 animate-pulse w-full rounded-3xl h-screen'></div> */}
        <Spinner className="w-16 h-16" />
    </div>
  )
}

export default Loading;