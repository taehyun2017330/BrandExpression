# Brand Expression

A research prototype for supporting brand owners in externalizing tacit knowledge for AI-assisted social media content creation.

## Overview

Brand Expression helps small business owners and brand managers articulate their brand's unique identity through an interactive AI-powered interface. The system captures implicit brand knowledge that is often difficult to express, then uses it to generate consistent, on-brand social media content.

## Features

- **Brand Analysis**: AI-powered brand analysis from website URLs and images
- **Visual Moodboard Generation**: Automatic creation of visual style guides
- **Content Grid Generation**: Create multiple social media posts at once
- **Single Image Generation**: Generate individual custom images
- **Calendar View**: Organize and schedule content
- **Research Mode**: Unlimited usage for research purposes

## Tech Stack

### Frontend
- Next.js 14
- React 18
- Material-UI
- TypeScript

### Backend
- Node.js
- Express
- TypeScript
- MySQL
- OpenAI GPT-4 & DALL-E 3

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher) with root password set to: `QkdwkWkd12@@`
- OpenAI API key
- AWS account (optional, for S3 image storage)

**Important:** Before running the setup, configure your MySQL root password:

```bash
# Set MySQL root password
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'QkdwkWkd12@@';"
```

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/BrandExpression.git
cd BrandExpression
```

### 2. Run setup script

```bash
./setup.sh
```

The setup script will:
- Prompt you for your OpenAI API key
- Configure AWS S3 (optional)
- Set up database connection
- Install all dependencies
- Create necessary environment files

### 3. Start the application

```bash
./start.sh
```

This will start both the frontend (port 3000) and backend (port 9988).

Access the application at: `http://localhost:3000`

## Manual Setup

If you prefer to set up manually:

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env
# Edit .env with your configuration

# Run database migrations
mysql -u root -p amond < sql/00_init_database.sql

# Start backend
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:9988" > .env.local

# Start frontend
npm run dev
```

## Environment Variables

### Backend (.env)

```bash
# OpenAI API (Required)
OPENAI_API_KEY=your_openai_api_key_here

# AWS S3 (Optional - for image storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name

# Database (Required)
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=amond
DB_USER=root
DB_PASSWORD=your_password

# Server Configuration
PORT=9988
NODE_ENV=dev
SESSION_SECRET=your_random_secret
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:9988
```

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE amond CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run the schema migration:

```bash
mysql -u root -p amond < amond-backend/sql/initial_schema.sql
```

## Usage

1. **Create an account** or log in
2. **Start brand analysis** by entering your brand name and URL
3. **Review AI-generated brand summary** and customize if needed
4. **Generate moodboard** to establish visual style
5. **Create content** using the "콘텐츠 생성하기" button
6. **View and edit** generated content in calendar or grid view

## Research Mode

This prototype runs in "research mode" with unlimited usage for testing purposes. All usage limits have been disabled in the codebase.

## API Keys

### OpenAI API Key
Required for:
- Brand analysis (GPT-4)
- Content generation (GPT-4)
- Image generation (DALL-E 3)
- Moodboard creation

Get your key at: https://platform.openai.com/api-keys

### AWS S3 (Optional)
Used for image storage. If not configured, images will be stored as base64 in the database.

## Project Structure

```
BrandExpression/
├── amond-frontend/          # Next.js frontend
│   ├── src/
│   │   ├── pages/          # Next.js pages
│   │   ├── component/      # React components
│   │   └── module/         # Utilities and helpers
│   └── public/             # Static assets
│
├── amond-backend/           # Express backend
│   ├── router/             # API routes
│   ├── module/             # Business logic
│   ├── sql/                # Database migrations
│   └── app.ts              # Entry point
│
├── setup.sh                # Setup script
├── start.sh                # Start script
└── README.md
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `brew services start mysql` (macOS)
- Check your database credentials in `.env`
- Verify the database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you have access to GPT-4 and DALL-E 3

### Port Already in Use
- Change the port in `amond-backend/.env` (default: 9988)
- Update `NEXT_PUBLIC_API_URL` in `amond-frontend/.env.local`

## Development

### Backend Development
```bash
cd amond-backend
npm run dev  # Auto-restarts on file changes
```

### Frontend Development
```bash
cd amond-frontend
npm run dev  # Hot reload enabled
```

## Contributing

This is a research prototype. For questions or collaboration inquiries, please open an issue.

## License

This project is for research purposes. Please contact the authors for usage rights.

## Citation

If you use this system in your research, please cite:

```
[Citation information to be added]
```

## Acknowledgments

This research prototype was developed to study how AI can help small business owners externalize tacit brand knowledge for consistent content creation.
