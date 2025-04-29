'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  LogOut,
  User,
  MessageSquare,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        return;
      }
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Placeholder chat history data - replace with actual data later
  const chatHistory = [
    { id: '1', title: 'Marketing campaign ideas', date: '2 hours ago' },
    { id: '2', title: 'Product description for new launch', date: 'Yesterday' },
    { id: '3', title: 'Content strategy for Q3', date: 'Mar 28' },
  ];

  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'User Profile',
      href: '/profile',
      icon: (
        <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ] as const;

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push('/sign-in');
        return;
      }

      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/sign-in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <hr className="my-4" />
            <div className="flex flex-col gap-2">
              {open && (
                <h3 className="text-sm font-medium text-neutral-500 px-3 mb-1">
                  Recent chats
                </h3>
              )}
              {chatHistory.length > 0 ? (
                chatHistory.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/dashboard/chat/${chat.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-neutral-500" />
                    {open ? (
                      <div className="flex flex-col truncate">
                        <span className="truncate">{chat.title}</span>
                        <span className="text-xs text-neutral-500">
                          {chat.date}
                        </span>
                      </div>
                    ) : (
                      <span className="sr-only">{chat.title}</span>
                    )}
                  </Link>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-neutral-500 italic">
                  {open ? (
                    'No previous chats'
                  ) : (
                    <span className="sr-only">No previous chats</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Persona AI
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
