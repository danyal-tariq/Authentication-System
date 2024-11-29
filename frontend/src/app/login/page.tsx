'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { InputOTP } from '@/components/ui/input-otp';
import { InputOTPSlot } from '@/components/ui/input-otp';
import { InputOTPGroup } from '@/components/ui/input-otp';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, 'Email is required'),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOTP] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onLoginSubmit = (data: { email: string; password: string }) => {
    setEmail(data.email);
    setIsLoading(true);
    api
      .post('/auth/login', {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        if (res.status == 202) {
          setOtpSent(true);
          toast({
            title: 'Success',
            description: 'OTP sent to your email',
          });
          setIsLoading(false);
        } else if (res.status == 200) {
          // Store tokens securely and redirect to the dashboard
          setCookiesAndRedirect(res, router);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'Invalid email or password',
        });
      });
  };
  const onOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!otp) {
      toast({ title: 'Error', description: 'OTP is required' });
      setIsLoading(false);
      return;
    }

    if (otp.length !== 6) {
      toast({ title: 'Error', description: 'OTP must be 6 digits' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/verify-login-otp', { email, otp });

      //save token to cookie
      setCookiesAndRedirect(res, router);

      toast({ title: 'Success', description: 'OTP verified successfully' });
      // Handle successful login (e.g., save tokens, navigate to dashboard)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({ title: 'Error', description: error.response.data.message });
      setOTP('');
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className="flex flex-col items-center justify-stretch w-full h-full gap-8 border-[1px] border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className="text-5xl font-bold mt-12 justify-self-start">Login</h1>
        <div className="w-[400px] border-[0.4px] border-gray-400/20 max-h-[10px]" />
        {otpSent ? (
          <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-foreground">
              Enter OTP
            </h1>
            <p className="text-center text-muted-foreground">
              Please enter the 6-digit code sent to your device.
            </p>
            <form onSubmit={onOTPSubmit} className="space-y-6">
              <InputOTP value={otp} onChange={setOTP} maxLength={6}>
                <InputOTPGroup className="flex items-center justify-center w-full">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4 h-full w-full px-12  transition-all"
            onSubmit={handleSubmit(onLoginSubmit)}
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
              className={`text-red-600 ${
                errors.email ? 'visible' : 'invisible'
              }`}
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
              disabled={isLoading}
              className="border max-w-[200px] self-center px-8 py-2 rounded-lg text-white hover:bg-white hover:text-black hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed "
            >
              Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
function setCookiesAndRedirect(
  res: {
    data: {
      tokens: {
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
      };
      user: object;
    };
  },
  router: AppRouterInstance | string[]
) {
  Cookies.set('token', res.data.tokens.access.token, {
    expires: new Date(res.data.tokens.access.expires),
  });
  //save user to cookie
  Cookies.set('user', JSON.stringify(res.data.user));
  //save refresh token to cookie
  Cookies.set('refreshToken', res.data.tokens.refresh.token, {
    expires: new Date(res.data.tokens.refresh.expires),
  });

  setTimeout(() => {
    router.push('/welcome');
  }, 1000);
}
