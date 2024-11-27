'use client';

import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

export default function ForgetPassword() {
  const [verificationSent, setVerificationSent] = React.useState(false);

  const schema = z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email({ message: 'Invalid email address' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  });

  const sendVerification = (data: { email: string }) => {
    axios
      .post(
        'http://localhost:5000/v1/auth/forgot-password',
        {
          email: data.email,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setVerificationSent(true);
        toast({
          title: 'Success',
          description: 'Verification sent successfully',
        });
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.response.data.message,
        });
      });
  };

  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className="flex flex-col items-center justify-between w-full h-full gap-8 border-[1px] border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className="text-5xl font-bold mt-12">Forget Password</h1>
        <div className="w-[400px] border-[0.4px] border-gray-400/20" />
        <form
          className="flex flex-col gap-4 h-full w-full px-12  transition-all"
          onSubmit={handleSubmit(sendVerification)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-md">Email</label>
            <input
              type="email"
              className="rounded-lg bg-transparent border-[0.5px] p-2 focus:outline-none focus:border-orange-500"
              {...register('email')}
            />
          </div>
          <p
            className={`text-red-600 ${errors.email ? 'visible' : 'invisible'}`}
          >
            {errors.email?.message}
          </p>

          <div className="w-full flex justify-center p-4">
            <button
              className="rounded-xl border p-2 hover:bg-white hover:text-black transition-all"
              type="submit"
            >
              {verificationSent ? 'Resend Verification' : 'Send Verification'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
