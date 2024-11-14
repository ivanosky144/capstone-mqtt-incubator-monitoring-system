import { useRouter } from "next/router";
import { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import LogoutModal from "./LogoutModal";

export default function Head() {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const router = useRouter();

    const handleLogout = () => {
        router.push("/login"); 
    };


    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-20 py-6 md:flex justify-between bg-dark_purple items-center hidden h-[15%]">
            <h1 className='font-bold text-3xl text-white'>Inkubi</h1>
            <div className="flex gap-10">
                <IoIosNotifications className='text-2xl text-white'/>
                <BsPersonCircle className='text-2xl font-semibold text-white cursor-pointer' onClick={() => setIsModalOpen(true)} />
            </div>

            <LogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogout={handleLogout} />
        </div>
    )
}