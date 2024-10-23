import 'tailwindcss/tailwind.css';
import Head from "@/components/Navbar";
import Panel from "@/components/Panel";
import Stats from '@/components/Stats';

export default function Analytic() {
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