'use server';
/**
 * @fileOverview Predicts when a product will run out of stock based on sales trends.
 *
 * - predictReorderPoint - A function that predicts when a product will run out of stock.
 * - PredictReorderPointInput - The input type for the predictReorderPoint function.
 * - PredictReorderPointOutput - The return type for the predictReorderPoint function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictReorderPointInputSchema = z.object({
  productId: z.string().describe('The ID of the product to predict reorder point for.'),
  currentStock: z.number().describe('The current stock level of the product.'),
  averageDailySales: z.number().describe('The average daily sales of the product.'),
  leadTimeDays: z.number().describe('The lead time in days required to restock the product.'),
  seasonalityFactor: z
    .number()
    .optional()
    .describe(
      'A factor to adjust the prediction based on seasonality.  For example, 1.2 would be 20% higher than average sales.'
    ),
  promotionFactor: z
    .number()
    .optional()
    .describe(
      'A factor to adjust the prediction based on promotional events. For example, 1.3 would be 30% higher than average sales.'
    ),
});
export type PredictReorderPointInput = z.infer<typeof PredictReorderPointInputSchema>;

const PredictReorderPointOutputSchema = z.object({
  daysUntilOutOfStock: z
    .number()
    .describe('The predicted number of days until the product is out of stock.'),
  reorderQuantity: z
    .number()
    .describe('The recommended reorder quantity to avoid stockouts.'),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the prediction (0-100).'),
});
export type PredictReorderPointOutput = z.infer<typeof PredictReorderPointOutputSchema>;

export async function predictReorderPoint(
  input: PredictReorderPointInput
): Promise<PredictReorderPointOutput> {
  return predictReorderPointFlow(input);
}

const calculateAdjustedSales = ai.defineTool({
  name: 'calculateAdjustedSales',
  description: 'Calculates the adjusted daily sales based on seasonality and promotional events.',
  inputSchema: z.object({
    averageDailySales: z.number().describe('The average daily sales of the product.'),
    seasonalityFactor: z
      .number()
      .optional()
      .describe(
        'A factor to adjust the prediction based on seasonality.  For example, 1.2 would be 20% higher than average sales.'
      ),
    promotionFactor: z
      .number()
      .optional()
      .describe(
        'A factor to adjust the prediction based on promotional events. For example, 1.3 would be 30% higher than average sales.'
      ),
  }),
  outputSchema: z.number().describe('The adjusted daily sales.'),
},
async input => {
  let adjustedSales = input.averageDailySales;
  if (input.seasonalityFactor) {
    adjustedSales *= input.seasonalityFactor;
  }
  if (input.promotionFactor) {
    adjustedSales *= input.promotionFactor;
  }
  return adjustedSales;
});


const prompt = ai.definePrompt({
  name: 'predictReorderPointPrompt',
  input: {
    schema: z.object({
      productId: z.string().describe('The ID of the product to predict reorder point for.'),
      currentStock: z.number().describe('The current stock level of the product.'),
      averageDailySales: z.number().describe('The average daily sales of the product.'),
      leadTimeDays: z.number().describe('The lead time in days required to restock the product.'),
      adjustedDailySales: z.number().describe('The adjusted daily sales of the product, incorporating seasonality and promotion factors.'),
    }),
  },
  output: {
    schema: z.object({
      daysUntilOutOfStock: z
        .number()
        .describe('The predicted number of days until the product is out of stock.'),
      reorderQuantity: z
        .number()
        .describe('The recommended reorder quantity to avoid stockouts.'),
      confidenceLevel: z
        .number()
        .describe('The confidence level of the prediction (0-100).'),
    }),
  },
  prompt: `You are an expert inventory management assistant.

You will be given the current stock level, average daily sales, lead time, and adjusted daily sales for a product.

Based on this information, you will predict when the product will run out of stock, recommend a reorder quantity, and provide a confidence level for your prediction.

Product ID: {{{productId}}}
Current Stock: {{{currentStock}}}
Lead Time: {{{leadTimeDays}}} days
Adjusted Daily Sales: {{{adjustedDailySales}}}

Consider the lead time when recommending a reorder quantity. The reorder quantity should be enough to cover sales during the lead time.

Provide the output in JSON format.
`, 
});

const predictReorderPointFlow = ai.defineFlow<
  typeof PredictReorderPointInputSchema,
  typeof PredictReorderPointOutputSchema
>({
  name: 'predictReorderPointFlow',
  inputSchema: PredictReorderPointInputSchema,
  outputSchema: PredictReorderPointOutputSchema,
},
async input => {
  const adjustedSales = await calculateAdjustedSales({
    averageDailySales: input.averageDailySales,
    seasonalityFactor: input.seasonalityFactor,
    promotionFactor:  input.promotionFactor
  });

  const {output} = await prompt({
    ...input,
    adjustedDailySales: adjustedSales,
  });
  return output!;
});

