'use client';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Cookie from 'js-cookie';
import api from '@/lib/axios';

export default function Welcome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const userObjectRef = useRef(getUserObject());
  const user = userObjectRef.current ? userObjectRef.current.name : 'User';
  const email = userObjectRef.current ? userObjectRef.current.email : 'Email';
  const [apiCallInProgress, setApiCallInProgress] = useState(false);

  const logOut = () => {
    setApiCallInProgress(true);
    api
      .post('/auth/logout', {
        refreshToken: Cookie.get('refreshToken') || '',
      })
      .then((res) => {
        console.log(res.data);
        removeCache();
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
        removeCache();
        router.push('/');
      })
      .finally(() => {
        setApiCallInProgress(false);
      });
  };

  useEffect(() => {
    if (!mounted) return;
    setApiCallInProgress(true);
    if (!userObjectRef.current) {
      showToast('Error', 'You are not logged in', 'bg-red-500');
      router.replace('/');
    } else {
      const userID = userObjectRef.current?.id;
      if (!userID) {
        showToast('Error', 'User not found', 'bg-red-500');
        router.replace('/');
        return;
      }
      api
        .get(`/users/${userID}`)
        .then((res) => {
          const user = res.data;
          //save user to cookie
          Cookie.set('user', JSON.stringify(user));
          //set user object
          userObjectRef.current = user;
        })
        .catch((err) => {
          console.log(err);
          showToast('Error', 'Session Expired', 'bg-red-500');
          router.replace('/');
        })
        .finally(() => {
          setApiCallInProgress(false);
        });
    }
  }, [mounted, router, userObjectRef]);

  if (!mounted) return null;
  function toggle2FA(user: { id: string; twoFactorEnabled: boolean }): void {
    setApiCallInProgress(true);
    api
      .post('/users/toggleTwoFactor', {
        userId: user.id,
      })
      .then((res) => {
        const action = user.twoFactorEnabled ? 'disabled' : 'enabled';
        showToast('Success', `2FA ${action}`, 'bg-green-500');
        userObjectRef.current = {
          ...userObjectRef.current,
          twoFactorEnabled: res.data.twoFactorEnabled,
        };
      })
      .catch((err) => {
        console.log(err);
        const action = user.twoFactorEnabled ? 'disable' : 'enable';
        showToast('Error', `Failed to ${action} 2FA`, 'bg-red-500');
      })
      .finally(() => {
        setApiCallInProgress(false);
      });
  }

  return (
    <main className=" justify-items-center items-center h-dvh p-4">
      <div className="flex flex-col items-center justify-start w-full h-full gap-8 border-[1px] border-gray-400/20 self-center max-w-[700px] max-h-[800px] rounded-xl">
        <h1 className="text-5xl font-bold mt-12">Welcome</h1>
        <h2 className="text-2xl font-bold mt-12 text-center">
          You are logged in as <br /> {user} : {email}
        </h2>
        <div className="w-[400px] border-[0.4px] border-gray-400/20" />
        {/* add enable 2fa */}
        <button
          className="flex flex-col gap-2 justify-self-end border border-green-500 p-2 rounded-lg hover:bg-green-500 hover:text-white transition-all"
          onClick={() => toggle2FA(userObjectRef.current)}
        >
          <label className="text-md">
            {userObjectRef.current?.twoFactorEnabled
              ? 'Disable 2FA'
              : 'Enable 2FA'}
          </label>
        </button>
        {/* log out button*/}
        <button
          className="flex flex-col gap-2 justify-self-end border border-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          onClick={logOut}
        >
          <label className="text-md">Log Out</label>
        </button>
      </div>
    </main>
  );
}

function getUserObject() {
  if (typeof window !== 'undefined') {
    const userObject = Cookie.get('user');
    return userObject ? JSON.parse(userObject) : null;
  }
  return null;
}

function removeCache() {
  Cookie.remove('token');
  Cookie.remove('user');
  Cookie.remove('refreshToken');
}

function showToast(title: string, description: string, className: string) {
  toast({
    title,
    description,
    className,
    duration: 5000,
  });
}
