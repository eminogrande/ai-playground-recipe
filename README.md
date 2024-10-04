export const recipePrompt = {
  model: "gpt-3.5-turbo-1106",
  temperature: 1,
  systemPrompt: "You are a helpful assistant that specializes in generating recipes and creative dish names based on dish descriptions. You also estimate ingredient quantities and prices in Tanzanian Shillings (TZS).",
  userPrompt: (description: string) => `Generate a recipe based on this dish description: "${description}". Create a creative dish name in Swahili with its English translation. Estimate the quantities and prices of ingredients in TZS. Use emojis for ingredients. Respond in JSON format.`,
  responseFormat: { type: "json_object" }
};