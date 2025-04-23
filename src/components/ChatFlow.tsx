'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ArrowUpIcon,
  ChevronDown,
  FileText,
  MessageSquare,
  PenTool,
  Twitter,
  Linkedin,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

type SocialPlatform = 'twitter' | 'linkedin' | null;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  socialPreview?: {
    platform: SocialPlatform;
    content: string;
  };
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

export function ChatFlow() {
  const [value, setValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [streamComplete, setStreamComplete] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
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

  const simulateStreamingResponse = () => {
    // Simulated response text - replace with actual API call
    const fullResponse = `I received your message and here's my response. This is a simulated streaming response that would come from an LLM API using Server-Sent Events (SSE). In a real implementation, you would connect to an API endpoint that supports streaming and update the UI as chunks arrive.`;

    let currentIndex = 0;
    const streamingInterval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        // Simulate chunked response by adding a few characters at a time
        const nextChunkSize = Math.min(5, fullResponse.length - currentIndex);
        const nextChunk = fullResponse.substring(
          currentIndex,
          currentIndex + nextChunkSize
        );
        setResponseText((prev) => prev + nextChunk);
        currentIndex += nextChunkSize;
      } else {
        clearInterval(streamingInterval);
        setStreamComplete(true);
        // Generate social preview after stream completes
        setTimeout(() => {
          generateSocialPreview();
        }, 500);
      }
    }, 50);
  };

  const generateSocialPreview = () => {
    // In a real app, this would use the LLM response to generate platform-specific content
    // For now, we're just setting a default platform if none selected
    const platform = selectedPlatform || 'twitter';
    setSelectedPlatform(platform);

    const socialPreview = {
      platform: platform,
      content:
        platform === 'twitter'
          ? "Here's how this would look as a Tweet. Short, engaging, and with relevant hashtags. #ContentCreation #AI"
          : "Here's a more professional LinkedIn post format with industry insights and a call to action for your network.",
    };

    // Update the most recent AI message with the social preview
    setMessages((prev) => {
      const newMessages = [...prev];
      if (
        newMessages.length >= 2 &&
        !newMessages[newMessages.length - 1].isUser
      ) {
        newMessages[newMessages.length - 1].socialPreview = {
          platform: platform,
          content: socialPreview.content,
        };
      }
      return newMessages;
    });
  };

  const handleSendMessage = () => {
    if (!value.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: value.trim(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Reset states for new message flow
    setResponseText('');
    setStreamComplete(false);
    setIsLoading(true);

    // Create placeholder for AI response that will be updated
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
    };
    setMessages((prev) => [...prev, aiMessage]);

    // Start simulated streaming after a short delay
    setTimeout(() => {
      simulateStreamingResponse();
    }, 1500);

    setValue('');
    adjustHeight(true);
    setChatStarted(true);
  };

  // Update the AI message text as streaming happens
  useEffect(() => {
    if (responseText && messages.length > 0) {
      setMessages((prev) => {
        const newMessages = [...prev];
        if (!newMessages[newMessages.length - 1].isUser) {
          newMessages[newMessages.length - 1].text = responseText;
        }
        return newMessages;
      });

      // When stream is complete, we're no longer loading
      if (streamComplete) {
        setIsLoading(false);
      }
    }
  }, [responseText, streamComplete]);

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
  }, [messages, responseText]);

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
    bottomHidden: {
      y: 100,
      opacity: 0,
      scale: 0.95,
      width: '100%',
      transition: {
        duration: 0.1,
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

  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Wrapper container for messages to control centering
  const containerVariants = {
    initial: {
      alignItems: 'center',
      justifyContent: 'center',
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    messagesAdded: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        when: 'afterChildren',
      },
    },
  };

  // Social preview card with Twitter or LinkedIn styling
  const renderSocialPreview = (platform: SocialPlatform, content: string) => {
    if (platform === 'twitter') {
      return (
        <motion.div
          className="bg-[#15202b] text-white rounded-xl p-4 max-w-3xl mx-auto mt-4 border border-[#38444d] shadow-[0_0_15px_rgba(29,161,242,0.15)]"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: 0.2,
          }}
        >
          <div className="flex items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-400 mr-3 flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <div>
              <p className="font-bold">User Name</p>
              <p className="text-gray-400">@username</p>
            </div>
          </div>
          <p className="mb-3 text-sm">{content}</p>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>2:30 PM · May 8, 2023</span>
            <div className="flex gap-4">
              <span>♥ 24</span>
              <span>↺ 5</span>
            </div>
          </div>
        </motion.div>
      );
    } else if (platform === 'linkedin') {
      return (
        <motion.div
          className="bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl p-4 max-w-3xl mx-auto mt-4 border border-gray-300 dark:border-neutral-700 shadow-[0_0_15px_rgba(10,102,194,0.15)]"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: 0.2,
          }}
        >
          <div className="flex items-start mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-700 mr-3 flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <div>
              <p className="font-bold">User Name</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Content Creator · 2d
              </p>
            </div>
          </div>
          <p className="mb-4 text-sm">{content}</p>
          <div className="border-t border-gray-300 dark:border-neutral-700 pt-2 flex justify-between text-gray-500 dark:text-gray-400 text-sm">
            <span>👍 42</span>
            <span>💬 8</span>
            <span>🔄 12</span>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Determine if we should use centered layout for messages
  const shouldCenterMessages = messages.length <= 1;

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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              What content would you like to create today?
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
                  placeholder="Ask for content ideas, social media posts, blog outlines..."
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

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className={cn(
                        'p-2 rounded-lg transition-colors hover:bg-neutral-800',
                        selectedPlatform === 'twitter'
                          ? 'text-blue-400'
                          : 'text-zinc-400'
                      )}
                      onClick={() => setSelectedPlatform('twitter')}
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'p-2 rounded-lg transition-colors hover:bg-neutral-800',
                        selectedPlatform === 'linkedin'
                          ? 'text-blue-600'
                          : 'text-zinc-400'
                      )}
                      onClick={() => setSelectedPlatform('linkedin')}
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
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
          // Chat started layout with flow blocks and input at bottom
          <motion.div
            key="flow-layout"
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className={cn(
                'flex-1 overflow-y-auto px-4 pb-5 space-y-6',
                'min-h-[calc(100vh-300px)] flex flex-col',
                shouldCenterMessages ? 'justify-center' : 'justify-start'
              )}
              variants={containerVariants}
              initial="initial"
              animate={shouldCenterMessages ? 'initial' : 'messagesAdded'}
              ref={messageContainerRef}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className="w-full"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={cn(
                      'max-w-3xl mx-auto py-4 px-6 rounded-xl',
                      'transform-gpu', // Use GPU acceleration for smoother animations
                      message.isUser
                        ? 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                        : 'bg-neutral-900 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    )}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    {message.isUser ? (
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              U
                            </span>
                          </div>
                          <span className="text-xs font-medium">You</span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 rounded-full bg-purple-600 mr-2 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              AI
                            </span>
                          </div>
                          <span className="text-xs font-medium">Assistant</span>
                        </div>
                        {isLoading &&
                        index === messages.length - 1 &&
                        message.text === '' ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                            <p className="text-sm text-neutral-400">
                              Generating response...
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm">{message.text}</p>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Social preview for AI responses that have completed */}
                  {!message.isUser &&
                    message.socialPreview &&
                    renderSocialPreview(
                      message.socialPreview.platform,
                      message.socialPreview.content
                    )}
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
                  placeholder="Ask for content ideas, social media posts, blog outlines..."
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

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className={cn(
                        'p-2 rounded-lg transition-colors hover:bg-neutral-800',
                        selectedPlatform === 'twitter'
                          ? 'text-blue-400'
                          : 'text-zinc-400'
                      )}
                      onClick={() => setSelectedPlatform('twitter')}
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'p-2 rounded-lg transition-colors hover:bg-neutral-800',
                        selectedPlatform === 'linkedin'
                          ? 'text-blue-600'
                          : 'text-zinc-400'
                      )}
                      onClick={() => setSelectedPlatform('linkedin')}
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
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
                    disabled={!value.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUpIcon
                        className={cn(
                          'w-4 h-4',
                          value.trim() ? 'text-black' : 'text-zinc-400'
                        )}
                      />
                    )}
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
