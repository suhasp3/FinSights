# FinSights - Financial Dashboard

A financial dashboard with AI insights and budget tracking for college students.

## Quick Start

### Prerequisites

- Node.js (v18+)
- Go (v1.21+)
- Git

**Installing Go (if not installed):**

**macOS:**

```bash
brew install go
```

**Windows:**
Download from https://golang.org/dl/ and run the installer

**Linux:**

```bash
sudo apt update
sudo apt install golang-go
```

Verify installation: `go version`

### 1. Clone and Setup

```bash
git clone https://github.com/suhasp3/FinSights.git
cd FinSights
```

### 2. Backend Setup

```bash
cd financeai-backend

# Create .env file
echo "OPEN_AI_KEY=your_openai_api_key_here" > .env

# Run backend
go run main.go
```

Backend runs on http://localhost:8081

### 3. Frontend Setup

```bash
# New terminal
cd financeai-frontend
npm install
npm run dev
```

Frontend runs on http://localhost:8080

### 4. Login

Use any username with password `password123`:

- sarah
- michael
- robert
- emma

## Features

- Dashboard with spending overview
- Budget tracking and progress bars
- AI-powered financial insights
- Interactive chatbot for financial questions
- Recent transactions view
- Category spending breakdown

## Project Structure

```
FinSights/
├── financeai-backend/     # Go backend
├── financeai-frontend/    # React frontend
└── README.md
```

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite
**Backend:** Go, Gin, OpenAI API

## Troubleshooting

**Backend issues:**

- Check port 8081 is free
- Verify Go is installed: `go version`
- Make sure .env file exists

**Frontend issues:**

- Check port 8080 is free
- Verify Node.js: `node --version`
- Try: `rm -rf node_modules && npm install`

**AI not working:**

- Add valid OpenAI API key to .env file
- Check backend logs for errors

## Demo Accounts

| Username | Description        |
| -------- | ------------------ |
| sarah    | Balanced spending  |
| michael  | High entertainment |
| robert   | Graduate student   |
| emma     | Freshman           |

All accounts use password: `password123`
