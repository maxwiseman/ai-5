import { cohere } from '@ai-sdk/cohere';
import {
  streamText,
  ModelMessage,
  ToolCallPart,
  ToolResultPart,
  tool,
} from 'ai';
import 'dotenv/config';
import { z } from 'zod';

const messages: ModelMessage[] = [];

async function main() {
  let toolResponseAvailable = false;

  const result = streamText({
    model: cohere('command-r-plus'),
    maxOutputTokens: 512,
    tools: {
      currentTime: tool({
        description: 'Get the current time',
        parameters: z.object({}),
        execute: async () => ({
          currentTime: new Date().toLocaleTimeString(),
        }),
      }),
    },
    prompt: 'What is the current time?',
  });

  let fullResponse = '';
  const toolCalls: ToolCallPart[] = [];
  const toolResponses: ToolResultPart[] = [];

  for await (const delta of result.fullStream) {
    console.log(delta);

    switch (delta.type) {
      case 'text': {
        fullResponse += delta.text;
        process.stdout.write(delta.text);
        break;
      }

      case 'tool-call': {
        toolCalls.push(delta);

        process.stdout.write(
          `\nTool call: '${delta.toolName}' ${JSON.stringify(delta.args)}`,
        );
        break;
      }

      case 'tool-result': {
        toolResponses.push(delta);

        process.stdout.write(
          `\nTool response: '${delta.toolName}' ${JSON.stringify(
            delta.result,
          )}`,
        );
        break;
      }
    }
  }
  process.stdout.write('\n\n');

  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls],
  });

  if (toolResponses.length > 0) {
    messages.push({ role: 'tool', content: toolResponses });
  }

  toolResponseAvailable = toolCalls.length > 0;
}

main().catch(console.error);
