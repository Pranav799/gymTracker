"use client";

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Activity } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setError('Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.refresh(); // Middleware handles the redirect to '/'
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto bg-background min-h-screen text-foreground relative overflow-hidden flex flex-col justify-center p-6">
      <div className="space-y-8 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-2 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center mb-4 shadow-xl">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-[34px] font-extrabold tracking-tight leading-none">
            GymTracker
          </h1>
          <p className="text-gray-500 font-medium">Log into your fitness journey.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#f2f4f7] dark:bg-[#1c1c1e] text-foreground rounded-2xl px-5 py-4 font-medium outline-none border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#f2f4f7] dark:bg-[#1c1c1e] text-foreground rounded-2xl px-5 py-4 font-medium outline-none border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white transition-colors"
            />
          </div>

          {error && <p className="text-[#FF3B30] text-sm font-semibold text-center">{error}</p>}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="pill-button-primary disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm font-semibold text-gray-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-black dark:text-white underline underline-offset-4"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
