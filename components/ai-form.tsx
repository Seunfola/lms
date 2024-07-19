"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineRobot } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import axios, { AxiosResponse } from 'axios';

interface Message {
  sender: string;
  id: string;
  content: string;
  text: string;
}

const formSchema = z.object({
  prompt: z.string().nonempty("Prompt is required"),
});

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage: Message = {
      sender: 'You',
      id: `${Date.now()}-user`,
      content: values.prompt,
      text: values.prompt,
    };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);

    try {
      const response: AxiosResponse<{ output: { content: string } }> = await axios.post('/api/ai', {
        messages: [{ role: 'user', content: values.prompt }],
      });
      const aiMessage: Message = {
        sender: 'AI',
        id: `${Date.now()}-ai`,
        content: response.data.output.content,
        text: response.data.output.content,
      };

      setMessages((prevMessages) => [aiMessage, ...prevMessages]);
    } catch (error) {
      console.error('Error interacting with AI:', error);
      const errorMessage: Message = {
        sender: 'AI',
        id: `${Date.now()}-error`,
        content: 'Error occurred',
        text: 'Error occurred',
      };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-sky-600">Ask AI</h1>
        <div className="border p-4 mb-4 h-80 overflow-y-auto bg-sky-50 rounded-lg transition shadow-md opacity-75 flex flex-col-reverse">
          {messages.map((msg) => (
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
        <div className="flex flex-col gap-y-2">
          <FormItem>
            <FormField
              name="prompt"
              control={form.control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Ask AI your questions..."
                    className="flex-grow p-3 pl-10 border rounded"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <AiOutlineRobot className="text-gray-400" />
                  </div>
                </div>
              )}
            />
            <FormMessage />
          </FormItem>
          <Button
            disabled={!isValid || isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="p-4 bg-sky-600 text-white rounded shadow hover:bg-sky-700 mt-4">
            Send
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AIChat;
