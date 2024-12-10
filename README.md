# Zoom Tuition App

A modern platform for video calls, virtual meetings, and AI-powered educational mentoring. The Zoom Tuition App is designed to provide seamless collaboration and learning experiences.

## Deployed Application

The app is deployed on Heroku and can be accessed using the following link:

- **Live App**: [https://zoom-tuition-app-7bcd79679676.herokuapp.com/login](https://zoom-tuition-app-7bcd79679676.herokuapp.com/login)


## Key Features

- **Video Calls and Meetings**:
  - Create and join meetings effortlessly.
  - User-friendly interface.

- **AI-Powered Mentoring**:
  - Ask questions to an AI assistant for educational support.
  - Supports Markdown and LaTeX for detailed explanations.

- **Real-Time Messaging**:
  - Secure and dynamic WebSocket integration for live chat.
  - Engage in discussions during meetings or in AI chat.

- **Authentication**:
  - Secure login and registration.

- **Meeting Management**:
  - API integration for creating and joining meetings.
  - Access meetings via code or link.

- **Responsive Design**:
  - Built with Tailwind CSS for a modern look.

## Technology Stack

### Frontend
- React
- TailwindCSS

### Backend
- Django (REST Framework)
- Django Channels for WebSocket

### Database
- SQLite (Development)
- PostgreSQL (Production Ready)

### WebSocket
- Real-time communication for messaging and AI interactions

### AI Integration
- OpenAI API for educational support and mentoring

### Running the App in Docker

You can run the app using Docker Compose for a containerized setup. This will set up both the frontend and backend along with any dependencies.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/zoom-tuition-app.git
   cd zoom-tuition-app

2. **Build and Start Containers**: Run the following command to build and start the app:
    ```bash
    docker-compose up --build

3. **Access the App**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000/api](http://localhost:8000/api)
