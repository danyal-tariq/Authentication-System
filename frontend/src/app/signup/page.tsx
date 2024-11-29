'use client';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Cookie from 'js-cookie';
import api from '@/lib/axios';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export default function Login() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    api
      .post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        console.log(res.data);
        //store token in local storage
        Cookie.set('token', res.data.tokens.access.token, {
          expires: new Date(res.data.tokens.access.expires),
        });
        Cookie.set('user', JSON.stringify(res.data.user));
        Cookie.set('refreshToken', res.data.tokens.refresh.token, {
          expires: new Date(res.data.tokens.refresh.expires),
        });

        router.push('/welcome');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'An error occurred',
          description: err.response.data.message,
          duration: 5000,
          variant: 'destructive',
        });
      });
  };

  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className="flex flex-col items-center justify-between w-full h-full gap-8 border-[1px] border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className="text-5xl font-bold mt-12">Sign Up</h1>
        <div className="w-[400px] border-[0.4px] border-gray-400/20" />
        <form
          className="flex flex-col gap-1 h-full w-full px-12  transition-all"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-md">Name</label>
            <input
              type="text"
              defaultValue={''}
              {...register('name')} // register an input
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
            />
            <p
              className={`text-red-600 ${
                errors.name ? 'opacity-100' : 'opacity-0'
              } text-[11px]`}
            >
              {errors.name?.message ?? '-'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-md">Email</label>
            <input
              type="email"
              defaultValue={''}
              {...register('email')} // register an input
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
            />
            <p
              className={`text-red-600 ${
                errors.email ? 'visible' : ' invisible'
              } text-[11px]`}
            >
              {errors.email?.message ?? '-'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-md">Password</label>
            <input
              type="password"
              defaultValue={''}
              {...register('password')} // register an input
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
            />
            <p
              className={`text-red-600 ${
                errors.password ? 'visible' : 'invisible'
              } text-[11px]`}
            >
              {errors.password?.message ?? '-'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-md">Confirm Password</label>
            <input
              type="password"
              defaultValue={''}
              {...register('confirmPassword')} // register an input
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
            />
            <p
              className={`text-red-600 ${
                errors.confirmPassword ? 'visible' : 'invisible'
              } text-[11px]`}
            >
              {errors.confirmPassword?.message ?? '-'}
            </p>
          </div>

          <p>
            Already have an account?{' '}
            <a href="/login" className="underline text-orange-500">
              Login
            </a>
          </p>

          <button
            type="submit"
            className="border max-w-[200px] self-center px-8 py-2 mt-10 rounded-lg text-white hover:bg-white hover:text-black hover:border-black transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
