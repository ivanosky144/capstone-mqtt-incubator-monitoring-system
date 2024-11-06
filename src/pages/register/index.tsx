import 'tailwindcss/tailwind.css';
import { AiOutlineMail } from "react-icons/ai";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BsPersonFill } from 'react-icons/bs';
import useAuthStore from '@/store/auth_store';
import { ToastContainer, toast } from 'react-toastify';

export default function Register() {

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const register = useAuthStore((state) => state.register);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
        router.push("/dashboard");
    }
}, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      username,
      email,
      password
    }
    try {
      await register(payload);
      toast('You are successfully logged in', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push('/login');
    } catch(err) {
      toast.warning(`${err}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-purple shadow-xl rounded-lg h-[75vh] w-[25vw]">
        <img src="/assets/baby-incubator.png" alt="" />
      </div>
      <div className="bg-white pt-2 px-8 pb-8  rounded-lg shadow-xl flex flex-col items-center h-[75vh] w-[25vw] justify-center">
        <div className="flex flex-col gap-1 mb-10 items-center">
            <h1 className="font-bold text-black text-3xl text-dark_purple">Create your first account on</h1>
            <img src="assets/inkubi-logo.jpeg" alt=""  className='w-32 h-48'/>
        </div>        
        <form className="space-y-4 w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <div className="flex items-center gap-2 p-3 bg-white_purple text-xl rounded-md">
              <BsPersonFill />
              <input
                type="username"
                id="username"
                className="w-full rounded-md p-3 bg-white_purple font-semibold outline-none text-xl"
                placeholder="Type your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-white_purple text-xl rounded-md">
              <AiOutlineMail />
              <input
                type="email"
                id="email"
                className="w-full rounded-md p-3 bg-white_purple font-semibold outline-none text-xl"
                placeholder="Type your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-white_purple text-xl rounded-md">
              <FaUnlockKeyhole />
              <input
                type="password"
                id="password"
                className="w-full rounded-md p-3 bg-white_purple font-semibold outline-none text-xl"
                placeholder="Type your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white rounded-2xl py-4 mt-10 bg-dark_purple font-bold hover:scale-105 flex justify-center"
          >
            REGISTER
          </button>
          <div className="flex justify-between">
            <span className='text-dark_purple font-semibold cursor-pointer'>Want to verify ?</span>
            <span className='text-dark_purple font-semibold cursor-pointer' onClick={() => router.push('/login')}>Already have an account ?</span>
          </div>
        </form>
      </div>
    </div>
  )
}
