import 'tailwindcss/tailwind.css';
import Head from "@/components/Navbar";
import Panel from "@/components/Panel";
import Stats from '@/components/Stats';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/auth_store';
import { useEffect } from 'react';

export default function Analytic() {

    const router = useRouter();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push("/login");
    //     }
    // }, [isLoggedIn, router]);

    
    return (
        <div className='h-screen'>
            <Head />
            <div className="flex justify-between bg-ultralight_purple">
                <Panel />
                <div className="p-2 w-[80%]">
                    <Stats />
                </div>
            </div>
        </div>
    )
}