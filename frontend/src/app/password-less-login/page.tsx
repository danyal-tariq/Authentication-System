'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';

export default function PasswordLessLoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();
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

  const onSubmit = (data: { email: string }) => {
    setOtpSent(false);
    setSending(true);
    setEmail(data.email);
    axios
      .post('http://localhost:5000/v1/auth/request-login-otp', {
        email: data.email,
      })
      .then((res) => {
        console.log(res.data);
        toast({
          title: 'Success',
          description: 'OTP sent successfully to your email',
          duration: 5000,
        });
        setOtpSent(true);
        setSending(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast({
          title: 'Error',
          description: err.response.data.message,
        });
        setOtpSent(false);
        setSending(false);
      });
  };

  const verifyOTP = () => {
    axios
      .post('http://localhost:5000/v1/auth/verify-login-otp', {
        email,
        otp: otp,
      })
      .then((res) => {
        toast({
          title: 'Success',
          description: 'OTP verified successfully',
          duration: 5000,
        });
        //save token to local storage
        localStorage.setItem('token', res.data.token);
        console.log(res.data);
        //store token in local storage
        localStorage.setItem('token', res.data.tokens.access.token);
        //store user in local storage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        //store refresh token in local storage
        localStorage.setItem('refreshToken', res.data.tokens.refresh.token);
        router.push('/welcome');
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast({
          title: 'Error',
          description: err.response.data.message,
        });
      });
  };

  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className=" px-16 w-full h-full gap-8 border-[1px] pt-12 flex flex-col items-center border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className=" text-5xl">OTP Based Login</h1>
        <form
          className="flex flex-col gap-4 w-full items-center h-full justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            disabled={otpSent}
          />
          <InputOTP
            maxLength={6}
            className="self-center"
            disabled={!otpSent}
            pattern="[0-9]*"
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {errors.email ? (
            <span className="text-red-500">{errors.email.message}</span>
          ) : (
            <br />
          )}
          {otpSent ? (
            <span className="text-gray-500 self-center">
              OTP expires in 10 minutes
            </span>
          ) : (
            ''
          )}
          <Button
            type="submit"
            className="w-full max-w-[200px] self-center"
            disabled={sending}
          >
            {otpSent ? 'Resend OTP' : 'Send OTP'}
          </Button>
          <Button
            type="button"
            className="w-full max-w-[200px] self-center"
            disabled={!otpSent || otp.length < 6}
            onClick={verifyOTP}
          >
            Verify OTP
          </Button>
        </form>
      </div>
    </main>
  );
}
