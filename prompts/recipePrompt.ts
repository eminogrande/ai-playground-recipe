import config from '@/config';

export const recipePrompt = {
  model: config.OPENAI_MODEL,
  temperature: config.OPENAI_TEMPERATURE,
  systemPrompt: `You are a culinary expert specializing in Tanzanian cuisine with extensive knowledge of local ingredient prices. Always respond in JSON format.`,
  userPrompt: (description: string) => `Generate a recipe based on this dish description: "${description}". Follow these guidelines:
1. Create a creative dish name in Swahili with its English translation.
2. Provide a brief description of the dish.
3. List ingredients with precise quantities for 2-4 servings. Use appropriate units:
   - For liquids: use milliliters (ml) or liters (l)
   - For solid ingredients: use grams (g) or kilograms (kg)
   - For countable items: use pieces, e.g., 2 pieces of eggplant
4. Provide accurate prices in Tanzanian Shillings (TZS) based on current market rates:
   - For liquids and solids: price per 100ml or 100g
   - For countable items: price per piece
5. Use emojis for ingredients.
6. Provide clear, step-by-step instructions.

Respond in JSON format with the following structure:
{
  "dishName": "Swahili Name (English Translation)",
  "description": "A brief description of the dish",
  "ingredients": [
    {
      "name": "Ingredient name",
      "quantity": number,
      "unit": "ml, l, g, kg, or piece",
      "pricePerUnit": number,
      "emoji": "emoji"
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2",
    ...
  ],
  "totalCost": number
}`,
  responseFormat: { type: "json_object" }
};
