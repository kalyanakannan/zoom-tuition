# Frontend Stage
FROM node:18-alpine as frontend-build

# Set working directory
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy all frontend files and build the production files
COPY frontend/ ./
RUN npm run build

# Backend Stage
FROM python:3.10-slim as backend-build

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY server/ ./server

# Copy the frontend build files to the backend's static directory
COPY --from=frontend-build /app/frontend/build ./server/staticfiles

# Collect static files (for Django)
RUN python server/manage.py collectstatic --noinput

# Final Stage
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy dependencies from the backend-build stage
COPY --from=backend-build /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=backend-build /app /app

# Expose the default Django port
EXPOSE 8000

# Start the Django server
CMD ["python", "server/manage.py", "runserver", "0.0.0.0:8000"]
