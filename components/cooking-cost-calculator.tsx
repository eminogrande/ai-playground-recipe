"use client"
import { useState } from 'react';
import { Button } from './ui/button';
import { useOpenAI } from '@/hooks/useOpenAI';
import { recipePrompt } from '@/prompts/recipePrompt';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  emoji: string;
}

export function CookingCostCalculatorComponent() {
  const [dishDescription, setDishDescription] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipe, setRecipe] = useState<JSX.Element | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const { result, loading, error, generateResponse } = useOpenAI();

  const [step, setStep] = useState<number>(1);

  const generateRecipe = async () => {
    if (!dishDescription) {
      setRecipe(<p>Please enter a dish description.</p>);
      return;
    }

    const fullPrompt = {
      ...recipePrompt,
      userPrompt: recipePrompt.userPrompt(dishDescription)
    };

    setPrompt(fullPrompt.userPrompt);
    console.log('Sending prompt to OpenAI:', fullPrompt);

    try {
      await generateResponse(fullPrompt);
      setStep(2);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipe(<p>An error occurred while generating the recipe. Please try again.</p>);
    }
  };

  const calculateIngredientCost = (ingredient: Ingredient) => {
    if (ingredient.unit === 'piece') {
      return ingredient.quantity * ingredient.pricePerUnit;
    } else {
      // For ml, l, g, kg
      const unitMultiplier = ingredient.unit === 'kg' || ingredient.unit === 'l' ? 1000 : 1;
      return (ingredient.quantity * ingredient.pricePerUnit * unitMultiplier) / 100;
    }
  };

  const displayResult = () => {
    if (result) {
      console.log('Received result:', result);

      if (Array.isArray(result.ingredients)) {
        setIngredients(result.ingredients);

        const totalCost = result.ingredients.reduce((total, ing) => total + calculateIngredientCost(ing), 0);

        setRecipe(
          <div className="mt-6 p-6 bg-white rounded-lg shadow-lg space-y-4">
            <h3 className="font-bold text-xl mb-2">
              🤖 {result.dishName || 'Unnamed Dish'}
            </h3>
            <p className="text-sm text-gray-600 italic">
              🤖 {result.description || 'No description available'}
            </p>
            <div>
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {result.ingredients.map((ingredient: Ingredient, index: number) => (
                  <li key={index}>
                    🤖 {ingredient.emoji || ''} {ingredient.name || 'Unknown'} - 
                    {ingredient.quantity} {ingredient.unit} - 
                    {calculateIngredientCost(ingredient).toFixed(2)} TZS
                  </li>
                ))}
              </ul>
            </div>
            {result.instructions && (
              <div>
                <h4 className="font-semibold mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside">
                  {result.instructions.map((step: string, index: number) => (
                    <li key={index}>🤖 {step}</li>
                  ))}
                </ol>
              </div>
            )}
            <div className="border-t pt-2 mt-2 font-bold">
              Total Cost: {totalCost.toFixed(2)} TZS
            </div>
          </div>
        );
      } else {
        setRecipe(<p>Invalid recipe format received. Please try again.</p>);
      }
      setStep(3);
    } else {
      setRecipe(<p>Failed to generate recipe. Please try again.</p>);
    }
  };

  return (
    <div className="min-h-screen bg-green-200 p-4 relative overflow-hidden">
      <div className="max-w-2xl mx-auto bg-green-50 bg-opacity-90 p-6 rounded-lg shadow-lg relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Dish Description to Recipe</h1>
        <textarea
          className="w-full p-2 mb-4 border rounded"
          rows={4}
          placeholder="Describe your dish..."
          value={dishDescription}
          onChange={(e) => setDishDescription(e.target.value)}
        />
        {step === 1 && (
          <Button 
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={generateRecipe}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </Button>
        )}
        {step === 2 && (
          <Button 
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={displayResult}
          >
            Display Result
          </Button>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {recipe}
        {prompt && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Prompt sent to AI:</h4>
            <p className="text-sm">{prompt}</p>
          </div>
        )}
      </div>
    </div>
  );
}