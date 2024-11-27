'use client';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();
  const userObject = localStorage.getItem('user');
  const user = userObject ? JSON.parse(userObject).name : 'User';
  const email = userObject ? JSON.parse(userObject).email : 'Email';
  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className="flex flex-col items-center justify-start w-full h-full gap-8 border-[1px] border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className="text-5xl font-bold mt-12">Welcome</h1>
        <h2 className="text-2xl font-bold mt-12 text-center">
          You are logged in as <br /> {user} : {email}
        </h2>
        <div className="w-[400px] border-[0.4px] border-gray-400/20" />
        {/* log out button*/}
        <button
          className="flex flex-col gap-2 justify-self-end border border-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          onClick={() => {
            //
          }}
        >
          <label className="text-md">Log Out</label>
        </button>
      </div>
    </main>
  );
}
