# Backend Image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY server/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project files
COPY server /app/

# Add the frontend build files
COPY frontend/build /app/frontend/build

# Collect Django static files
RUN python manage.py collectstatic --noinput

# Expose the default Django port
EXPOSE 8000

# Start the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
