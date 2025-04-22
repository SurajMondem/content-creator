'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ArrowUpIcon,
  ChevronDown,
  FileText,
  MessageSquare,
  PenTool,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      // Temporarily shrink to get the right scrollHeight
      textarea.style.height = `${minHeight}px`;

      // Calculate new height
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export function VercelV0Chat() {
  const [value, setValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = () => {
    if (!value.trim()) return;

    // Small delay to allow transition to begin
    setTimeout(() => {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        text: value.trim(),
        isUser: true,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: `I received your message: "${value.trim()}"`,
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Scroll to bottom
        scrollToBottom();
      }, 1000);

      setValue('');
      adjustHeight(true);
      setChatStarted(true);
    }, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const templates = [
    { icon: <FileText className="w-4 h-4 mr-2" />, name: 'Blog Post Template' },
    {
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
      name: 'Social Media Post',
    },
    { icon: <PenTool className="w-4 h-4 mr-2" />, name: 'Product Description' },
  ];

  // Animation variants for smoother transitions
  const inputContainerVariants = {
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      width: '100%',
      maxWidth: '2xl',
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
        mass: 1,
      },
    },
    exit: {
      y: 100,
      opacity: 0,
      scale: 0.95,
      transition: {
        type: 'tween',
        ease: 'easeIn',
        duration: 0.3,
      },
    },
    bottom: {
      y: 0,
      opacity: 1,
      scale: 1,
      width: '100%',
      transition: {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  const titleVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -40,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.4,
      },
    },
  };

  const messageListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-120px)] w-full max-w-4xl mx-auto"
      ref={chatContainerRef}
    >
      <AnimatePresence mode="wait">
        {!chatStarted ? (
          // Initial centered layout
          <motion.div
            key="centered-layout"
            className="flex flex-col items-center justify-center h-full w-full px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-4xl font-bold text-black dark:text-white text-center mb-8"
              variants={titleVariants}
              initial="visible"
              animate="visible"
              exit="exit"
            >
              What can I help you ship?
            </motion.h1>

            <motion.div
              className="w-full max-w-2xl bg-neutral-900 rounded-xl border border-neutral-800"
              variants={inputContainerVariants}
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate="center"
              exit="exit"
              layoutId="chat-input-container"
            >
              <div className="overflow-y-auto">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setValue(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask v0 a question..."
                  className={cn(
                    'w-full px-4 py-3',
                    'resize-none',
                    'bg-transparent',
                    'border-none',
                    'text-white text-sm',
                    'focus:outline-none',
                    'focus-visible:ring-0 focus-visible:ring-offset-0',
                    'placeholder:text-neutral-500 placeholder:text-sm',
                    'min-h-[60px]'
                  )}
                  style={{
                    overflow: 'hidden',
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <FileText className="w-4 h-4 text-white" />
                      <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                        Templates
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 text-zinc-400 transition-transform',
                          dropdownOpen && 'transform rotate-180'
                        )}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute bottom-full left-0 mb-1 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10 py-1">
                        {templates.map((template, index) => (
                          <button
                            key={index}
                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-neutral-800 transition-colors"
                            onClick={() => {
                              setValue(`Using template: ${template.name}\n`);
                              setDropdownOpen(false);
                              adjustHeight();
                            }}
                          >
                            {template.icon}
                            {template.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(
                      'px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1',
                      value.trim() ? 'bg-white text-black' : 'text-zinc-400'
                    )}
                    onClick={handleSendMessage}
                    disabled={!value.trim()}
                  >
                    <ArrowUpIcon
                      className={cn(
                        'w-4 h-4',
                        value.trim() ? 'text-black' : 'text-zinc-400'
                      )}
                    />
                    <span className="sr-only">Send</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Chat started layout with input at bottom
          <motion.div
            key="bottom-layout"
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="flex-1 overflow-y-auto px-4 pb-5 space-y-6"
              variants={messageListVariants}
              initial="hidden"
              animate="visible"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={cn(
                    'max-w-3xl mx-auto py-4 px-6 rounded-xl',
                    message.isUser
                      ? 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                      : 'bg-neutral-900 text-white'
                  )}
                  variants={messageVariants}
                >
                  <p className="text-sm">{message.text}</p>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </motion.div>

            <motion.div
              className="w-full sticky bottom-0 mt-auto bg-neutral-900 rounded-xl border border-neutral-800"
              variants={inputContainerVariants}
              initial="bottomHidden"
              animate="bottom"
              layoutId="chat-input-container"
            >
              <div className="overflow-y-auto">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setValue(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask v0 a question..."
                  className={cn(
                    'w-full px-4 py-3',
                    'resize-none',
                    'bg-transparent',
                    'border-none',
                    'text-white text-sm',
                    'focus:outline-none',
                    'focus-visible:ring-0 focus-visible:ring-offset-0',
                    'placeholder:text-neutral-500 placeholder:text-sm',
                    'min-h-[60px]'
                  )}
                  style={{
                    overflow: 'hidden',
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <FileText className="w-4 h-4 text-white" />
                      <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                        Templates
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 text-zinc-400 transition-transform',
                          dropdownOpen && 'transform rotate-180'
                        )}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute bottom-full left-0 mb-1 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-10 py-1">
                        {templates.map((template, index) => (
                          <button
                            key={index}
                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-neutral-800 transition-colors"
                            onClick={() => {
                              setValue(`Using template: ${template.name}\n`);
                              setDropdownOpen(false);
                              adjustHeight();
                            }}
                          >
                            {template.icon}
                            {template.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(
                      'px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1',
                      value.trim() ? 'bg-white text-black' : 'text-zinc-400'
                    )}
                    onClick={handleSendMessage}
                    disabled={!value.trim()}
                  >
                    <ArrowUpIcon
                      className={cn(
                        'w-4 h-4',
                        value.trim() ? 'text-black' : 'text-zinc-400'
                      )}
                    />
                    <span className="sr-only">Send</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
