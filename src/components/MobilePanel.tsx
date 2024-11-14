import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import LogoutModal from "./LogoutModal";


export default function MobilePanel() {

    const [isModalOpen, setIsModalOpen] = useState(false); 
    const router = useRouter();

    const { pathname } = router;

    const handleLogout = () => {
        router.push("/login"); 
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-dark_purple h-[5%]">
            <div className="flex mx-24 justify-between gap-10 p-4">
                <div className={`${pathname === "/dashboard" ? "flex flex-col items-center text-white" : "flex flex-col items-center text-gray-500"}`} onClick={() => router.push("/dashboard")}>
                    <MdSpaceDashboard className="text-xl"/>
                    <p className="text-[8px]">DASHBOARD</p>
                </div>
                <div className={`${pathname === "/analytic" ? "flex flex-col items-center text-white" : "flex flex-col items-center text-gray-400"}`} onClick={() => router.push("/analytic")}>
                    <FaHistory className="text-xl"/>
                    <p className="text-[8px]">ANALYTIC</p>
                </div>
                <div
                    className={`${pathname === "/user" ? "flex flex-col items-center text-white" : "flex flex-col items-center text-gray-400"}`}
                    onClick={() => setIsModalOpen(true)} 
                >
                    <BsFillPersonLinesFill className="text-xl" />
                    <p className="text-[8px]">USER</p>
                </div>
            </div>
            <LogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogout={handleLogout} />
        </div>
    )
}