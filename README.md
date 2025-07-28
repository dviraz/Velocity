# Velocity - Website Speed Analysis Tool

A Next.js application that provides real-time website speed analysis using Google PageSpeed Insights API.

## Features

- **Real-time PageSpeed Analysis**: Analyze any website using Google's PageSpeed Insights API
- **Email Collection**: Collect user emails to deliver analysis results
- **Core Web Vitals**: Display detailed performance metrics including:
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - Performance Score (0-100)
- **Optimization Recommendations**: Show specific issues and optimization opportunities
- **Responsive Design**: Clean, modern UI built with Tailwind CSS and shadcn/ui

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Get a Google API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the PageSpeed Insights API
   - Create credentials (API key)
   - Add the API key to your `.env.local` file

5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```bash
GOOGLE_GENAI_API_KEY=your_google_api_key_here
```

Make sure to enable the PageSpeed Insights API in your Google Cloud Console.

## Usage

1. Enter a website URL in the analysis form
2. Provide your email address to receive results
3. Click "Get Free Analysis" to start the PageSpeed analysis
4. View real-time results including performance score and optimization recommendations

## Tech Stack

- **Framework**: Next.js 15.3.3 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: Google PageSpeed Insights API
- **Form Handling**: React Server Actions with Zod validation
- **UI Components**: Radix UI primitives with custom styling
