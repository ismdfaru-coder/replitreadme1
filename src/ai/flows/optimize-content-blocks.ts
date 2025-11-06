'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing content blocks based on LLM analysis of similar sites and user-defined specifications.
 *
 * - optimizeContentBlocks - A function that optimizes content blocks.
 * - OptimizeContentBlocksInput - The input type for the optimizeContentBlocks function.
 * - OptimizeContentBlocksOutput - The return type for the optimizeContentBlocks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeContentBlocksInputSchema = z.object({
  contentBlock: z
    .string()
    .describe('The content block to be optimized, including any HTML or markdown formatting.'),
  websiteType: z
    .string()
    .describe(
      'The type of website (e.g., blog, news site, e-commerce) for which the content block is intended.'
    ),
  targetAudience: z
    .string()
    .describe(
      'A description of the target audience (e.g., age, interests, demographics) for the website.'
    ),
  exampleSites: z
    .string()
    .describe(
      'List of similar sites which user provide which have good engagement, separated by commas.'
    ),
});
export type OptimizeContentBlocksInput = z.infer<typeof OptimizeContentBlocksInputSchema>;

const OptimizeContentBlocksOutputSchema = z.object({
  optimizedContentBlock: z
    .string()
    .describe('The optimized content block, formatted for maximum engagement.'),
  explanation: z
    .string()
    .describe(
      'An explanation of the changes made and why they are expected to improve engagement.'
    ),
});
export type OptimizeContentBlocksOutput = z.infer<typeof OptimizeContentBlocksOutputSchema>;

export async function optimizeContentBlocks(
  input: OptimizeContentBlocksInput
): Promise<OptimizeContentBlocksOutput> {
  return optimizeContentBlocksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeContentBlocksPrompt',
  input: {schema: OptimizeContentBlocksInputSchema},
  output: {schema: OptimizeContentBlocksOutputSchema},
  prompt: `You are an expert in optimizing content for online engagement. Analyze the provided content block, website type, target audience, and example sites, and rewrite the content block to maximize user engagement.

Content Block: {{{contentBlock}}}
Website Type: {{{websiteType}}}
Target Audience: {{{targetAudience}}}
Example Sites: {{{exampleSites}}}

Consider the following:

*   Readability: Is the content easy to read and understand?
*   Formatting: Is the content well-formatted and visually appealing?
*   Keywords: Does the content use relevant keywords to attract the target audience?
*   Call to Action: Does the content include a clear call to action?
*   SEO: Is the content optimized for search engines?

Provide the optimized content block and a detailed explanation of the changes made and why they are expected to improve engagement.

Output the optimized content block and explanation in a JSON format.
`,
});

const optimizeContentBlocksFlow = ai.defineFlow(
  {
    name: 'optimizeContentBlocksFlow',
    inputSchema: OptimizeContentBlocksInputSchema,
    outputSchema: OptimizeContentBlocksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
