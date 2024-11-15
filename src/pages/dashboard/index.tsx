import 'tailwindcss/tailwind.css';
import { IoIosNotifications } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import Head from '@/components/Navbar';
import Panel from '@/components/Panel';
import MobilePanel from '@/components/MobilePanel';
import Chart from '@/components/Chart';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/auth_store';
import { useEffect, useState } from 'react';



export default function Dashboard() {

    const [isMobile, setIsMobile] = useState<boolean>(false);

    // const router = useRouter();
    // const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push("/login");
    //     }
    // }, [isLoggedIn, router]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 740);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='h-screen'>
            {isMobile ? 
            <>
            <div className="flex flex-col">
                <Chart />
                <MobilePanel />
            </div>
            </> : 
            <>
                <Head />
                <div className="flex ">
                    <Panel />
                    <Chart />
                </div>
            </>}
        </div>
    )
}