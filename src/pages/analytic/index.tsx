import 'tailwindcss/tailwind.css';
import Head from "@/components/Navbar";
import Panel from "@/components/Panel";
import Stats from '@/components/Stats';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/auth_store';
import { useEffect, useState } from 'react';
import MobilePanel from '@/components/MobilePanel';

export default function Analytic() {

    const [isMobile, setIsMobile] = useState<boolean>(false);


    const router = useRouter();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

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
                    <Stats />
                    <MobilePanel />
                </div>
            </> : 
            <>
                <Head />
                <div className="flex justify-between bg-ultralight_purple">
                    <Panel />
                    <div className="p-2 w-[80%]">
                        <Stats />
                    </div>
                </div>
            </>}
        </div>
    )
}