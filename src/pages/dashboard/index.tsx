import 'tailwindcss/tailwind.css';
import { IoIosNotifications } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import Head from '@/components/Navbar';
import Panel from '@/components/Panel';


export default function Dashboard() {
    return (
        <div className='h-screen justify-center items-center'>
            <Head />
            <Panel />
        </div>
    )
}