import { SharedV2ProviderOptions } from '../../shared/v2/shared-v2-provider-options';
import { LanguageModelV2DataContent } from './language-model-v2-data-content';

/**
A prompt is a list of messages.

Note: Not all models and prompt formats support multi-modal inputs and
tool calls. The validation happens at runtime.

Note: This is not a user-facing prompt. The AI SDK methods will map the
user-facing prompt types such as chat or instruction prompts to this format.
 */
export type LanguageModelV2Prompt = Array<LanguageModelV2Message>;

export type LanguageModelV2Message =
  // Note: there could be additional parts for each role in the future,
  // e.g. when the assistant can return images or the user can share files
  // such as PDFs.
  (
    | {
        role: 'system';
        content: string;
      }
    | {
        role: 'user';
        content: Array<LanguageModelV2TextPart | LanguageModelV2FilePart>;
      }
    | {
        role: 'assistant';
        content: Array<
          | LanguageModelV2TextPart
          | LanguageModelV2FilePart
          | LanguageModelV2ReasoningPart
          | LanguageModelV2ToolCallPart
        >;
      }
    | {
        role: 'tool';
        content: Array<LanguageModelV2ToolResultPart>;
      }
  ) & {
    /**
     * Additional provider-specific options. They are passed through
     * to the provider from the AI SDK and enable provider-specific
     * functionality that can be fully encapsulated in the provider.
     */
    providerOptions?: SharedV2ProviderOptions;
  };

/**
Text content part of a prompt. It contains a string of text.
 */
export interface LanguageModelV2TextPart {
  type: 'text';

  /**
The text content.
   */
  text: string;

  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}

/**
Reasoning content part of a prompt. It contains a string of reasoning text.
 */
export interface LanguageModelV2ReasoningPart {
  type: 'reasoning';

  /**
The reasoning text.
   */
  text: string;

  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}

/**
File content part of a prompt. It contains a file.
 */
export interface LanguageModelV2FilePart {
  type: 'file';

  /**
   * Optional filename of the file.
   */
  filename?: string;

  /**
File data. Can be a Uint8Array, base64 encoded data as a string or a URL.
*/
  data: LanguageModelV2DataContent;

  /**
IANA media type of the file.

Can support wildcards, e.g. `image/*` (in which case the provider needs to take appropriate action).

@see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;

  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}

/**
Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).
 */
export interface LanguageModelV2ToolCallPart {
  type: 'tool-call';

  /**
ID of the tool call. This ID is used to match the tool call with the tool result.
 */
  toolCallId: string;

  /**
Name of the tool that is being called.
 */
  toolName: string;

  /**
Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  args: unknown;

  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}

/**
Tool result content part of a prompt. It contains the result of the tool call with the matching ID.
 */
export interface LanguageModelV2ToolResultPart {
  type: 'tool-result';

  /**
ID of the tool call that this result is associated with.
 */
  toolCallId: string;

  /**
Name of the tool that generated this result.
  */
  toolName: string;

  /**
Result of the tool call. This is a JSON-serializable object.
   */
  result: unknown;

  /**
Optional flag if the result is an error or an error message.
   */
  isError?: boolean;

  /**
Tool results as an array of parts. This enables advanced tool results including images.
When this is used, the `result` field should be ignored (if the provider supports content).
   */
  content?: Array<
    | {
        type: 'text';

        /**
Text content.
         */
        text: string;
      }
    | {
        type: 'image';

        /**
base-64 encoded image data
         */
        data: string;

        /**
IANA media type of the image.

@see https://www.iana.org/assignments/media-types/media-types.xhtml
         */
        mediaType?: string;
      }
  >;

  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}
