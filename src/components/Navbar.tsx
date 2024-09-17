import { BsPersonCircle } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";

export default function Head() {
    return (
        <div className="px-20 py-6 flex justify-between bg-dark_purple items-center">
            <h1 className='font-bold text-4xl text-white'>Inkubi</h1>
            <div className="flex gap-10">
                <IoIosNotifications className='text-3xl text-white'/>
                <BsPersonCircle className='text-3xl font-semibold text-white'/>
            </div>
        </div>
    )
}