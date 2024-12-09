# Frontend Build Stage
FROM node:20-alpine AS frontend-build

# Set working directory
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy all frontend files and build the production files
COPY frontend/ ./
RUN npm run build

# Final Stage
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY server/ ./server

# Copy frontend build files into the backend's static directory
COPY --from=frontend-build /app/frontend/build ./server/frontend/build

# Collect static files for Django
RUN python server/manage.py collectstatic --noinput

# Expose the default Django port
EXPOSE 8000

# Start the Django server
CMD ["python", "server/manage.py", "runserver", "0.0.0.0:8000"]
