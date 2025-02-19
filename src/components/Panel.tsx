import { useRouter } from "next/router";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

export default function Panel() {

    const router = useRouter();
    const { pathname } = router;
    

    return (
            <div className="left-0 p-6 md:flex flex-col gap-10 w-[20%] shadow-sm h-screen bg-ultralight_purple justify-center">
                <div 
                    className="flex gap-5 items-center text-md hover:bg-gray-100 p-2 rounded-md cursor-pointer hover:text-purple"
                    onClick={() => router.push("/dashboard")}
                >
                <MdSpaceDashboard className={`${pathname === "/dashboard" ? 'text-dark_purple' : 'text-gray-500'}`}/>
                <h2 className={`font-semibold ${pathname === "/dashboard" ? 'text-dark_purple' : 'text-gray-500'}`}>DASHBOARD</h2>
                </div>
                <div 
                    className="flex gap-5 items-center text-md hover:bg-gray-100 p-2  rounded-md cursor-pointer hover:text-purple"
                    onClick={() => router.push("/analytic")}
                >
                    <FaHistory className={`${pathname === "/analytic" ? 'text-dark_purple' : 'text-gray-500'}`}/>
                    <h2 className={`font-semibold ${pathname === "/analytic" ? 'text-dark_purple' : 'text-gray-500'}`}>ANALYTIC</h2>
                </div>
            </div>
    )
}