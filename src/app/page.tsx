'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './ThemeProvider';

export default function Home() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activePreview, setActivePreview] = useState<'linkedin' | 'twitter'>(
    'linkedin'
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Subscription error:', error);
      // Optionally add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Header - Semi-transparent, becomes solid on scroll */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? theme === 'dark'
              ? 'bg-black/90 backdrop-blur-md'
              : 'bg-white/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-accent">Persona AI</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-accent transition-colors">
              Features
            </a>
            <a
              href="#platforms"
              className="hover:text-accent transition-colors"
            >
              Platforms
            </a>
            <motion.a
              href="#waitlist"
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist
            </motion.a>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="pt-28 pb-20 min-h-screen flex items-center w-full bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-accent/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Transform Raw Ideas Into{' '}
              <span className="text-accent">Platform-Perfect</span> Content
            </h1>
            <p className="text-xl text-foreground/80 mb-8 max-w-xl">
              Persona AI helps busy entrepreneurs effortlessly format and
              publish content across social media platforms with one click. Save
              time, increase engagement, and grow your audience.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.a
                href="#waitlist"
                className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition duration-300 text-center"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(255, 84, 0, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                Join the Waitlist
              </motion.a>
              <motion.a
                href="#features"
                className={`${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-black/5 hover:bg-black/10'
                } text-foreground font-semibold px-8 py-4 rounded-lg transition duration-300 text-center border border-accent/20`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="w-full max-w-md">
              {/* Platform tabs */}
              <div className="flex mb-4 border-b border-accent/20">
                <motion.button
                  onClick={() => setActivePreview('linkedin')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activePreview === 'linkedin'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  LinkedIn
                </motion.button>
                <motion.button
                  onClick={() => setActivePreview('twitter')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activePreview === 'twitter'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  Twitter
                </motion.button>
              </div>

              {/* Preview Card with Animation */}
              <AnimatePresence mode="wait">
                {activePreview === 'linkedin' ? (
                  <motion.div
                    key="linkedin"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`${
                      theme === 'dark'
                        ? 'bg-[#1b1f23] text-white'
                        : 'bg-white text-black'
                    } rounded-lg overflow-hidden shadow-2xl border ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}
                  >
                    {/* LinkedIn Header */}
                    <div
                      className={`${
                        theme === 'dark' ? 'bg-[#283e4a]' : 'bg-[#0a66c2]'
                      } p-3 flex items-center`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0a66c2] font-semibold text-lg mr-3 border border-gray-200">
                        <img
                          src="https://i.pravatar.cc/100?img=12"
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">Julia Chen</div>
                        <div className="text-white/70 text-sm flex items-center">
                          <span>Product Marketing • 2nd</span>
                          <span className="mx-1">•</span>
                          <span>2h</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div
                      className={`p-4 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}
                    >
                      <p className="mb-4">
                        Excited to announce that Persona AI will be launching
                        soon! Our platform helps busy entrepreneurs create
                        professional content for multiple social media platforms
                        with just one click. ✨
                      </p>
                      <p
                        className={`font-semibold ${
                          theme === 'dark' ? 'text-blue-400' : 'text-[#0a66c2]'
                        }`}
                      >
                        #ContentCreation #SocialMedia #AI #Productivity
                      </p>
                    </div>

                    {/* Image */}
                    <div className="border-t border-b border-gray-200 dark:border-gray-700">
                      <div className="aspect-video bg-gradient-to-r from-accent/20 to-accent/30 flex items-center justify-center">
                        <div className="text-center p-6">
                          <svg
                            className="w-12 h-12 text-accent mx-auto mb-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                          </svg>
                          <p className="text-accent font-semibold">
                            Create content that performs
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Engagement */}
                    <div
                      className={`px-4 py-3 flex items-center justify-between ${
                        theme === 'dark'
                          ? 'border-t border-gray-800 text-gray-400'
                          : 'border-t border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-sm">
                        <span className="flex items-center gap-0.5">
                          <span className="text-blue-600">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z" />
                            </svg>
                          </span>
                          <span className="font-medium ml-1">Like</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18 9c-.6 0-1 .4-1 1v7c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1h7c.6 0 1-.4 1-1s-.4-1-1-1H6c-1.7 0-3 1.3-3 3v9c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-.6-.4-1-1-1z" />
                            <path d="M17 1c-.6 0-1 .4-1 1s.4 1 1 1h.6l-6.3 6.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3L19 4.4V5c0 .6.4 1 1 1s1-.4 1-1V1h-4z" />
                          </svg>
                          Share
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19 4h-4a1 1 0 010-2h4a3 3 0 013 3v16a1 1 0 01-.62.92A.84.84 0 0121 22a1 1 0 01-.71-.29l-2.81-2.82H8a3 3 0 01-3-3v-4a1 1 0 012 0v4a1 1 0 001 1h10.09l1.59 1.59a.25.25 0 00.41-.17V5a1 1 0 00-1-1zm-8 10H7a1 1 0 00-1 1v3a1 1 0 01-2 0v-3a3 3 0 013-3h4a1 1 0 010 2z" />
                            <path d="M5 10a5 5 0 005-5V4a1 1 0 012 0v1a7 7 0 01-7 7H4a1 1 0 010-2z" />
                          </svg>
                          Comment
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="twitter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800"
                  >
                    {/* Twitter Header */}
                    <div className="p-3 flex items-start">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg mr-3">
                        P
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">
                              Persona AI
                            </div>
                            <div className="text-gray-500 text-sm">
                              @PersonaAI
                            </div>
                          </div>
                          <div className="text-[#1d9bf0]">
                            <svg
                              className="w-5 h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="py-2 text-white">
                          <p>
                            Excited to announce that Persona AI will be
                            launching soon! 🚀
                          </p>
                          <p>
                            Our platform helps busy entrepreneurs create
                            professional content for multiple social media
                            platforms with just one click. #ContentCreation
                            #SocialMedia #AI
                          </p>
                        </div>

                        {/* Image */}
                        <div className="mt-3 rounded-xl overflow-hidden bg-gradient-to-r from-accent/20 to-accent/30">
                          <div className="aspect-video flex items-center justify-center">
                            <div className="text-center p-6">
                              <svg
                                className="w-12 h-12 text-accent mx-auto mb-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                              </svg>
                              <p className="text-white font-semibold">
                                Create content that performs
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-gray-500 text-sm mt-2">
                          11:45 AM · May 20, 2024
                        </div>

                        {/* Engagement */}
                        <div className="pt-3 mt-2 border-t border-gray-800 grid grid-cols-4 text-gray-500 text-sm">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                            </svg>
                            23
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                            15
                          </div>
                          <div className="flex items-center text-rose-500">
                            <svg
                              className="w-4 h-4 mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                            128
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            42
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span className="text-sm text-foreground/60">
                  One idea, perfectly formatted for each platform
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className={`w-full py-24 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-background to-black/40'
            : 'bg-gradient-to-b from-background to-gray-50'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How Persona AI Works
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              A streamlined process designed to save you time and amplify your
              social media presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <motion.div
              className={`p-8 rounded-xl shadow-lg border border-accent/20 ${
                theme === 'dark' ? 'bg-white/5 backdrop-blur-sm' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Capture Raw Ideas</h3>
              <p className="text-foreground/80 text-lg">
                Quickly dump your content ideas and images in our simple,
                intuitive interface. No formatting required - just get your
                thoughts down.
              </p>
            </motion.div>

            <motion.div
              className={`p-8 rounded-xl shadow-lg border border-accent/20 ${
                theme === 'dark' ? 'bg-white/5 backdrop-blur-sm' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.5 7.5h-9v9h9v-9z" />
                  <path
                    fillRule="evenodd"
                    d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Formatting</h3>
              <p className="text-foreground/80 text-lg">
                Our AI formats your content perfectly for each platform using
                customizable templates, optimizing for engagement and
                visibility.
              </p>
            </motion.div>

            <motion.div
              className={`p-8 rounded-xl shadow-lg border border-accent/20 ${
                theme === 'dark' ? 'bg-white/5 backdrop-blur-sm' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
                    clipRule="evenodd"
                  />
                  <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">One-Click Publishing</h3>
              <p className="text-foreground/80 text-lg">
                Preview, edit, and publish to multiple platforms simultaneously
                with a single click. Save time while maintaining a consistent
                presence.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.a
              href="#waitlist"
              className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px -5px rgba(255, 84, 0, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              Join the Waitlist
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials - Design for credibility even before launch */}
      <motion.section
        className={`w-full py-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              From Our Early Testers
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              See what our limited early access users are saying about Persona
              AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className={`p-6 rounded-xl shadow-md ${
                theme === 'dark'
                  ? 'bg-white/5 backdrop-blur-sm border border-gray-800/30'
                  : 'bg-gray-50 border border-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
                  S
                </div>
                <div>
                  <div className="font-medium">Sarah J.</div>
                  <div className="text-sm text-foreground/70">
                    Marketing Consultant
                  </div>
                </div>
              </div>
              <p className="text-foreground/90">
                "I've been looking for a tool like this for ages! I can finally
                repurpose content across platforms without spending hours
                reformatting everything. The AI formatting feels natural and
                platform-appropriate."
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl shadow-md ${
                theme === 'dark'
                  ? 'bg-white/5 backdrop-blur-sm border border-gray-800/30'
                  : 'bg-gray-50 border border-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-lg mr-3">
                  M
                </div>
                <div>
                  <div className="font-medium">Michael T.</div>
                  <div className="text-sm text-foreground/70">
                    Tech Startup Founder
                  </div>
                </div>
              </div>
              <p className="text-foreground/90">
                "As a busy founder, I need to be present on social media but
                can't spend hours creating content. Persona AI lets me share
                ideas quickly across platforms. The one-click publishing feature
                is a game-changer."
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl shadow-md ${
                theme === 'dark'
                  ? 'bg-white/5 backdrop-blur-sm border border-gray-800/30'
                  : 'bg-gray-50 border border-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-lg mr-3">
                  J
                </div>
                <div>
                  <div className="font-medium">Jessica L.</div>
                  <div className="text-sm text-foreground/70">
                    Content Creator
                  </div>
                </div>
              </div>
              <p className="text-foreground/90">
                "The platform previews are incredibly accurate - what you see is
                exactly what gets posted. The customization options for AI
                templates give me the perfect balance of automation and creative
                control."
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Social Platforms */}
      <motion.section
        id="platforms"
        className={`w-full py-20 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-black to-background'
            : 'bg-gradient-to-b from-white to-background'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Supported Platforms
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Leverage the power of multiple social networks with perfectly
              formatted content for each
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            <motion.div
              className={`${
                theme === 'dark'
                  ? 'bg-white/5 border border-accent/30'
                  : 'bg-white border border-accent/20'
              } p-8 rounded-xl shadow-lg flex flex-col items-center`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-[#0a66c2] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.5 2h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </div>
              <span className="text-xl font-bold">LinkedIn</span>
              <span className="text-foreground/60 text-sm mt-2">
                Professional networking
              </span>
            </motion.div>

            <motion.div
              className={`${
                theme === 'dark'
                  ? 'bg-white/5 border border-accent/30'
                  : 'bg-white border border-accent/20'
              } p-8 rounded-xl shadow-lg flex flex-col items-center`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-[#1d9bf0] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Twitter</span>
              <span className="text-foreground/60 text-sm mt-2">
                Concise messaging
              </span>
            </motion.div>

            <motion.div
              className={`${
                theme === 'dark'
                  ? 'bg-white/5 border border-accent/30'
                  : 'bg-white border border-accent/20'
              } p-8 rounded-xl shadow-lg flex flex-col items-center opacity-70`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.7, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Instagram</span>
              <span className="text-foreground/60 text-sm mt-2">
                Coming Soon
              </span>
            </motion.div>

            <motion.div
              className={`${
                theme === 'dark'
                  ? 'bg-white/5 border border-accent/30'
                  : 'bg-white border border-accent/20'
              } p-8 rounded-xl shadow-lg flex flex-col items-center opacity-70`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.7, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{
                y: -10,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-9 h-9 text-white"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                </svg>
              </div>
              <span className="text-xl font-bold">TikTok</span>
              <span className="text-foreground/60 text-sm mt-2">
                Coming Soon
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Waitlist Section with Animated Gradient Background */}
      <motion.section
        id="waitlist"
        className="w-full relative overflow-hidden py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div
          className={`absolute inset-0 ${
            theme === 'dark' ? 'bg-black' : 'bg-white'
          }`}
        ></div>

        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute -inset-[100%] bg-[length:50%_50%] bg-fixed opacity-50"
            style={{
              backgroundImage: `radial-gradient(circle at center, ${
                theme === 'dark'
                  ? 'rgba(255, 84, 0, 0.6)'
                  : 'rgba(255, 84, 0, 0.4)'
              } 0%, transparent 50%)`,
              animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Be First in <span className="text-accent">Line</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
              Persona AI is launching soon. Join our waitlist to get early
              access and special founding member benefits.
            </p>

            {!submitted ? (
              <motion.form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className={`flex-grow px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                      theme === 'dark'
                        ? 'bg-white/10 text-white border border-white/20 placeholder:text-white/50'
                        : 'bg-black/5 text-black border border-black/10 placeholder:text-black/50'
                    }`}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="bg-accent hover:bg-accent-hover text-white font-medium py-4 px-8 rounded-lg transition duration-300 disabled:opacity-70 shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 10px 25px -5px rgba(255, 84, 0, 0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                className={`${
                  theme === 'dark'
                    ? 'bg-accent/10 border border-accent/20'
                    : 'bg-accent/5 border border-accent/20'
                } text-foreground p-8 rounded-lg max-w-md mx-auto`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Thank you for joining!
                </h3>
                <p className="text-foreground/80">
                  We'll notify you as soon as Persona AI is ready for you to
                  try. Keep an eye on your inbox for updates and early access
                  information.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer - Simplified version */}
      <motion.footer
        className={`w-full py-12 ${
          theme === 'dark'
            ? 'bg-black text-white/80'
            : 'bg-gray-900 text-white/80'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-2xl font-bold text-white mb-4">Persona AI</div>
            <p className="text-white/60 mb-6">
              Transform raw ideas into platform-perfect content and amplify your
              social media presence with AI-powered formatting and one-click
              publishing.
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </motion.a>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p>&copy; 2024 Persona AI. All rights reserved.</p>
              <div className="mt-4">
                <motion.a
                  href="#waitlist"
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join the Waitlist
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
