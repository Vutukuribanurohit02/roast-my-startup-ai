import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const isOpenAIConfigured = !!(apiKey && apiKey !== 'your-openai-api-key');

export const openai = isOpenAIConfigured 
  ? new OpenAI({ apiKey }) 
  : null;
