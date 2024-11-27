import Link from 'next/link';

export default function Home() {
  const links = [
    { name: 'Login/Logout System', path: '/login' },
    { name: 'Sign Up System', path: '/signup' },
    { name: 'Forgot Password System', path: '/forget-password' },
    { name: 'Password less Login System', path: '/password-less-login' },
  ];
  return (
    <div className="grid grid-cols-1 grid-rows-12 justify-center items-center w-full p-8 gap-4 justify-items-center">
      <h1 className="text-5xl font-bold col-span-1 row-span-1 justify-center items-center w-full flex pt-1">
        Welcome to Authentication System
      </h1>
      <div className="col-span-1 row-span-11 grid grid-cols-4 w-full gap-4 justify-items-center place-items-start items-start max-w-[90%]">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.path}
            className="mb-2 col-span-2 justify-center items-center flex w-full rounded-xl border p-7 py-12 max-w-[600px] hover:bg-gray-100 transition-all hover:text-black text-2xl"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
