# Environment Setup Guide

This guide will help you set up the environment variables for the Engineering Resource Hub application.

## Step 1: Create Environment File

Create a file named `.env` in the `frontend` directory with the following content:



## Step 2: Firebase Setup

### Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click on the web app (</>) or create a new one
7. Copy the configuration object

### Update Your .env File

Replace the Firebase values in your `.env` file with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 3: Gemini API Setup (Optional)

### Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Update Your .env File

Replace `your_gemini_api_key_here` with your actual Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

**Note**: The application works without a Gemini API key using the free model, but you get higher quotas with an API key.

## Step 4: Firebase Security Rules

Make sure your Firestore security rules allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5: Restart Development Server

After creating/updating your `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `VITE_GEMINI_API_KEY` | Gemini API key for enhanced features | No |

## Troubleshooting

### Missing Environment Variables
If you see console errors about missing environment variables:
1. Check that your `.env` file is in the `frontend` directory
2. Ensure all variable names start with `VITE_`
3. Restart your development server after making changes

### Firebase Connection Issues
1. Verify your Firebase configuration values
2. Check that your Firebase project is active
3. Ensure Firestore is enabled in your Firebase project

### Gemini API Issues
1. The app works without a Gemini API key using the free model
2. If you want higher quotas, get an API key from Google AI Studio
3. Make sure the API key is correctly set in your `.env` file

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your API keys secure and don't share them publicly
- Use different API keys for development and production 