FROM python:3.11-slim

# Set the working directory
WORKDIR /backend

# Copy only the requirements file first
COPY ./backend/requirements.txt .

COPY ./backend /backend
# Expose the port the application runs on
EXPOSE 5000

# Set environment variables
ENV SPEECH_KEY = 99lRzmb0VUXtYoLzPDWSq7oHo1txQmYs6TmsqLg04WdWxGFo4Q5ZJQQJ99AJACYeBjFXJ3w3AAAYACOGrWa8
ENV SPEECH_REGION = eastus
ENV TRANSLATOR_KEY = 5ZvlD3GwBNHVslT5mGo4vOabALOjvIVVbl2gB2LkfJVUeuKdp1U3JQQJ99AJACYeBjFXJ3w3AAAbACOGvzbg

# Run the application
CMD ["python", "server.py"]
