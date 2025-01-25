# AI Interview Mocker

AI Interview Mocker is a web application designed to help users practice mock interviews with the assistance of AI. The platform allows users to create custom interviews, answer questions, and receive detailed feedback on their performance. Note that, this is currently under development so it might be buggy in some features.

## Features

### Create Custom Interviews
- Users can create mock interviews tailored to specific job roles by specifying details such as position, description, and required experience.

### Dynamic Question Generation
- Leverages AI to generate a unique set of interview questions based on the provided job details.

### Speech-to-Text Answering
- Users can answer questions using speech-to-text technology.

### Real-Time Feedback
- AI evaluates responses in real-time, providing ratings and actionable improvement suggestions.

### Webcam Integration
- Users can record their answers via a live webcam feed for a realistic interview simulation. But the app doesn't store the actual video recording in the database.

### Question Navigation
- Users can easily navigate between questions and review their responses.

### Feedback Review
- After completing the interview, users can view detailed feedback for each question.

## Technologies Used

### Frontend
- **Next.js**: A React framework for server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Webcam**: For webcam integration.
- **React Hook Speech-to-Text**: For speech-to-text functionality.
- **Clerk**: For user authentication.

### Backend
- **Drizzle ORM**: For database interactions.
- **Gemini AI Model**: For generating interview questions and detailed feedback.

### Database
- **PostgreSQL**: Used for storing interview data and user responses.


