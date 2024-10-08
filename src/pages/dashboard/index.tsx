import 'tailwindcss/tailwind.css';
import { IoIosNotifications } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import Head from '@/components/Navbar';
import Panel from '@/components/Panel';
import Chart from '@/components/Chart';


export default function Dashboard() {
    return (
        <div className='h-screen'>
            <Head />
            <div className="flex ">
                <Panel />
                <Chart />
            </div>
        </div>
    )
}