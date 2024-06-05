"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AiOutlineRobot } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface Message {
  sender: string;
  id: string;
  content: string;
  text: string;
}

const formSchema = z.object({
  prompt: z.string(),
});

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = methods;

  useEffect(() => {
    const cachedMessages = sessionStorage.getItem('chatMessages');
    if (cachedMessages) {
      setMessages(JSON.parse(cachedMessages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage: Message = {
      sender: 'You',
      id: `${Date.now()}-user`,
      content: values.prompt,
      text: values.prompt,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post('/api/ai', { prompt: values.prompt });
      const aiMessage: Message = {
        sender: 'AI',
        id: `${Date.now()}-ai`,
        content: response.data.message,
        text: response.data.message,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error interacting with AI:', error);
      const errorMessage: Message = {
        sender: 'AI',
        id: `${Date.now()}-error`,
        content: 'Error occurred',
        text: 'Error occurred',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    reset();
  };

  return (
    <FormProvider {...methods}>
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-sky-600">Ask AI</h1>
        <div className="border p-4 mb-4 h-64 overflow-y-auto bg-sky-50 rounded-lg shadow-md">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-2 ${
                msg.sender === 'AI' ? 'self-start bg-sky-200 text-sky-800' : 'self-end bg-white text-black'
              }`}
              style={{ maxWidth: '80%', wordWrap: 'break-word' }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
          <FormField
            control={control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="p-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700"
          >
            Send
          </Button>
        </Form>
      </div>
    </FormProvider>
  );
};

export default AIChat;
