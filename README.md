# ZenStreet Application

## Features

- Create, read, update, and delete events
- Attach images and videos to events
- Search events by title and description
- Filter events by type (text, image, video)
- Date range filtering
- Responsive calendar interface
- Form validation
- Error handling

## Setup Instructions

### Frontend (React)

1. Navigate to the frontend directory:
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```
3. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd ../backend
   npm run start:dev
   ```

4. Open http://localhost:3000 in your browser

## Deployment Instructions

1. Ensure you have Node.js >=14.0.0 and npm >=6.0.0 installed
2. Set up your environment variables:
   - Create `.env` file in backend directory
   - Create `.env` file in frontend directory

### Deploy to Heroku

## Project Structure

- `/frontend` - Next.js frontend application
- `/backend` - NestJS backend application

## Development Status

Currently implementing Checkpoint 1: Project Setup
