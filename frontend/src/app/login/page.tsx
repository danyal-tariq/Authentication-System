'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, 'Email is required'),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit = (data: { email: string; password: string }) => {
    api
      .post('/auth/login', {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        //save token to cookie
        Cookies.set('token', res.data.tokens.access.token, {
          expires: new Date(res.data.tokens.access.expires),
        });
        //save user to cookie
        Cookies.set('user', JSON.stringify(res.data.user));
        //save refresh token to cookie
        Cookies.set('refreshToken', res.data.tokens.refresh.token, {
          expires: new Date(res.data.tokens.refresh.expires),
        });

        router.push('/welcome');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Error',
          description: err.response.data.message,
        });
      });
  };

  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className="flex flex-col items-center justify-between w-full h-full gap-8 border-[1px] border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className="text-5xl font-bold mt-12">Login</h1>
        <div className="w-[400px] border-[0.4px] border-gray-400/20" />
        <form
          className="flex flex-col gap-4 h-full w-full px-12  transition-all"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-md">Email</label>
            <input
              type="email"
              defaultValue={''}
              {...register('email')} // register an input
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
            />
          </div>
          <p
            className={`text-red-600 ${errors.email ? 'visible' : 'invisible'}`}
          >
            {errors.email?.message}
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-md">Password</label>
            <input
              type="password"
              defaultValue={''}
              {...register('password')} // register an input
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
            />
          </div>
          <p
            className={`text-red-600 ${
              errors.password ? 'visible' : 'invisible'
            }`}
          >
            {errors.password?.message}
          </p>
          <label>
            <input
              type="checkbox"
              className=" appearance-auto accent-orange-600 rounded-full size-4 cursor-pointer bg-red-100 border-red-300 text-red-600 focus:ring-red-200 checked:bg-red-600 checked:border-red-600 checked:text-red-100"
            />{' '}
            Remember me
          </label>
          <a href="/forget-password" className="underline text-orange-500">
            Forgot Password?
          </a>
          <p>
            Don&apos;t have an account?{' '}
            <a href="/signup" className="underline text-orange-500">
              Sign Up
            </a>
          </p>

          <button
            type="submit"
            className="border max-w-[200px] self-center px-8 py-2 rounded-lg text-white hover:bg-white hover:text-black hover:border-black transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
