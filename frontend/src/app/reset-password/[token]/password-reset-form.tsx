'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { resetPassword } from './actions';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
interface PasswordResetFormProps {
  token: string;
}
export function PasswordResetForm({ token }: PasswordResetFormProps) {
  const schema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(schema),
  });

  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const submit = async (data: { password: string }) => {
    resetPassword(token, data.password)
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.response.data.message,
        });
      });
  };

  if (success) {
    return (
      <Alert className="max-w-md mx-auto mt-8">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your password has been reset successfully. You will be redirected to
          the login page shortly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-md w-full p-6  rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: true, minLength: 8 })}
            />
          </div>
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { required: true, minLength: 8 })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600">{errors.confirmPassword.message}</p>
          )}
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
