import 'tailwindcss/tailwind.css';
import { IoIosNotifications } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";


export default function Dashboard() {
    return (
        <div className='min-h-screen justify-center items-center'>
            <div className="px-20 py-6 flex justify-between bg-dark_purple items-center">
                <h1 className='font-bold text-4xl text-white'>Inkubi</h1>
                <div className="flex gap-10">
                    <IoIosNotifications className='text-3xl text-white'/>
                    <BsPersonCircle className='text-3xl font-semibold text-white'/>
                </div>
            </div>
            <div className="flex">
                <div className="p-6 flex flex-col gap-5 mt-10 w-[20%] shadow-sm">
                    <div className="flex gap-5 items-center text-xl hover:bg-gray-100 p-2 rounded-md cursor-pointer hover:text-purple">
                        <MdSpaceDashboard className='text-gray-500'/>
                        <h2 className='font-semibold text-gray-500'>Dashboard</h2>
                    </div>
                    <div className="flex gap-5 items-center text-xl hover:bg-gray-100 p-2  rounded-md cursor-pointer hover:text-purple">
                        <FaHistory className='text-gray-500'/>
                        <h2 className='font-semibold text-gray-500'>History</h2>
                    </div>
                    <div className="flex gap-5 items-center text-xl hover:bg-gray-100 p-2 rounded-md cursor-pointer hover:text-purple">
                        <BsFillPersonLinesFill className='text-gray-500'/>
                        <h2 className='font-semibold text-gray-500'>User</h2>
                    </div>
                    <div className="flex gap-5 items-center text-xl hover:bg-gray-100 p-2 rounded-md cursor-pointer hover:text-purple">
                        <h2 className='font-semibold text-gray-500'>Logout</h2>
                    </div>
                </div>
                <div className="bg-gray-50 w-[80%]">
                </div>
            </div>
        </div>
    )
}