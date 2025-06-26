# Voyage Estimator Bot

A Next.js application that provides AI-powered voyage estimation through a chat interface.

## Features

- 🤖 **AI-Powered Chat**: Integrated with OpenAI GPT-3.5-turbo for intelligent voyage estimation
- 💬 **Real-time Chat Interface**: Modern chat UI with message history
- ⚡ **Loading States**: Visual feedback during API calls
- 🛡️ **Error Handling**: Graceful error handling and user feedback
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd voyage-estimator-bot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Replace `your_openai_api_key_here` with your actual OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys).

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Start a conversation**: Type your voyage details in the chat input
2. **Get estimates**: The AI will analyze your request and provide voyage estimates
3. **Continue chatting**: Ask follow-up questions or request more details

### Example prompts:

- "I need to ship 25,000 MT of wheat from Hamburg to New York"
- "What's the estimated cost for a container ship from Shanghai to Los Angeles?"
- "How long would a voyage from Rotterdam to Singapore take?"

## Technical Details

### Architecture

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **API**: Next.js API routes for OpenAI integration
- **State Management**: React hooks (useState, useEffect)

### Key Components

- `app/page.tsx`: Main chat interface
- `app/api/chat/route.ts`: OpenAI API integration
- `components/ui/`: Reusable UI components

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Project Structure

```
voyage-estimator-bot/
├── app/
│   ├── api/chat/route.ts    # OpenAI API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main chat page
├── components/
│   └── ui/                  # Reusable UI components
├── lib/
│   └── utils.ts             # Utility functions
├── .env.local               # Environment variables
└── package.json             # Dependencies and scripts
```

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your OpenAI API key is correctly set in `.env.local`
2. **Rate Limiting**: OpenAI has rate limits. If you hit them, wait a moment and try again
3. **Network Issues**: Check your internet connection and OpenAI API status

### Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your OpenAI API key is valid
3. Ensure all dependencies are installed correctly

## License

This project is licensed under the MIT License. 