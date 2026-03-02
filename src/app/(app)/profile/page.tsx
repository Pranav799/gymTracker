"use client";

import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="p-6 space-y-6 pt-12 relative overflow-hidden">
      <div className="space-y-4">
        <div className="w-24 h-24 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-3xl shadow-lg">
          P
        </div>
        <h2 className="text-[34px] font-extrabold tracking-[-0.03em] leading-none">
          Pranav
        </h2>
        <p className="text-gray-500 font-medium">Fitness Enthusiast</p>
      </div>

      <div className="card-soft mt-8 space-y-4">
         <h3 className="font-semibold text-lg">Settings</h3>
         <button 
           onClick={handleLogout}
           className="pill-button-primary bg-[#FF3B30] text-white hover:bg-red-600 border-0"
         >
           Log Out
         </button>
      </div>
    </div>
  );
}
