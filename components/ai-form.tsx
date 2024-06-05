'use client'
import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios'; // Added AxiosResponse type
import { useForm, FormProvider } from 'react-hook-form'; // Removed Controller and zodResolver
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
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      prompt: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    try {
      const cachedMessages = sessionStorage.getItem('chatMessages');
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error('Error parsing cached messages:', error);
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
      const response: AxiosResponse<{ message: string }> = await axios.post('/api/ai', { prompt: values.prompt });
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

    form.reset();
  };

  return (
   <Form {...form}>
  <div className="p-4 max-w-xl mx-auto">
    <h1 className="text-2xl font-bold mb-4 text-sky-600">Ask AI</h1>
    <div className="border p-4 mb-4 h-64 overflow-y-auto bg-sky-50 rounded-lg transition shadow-md opacity-75 flex flex-col">
      {messages.slice(0).reverse().map((msg) => (
        <div
          key={msg.id}
          className={`rounded-lg p-2 ${
            msg.sender === 'AI' ? 'self-end bg-sky-200 text-sky-800' : 'self-start bg-white text-black'
          }`}
          style={{ maxWidth: '80%', wordWrap: 'break-word' }}
        >
          {msg.text}
        </div>
      ))}
    </div>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
      <FormField
        control={form.control}
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                placeholder="Ask AI your questions..."
                className="flex-grow p-3 border rounded"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        disabled={!isValid || isSubmitting}
        type="submit"
        className="p-4 bg-sky-600 text-white rounded shadow hover:bg-sky-700 mt-4"
      >
        Send
      </Button>
    </form>
  </div>
</Form>

  );
};

export default AIChat;
