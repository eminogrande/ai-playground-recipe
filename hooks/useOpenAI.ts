import { useState } from 'react';

export function useOpenAI<T>() {
  const [result, setResult] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to generate response');
      }

      console.log('API Response:', data);
      setResult(data.result);
    } catch (err) {
      console.error('Error in generateResponse:', err);
      setError(err instanceof Error ? err.message : 'Error generating response');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, generateResponse };
}