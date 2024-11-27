'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';

export async function resetPassword(token: string, newPassword: string) {
  // Here you would typically:
  // 1. Verify the token again (for extra security)
  // 2. Hash the new password
  // 3. Update the user's password in your database
  // 4. Invalidate the reset token

  // This is a placeholder implementation
  console.log(`New password: ${newPassword}`);

  // Simulate a delay
  axios
    .post(`http://localhost:5000/v1/auth/reset-password?token=${token}`, {
      password: newPassword,
    })
    .then(() => {
      console.log('Password reset successfully');
    })
    .catch((error) => {
      console.error('Error resetting password:', error);
    });

  // In a real application, you'd handle errors and return appropriate responses
  // For now, we'll just revalidate the path
  revalidatePath('/reset-password/[token]');
}
