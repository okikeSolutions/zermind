# OpenRouter Integration Setup

This document explains how to set up and use the OpenRouter integration in Zermind for AI chat functionality.

## 🚀 Quick Start

### 1. Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai) and create an account
2. Go to [API Keys](https://openrouter.ai/keys)
3. Create a new API key
4. Copy the key for the next step

### 2. Configure Environment Variables

Create a `.env` file in your project root and add your OpenRouter API key:

```bash
# Required: OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Other environment variables
DATABASE_URL=your_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the Development Server

```bash
yarn dev
```

The chat interface should now work with real AI responses!

## 🤖 Supported Models

The integration supports multiple AI models through OpenRouter:

### Anthropic

- **Claude 3.5 Sonnet** - Best for reasoning, analysis, and coding
- **Claude 3 Haiku** - Fast and efficient for simple tasks

### OpenAI

- **GPT-4o** - Latest multimodal model from OpenAI
- **GPT-4o Mini** - Faster and cheaper version of GPT-4o

### Meta

- **Llama 3.1 405B** - Open source, great for general tasks
- **Llama 3.1 70B** - Balanced performance and speed

## 🛠 Technical Implementation

### API Route (`/api/chat`)

The API route handles streaming chat completions:

```typescript
// POST /api/chat
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "openai/gpt-4o-mini",
  "maxTokens": 1000,
  "temperature": 0.7
}
```

### Components Used

- **`ChatConversation`** - Main chat interface with streaming support
- **`ModelSelector`** - Dropdown to choose between AI models
- **`useChat`** - Custom hook wrapping Vercel AI SDK

### Key Features

- ✅ **Real-time Streaming** - Token-by-token AI responses
- ✅ **Multiple Models** - Switch between different AI providers
- ✅ **Error Handling** - Graceful error display and recovery
- ✅ **Stop Generation** - Cancel ongoing AI responses
- ✅ **Message History** - Persistent conversation context
- ✅ **Copy Responses** - One-click copy AI messages

## 🔧 Customization

### Adding New Models

Edit `src/components/model-selector.tsx` to add more models:

```typescript
const MODELS = [
  // Add your custom model here
  {
    id: "your-provider/your-model",
    name: "Your Model Name",
    provider: "Your Provider",
    description: "Model description",
    tier: "standard", // or "premium",
  },
  // ... existing models
];
```

### Adjusting Model Parameters

Modify the default parameters in `src/hooks/use-chat.ts`:

```typescript
export function useChat({
  model = "openai/gpt-4o-mini",
  maxTokens = 1000, // Increase for longer responses
  temperature = 0.7, // 0.0 = deterministic, 1.0 = creative
  // ...
});
```

## 💰 Cost Management

OpenRouter uses pay-as-you-go pricing:

- Check current pricing at [OpenRouter Models](https://openrouter.ai/models)
- Monitor usage in your [OpenRouter Dashboard](https://openrouter.ai/usage)
- Set spending limits to control costs

## 🔒 Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production use
- Monitor API usage to prevent unexpected charges

## 🐛 Troubleshooting

### "OpenRouter API key not configured" Error

Make sure you have:

1. Created a `.env` file in the project root
2. Added `OPENROUTER_API_KEY=your_key_here`
3. Restarted your development server

### Slow Response Times

- Try switching to a faster model (e.g., Claude 3 Haiku, GPT-4o Mini)
- Reduce `maxTokens` parameter
- Check your internet connection

### Rate Limiting

If you hit rate limits:

- Wait a few minutes before retrying
- Switch to a different model
- Upgrade your OpenRouter plan if needed

## 📚 Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Vercel AI SDK Docs](https://ai-sdk.dev)
- [OpenRouter Discord Community](https://discord.gg/openrouter)
- [Model Comparison](https://openrouter.ai/models)
