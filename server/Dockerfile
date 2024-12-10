# Final Stage
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .


# Expose the default Django port
EXPOSE 8000

# Start the Django server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "server.asgi:application"]