import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ message: 'Enter prompt' });
      return;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150,
          n: 1,
          stop: ['\n'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          }
        }
      );

      const aiMessage = response.data.choices[0].message.content.trim();
      res.status(200).json({ message: aiMessage });
    } catch (error) {
      console.error('Error with AI request:', error);
      res.status(500).json({ message: 'Error interacting with AI' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
