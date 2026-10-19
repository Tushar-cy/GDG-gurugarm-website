# GDG Gurugram University Website

This is the official website for the Google Developer Group at Gurugram University, built with React, TypeScript, Vite, and Express.js.

## Features

- Modern UI with Chakra UI components
- Full-stack application with Express.js backend
- MongoDB integration for data storage
- Responsive design for all device sizes
- Team, News, and Events sections

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the development server: `npm run dev`

## Deployment to Render

This project is configured for easy deployment on [Render](https://render.com). Follow these steps to deploy:

1. **Create a new Web Service on Render**
   - Sign up or log in to [Render](https://render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the Web Service**
   - Name: `gdg-gug-website` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Select the appropriate instance type (Free tier works for testing)

3. **Set Environment Variables**
   - Add the following environment variables in the Render dashboard:
     - `NODE_ENV`: `production`
     - `PORT`: `3001`
     - `MONGODB_URI`: Your MongoDB connection string

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

5. **Verify Deployment**
   - Once deployment is complete, visit your Render URL to verify everything is working
   - Check the `/api/health` endpoint to confirm the API is running

## Troubleshooting

If you encounter issues with the deployment:

1. Check Render logs for any errors
2. Verify your MongoDB connection string is correct
3. Ensure your MongoDB IP whitelist includes Render's IPs
4. Check that all environment variables are properly set
