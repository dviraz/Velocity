# Setup Instructions for PageSpeed API Integration

## Google API Setup

To use the PageSpeed Insights API integration, you need to set up a Google Cloud project and enable the API.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled (required for API usage)

### Step 2: Enable PageSpeed Insights API

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for "PageSpeed Insights API"
3. Click on it and press **Enable**

### Step 3: Create API Key

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy the generated API key
4. (Optional but recommended) Click on the API key to restrict it:
   - Under "API restrictions", select "Restrict key"
   - Choose "PageSpeed Insights API" from the list
   - Save the changes

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```bash
   GOOGLE_GENAI_API_KEY=your_actual_api_key_here
   ```

### Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to http://localhost:9002

3. Enter a website URL and your email address

4. Click "Get Free Analysis" to test the PageSpeed API integration

## API Usage Notes

- The PageSpeed Insights API has rate limits (check Google's documentation for current limits)
- The API analyzes mobile performance by default
- Results include Core Web Vitals and specific optimization recommendations
- Email addresses are collected but not stored (you can add storage/email functionality as needed)

## Troubleshooting

### Common Issues:

1. **API Key not working**: Make sure the PageSpeed Insights API is enabled and your API key has the correct permissions

2. **Rate limit exceeded**: The API has usage limits. Consider implementing caching or rate limiting in production

3. **Invalid URL errors**: Make sure the URL includes the protocol (http:// or https://)

4. **CORS issues**: The API calls are made server-side, so CORS shouldn't be an issue

### Debug Mode:

Check the server console (terminal where you ran `npm run dev`) for detailed error messages if the analysis fails.
