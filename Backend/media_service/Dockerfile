# Step 1: Base image
FROM python:3.9.11-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Step 4: Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the project files
COPY . .

# Step 6: Expose Django port
EXPOSE 8004

# Step 7: Run the Django app
CMD ["daphne", "-b", "0.0.0.0", "-p", "8004", "media_service.asgi:application"]
