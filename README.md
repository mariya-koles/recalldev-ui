# Recall.dev Frontend

A React TypeScript frontend for the Recall.dev interview question management system. This application provides a modern, responsive interface for managing programming interview questions and flashcards.

## Features

- **Question Management**: Create, view, edit, and delete programming interview questions
- **Tag System**: Organize questions with tags for easy categorization
- **Difficulty Levels**: Questions can be marked as EASY, MEDIUM, or HARD
- **Advanced Search**: Search questions by text content, tags, or difficulty
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Seamless integration with the Spring Boot backend API

## Technology Stack

- **React 18** with TypeScript
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

## Prerequisites

- Node.js 16+ and npm
- The [Recall.dev Backend API](https://github.com/mariya-koles/recalldev-api.git) running on `http://localhost:8080`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
REACT_APP_API_URL=http://localhost:8080/api
```

### 3. Start the Development Server

```bash
npm start
```

The application will start on `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with navigation
│   └── QuestionCard.tsx        # Individual question display component
├── pages/
│   ├── Questions.tsx           # Main questions list page
│   ├── QuestionForm.tsx        # Create/edit question form
│   ├── Search.tsx              # Advanced search page
│   └── Tags.tsx                # Tag management page
├── services/
│   └── api.ts                  # API service for backend communication
├── types/
│   └── index.ts                # TypeScript type definitions
├── App.tsx                     # Main app component with routing
└── index.css                   # Tailwind CSS styles
```

## API Integration

The frontend integrates with the Spring Boot backend API with the following endpoints:

### Questions API
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question
- `GET /api/questions/search?keyword={keyword}` - Search questions
- `GET /api/questions/difficulty/{difficulty}` - Filter by difficulty
- `GET /api/questions/tag/{tagName}` - Filter by tag

### Tags API
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `PUT /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag

## Features Overview

### Question Management
- **Create Questions**: Add new interview questions with answers and difficulty levels
- **Edit Questions**: Update existing questions and their properties
- **Delete Questions**: Remove questions with confirmation
- **View Questions**: Display questions with expandable answers
- **Tag Assignment**: Add and remove tags from questions

### Search & Filtering
- **Keyword Search**: Search through question text and answers
- **Difficulty Filter**: Filter questions by EASY, MEDIUM, or HARD
- **Tag Filter**: Filter questions by one or multiple tags
- **Combined Filters**: Use multiple filters simultaneously

### Tag Management
- **Create Tags**: Add new tags for organizing questions
- **Edit Tags**: Rename existing tags
- **Delete Tags**: Remove tags (removes from all questions)
- **Tag Statistics**: View question count for each tag

## UI Components

### Custom Tailwind Classes
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-danger` - Destructive action buttons
- `.input-field` - Form input styling
- `.card` - Card container styling

### Color Scheme
- **Primary**: Blue theme (`primary-*` classes)
- **Difficulty Colors**:
  - Easy: Green (`bg-green-100 text-green-800`)
  - Medium: Yellow (`bg-yellow-100 text-yellow-800`)
  - Hard: Red (`bg-red-100 text-red-800`)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

The project uses TypeScript with strict type checking and follows React best practices:

- Functional components with hooks
- TypeScript interfaces for type safety
- Async/await for API calls
- Error handling and loading states
- Responsive design patterns

## Backend Integration

This frontend is designed to work with the [Recall.dev Backend API](https://github.com/mariya-koles/recalldev-api.git). Make sure the backend is running before starting the frontend.

### Backend Setup
1. Clone the backend repository
2. Set up PostgreSQL database
3. Run the Spring Boot application on port 8080
4. The frontend will automatically connect to `http://localhost:8080/api`

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Environment Variables

For production deployment, set:
- `REACT_APP_API_URL` - URL of your deployed backend API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Recall.dev interview preparation system.
