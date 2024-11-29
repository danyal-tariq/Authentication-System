import { PasswordResetForm } from './password-reset-form';
import Link from 'next/link';
import api from '@/lib/axios';

interface PageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({ params }: PageProps) {
  // Here you would typically verify the token
  // This is a placeholder for token verification
  const { token } = await params;
  const isValidToken = await verifyToken(token);

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col flex gap-3 m-4">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">
            Invalid or Expired Token
          </h1>
          <p className="text-center text-gray-600">
            The password reset link is invalid or has expired. Please request a
            new password reset link.
          </p>
          <Link href="/forget-password">
            <p className="rounded-xl bg-black text-white text-center p-2">
              Request Again
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return <PasswordResetForm token={token} />;
}

// Placeholder function for token verification
async function verifyToken(token: string): Promise<boolean> {
  console.log('Verifying token:', token.split('=')[0]);
  try {
    await api.post(`/auth/verify-reset-token?token=${token}`, {});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }

  return true;
}
