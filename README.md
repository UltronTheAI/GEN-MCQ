# Node.js MCQ App with Gemini AI

This is a Node.js backend application for generating MCQs (Multiple Choice Questions), summarizing text, evaluating answers, and more using Gemini AI. The backend is built using Express.js and leverages GoogleGenerativeAI for AI-driven content generation and evaluation.

Live: https://gen-mcq.onrender.com/

## Features

- **Get Output from User Prompt**: Generate content based on a user-provided prompt.
- **Generate MCQs**: Create multiple-choice questions for given text, difficulty level, and optional image.
- **Summarize Text**: Provide a summary of given text with optional image association.
- **Evaluate Answer**: Evaluate a given answer, provide marks based on the expected answer length, and offer detailed feedback and corrections.

## Requirements

- Node.js
- NPM (Node Package Manager)
- GoogleGenerativeAI API Key
- Python (for testing purposes)
- Requests library for Python (install using `pip install requests`)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/UltronTheAI/GEN-MCQ.git
    cd GEN-MCQ
    ```

2. Install dependencies:
    ```bash
    npm install express dotenv @google/generative-ai fs
    ```

3. Create a `.env` file in the project root to store your API key:
    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

## Usage

1. Start the server:
    ```bash
    node app.js
    ```

2. Use the following endpoints to interact with the backend:

### Endpoints

#### 1. Get Output from User Prompt
- **Endpoint:** `/get-output`
- **Method:** GET
- **Parameters:**
  - `prompt` (required): The user prompt to generate content.
- **Response:**
  ```json
  {
    "output": "string"
  }
  ```

#### 2. Generate MCQs
- **Endpoint:** `/generate-mcq`
- **Method:** GET
- **Parameters:**
  - `text` (required): The text for which MCQs need to be generated.
  - `number_of_questions` (required): The number of questions to be generated.
  - `level` (required, 1 to 10): The difficulty level of the questions.
  - `image` (optional): An image associated with the text, if applicable.
- **Response:**
  ```json
  [
    {
      "question": "string",
      "options": ["list of strings"],
      "answer": "integer",
      "explanation": "string"
    }
  ]
  ```

#### 3. Summarize Text
- **Endpoint:** `/summarize`
- **Method:** GET
- **Parameters:**
  - `text` (required): The text to be summarized.
  - `image` (optional): An image associated with the text, if applicable.
- **Response:**
  ```json
  {
    "summary": "string"
  }
  ```

#### 4. Evaluate Answer
- **Endpoint:** `/evaluate-answer`
- **Method:** GET
- **Parameters:**
  - `question` (required): The question text.
  - `answer` (required): The user's answer.
  - `max_marks` (required): The maximum marks for the question.
- **Response:**
  ```json
  {
    "marks_scored": "integer",
    "explanation": "string",
    "correct_answer": "string"
  }
  ```

## Python CLI for Testing

Use the provided Python script (`test_backend.py`) to test the endpoints.

### Installation

1. Ensure Python and pip are installed.
2. Install the requests library:
    ```bash
    pip install requests
    ```

### Usage

1. Run the script to test different endpoints:

- **Get Output from User Prompt:**
    ```bash
    python test_backend.py get-output "Explain how AI works"
    ```

- **Generate MCQs:**
    ```bash
    python test_backend.py generate-mcq "Python Basics" 5 3 --image "path_to_image.jpg"
    ```

- **Summarize Text:**
    ```bash
    python test_backend.py summarize "Photosynthesis is the process used by plants to convert light energy into chemical energy." --image "path_to_image.jpg"
    ```

- **Evaluate Answer:**
    ```bash
    python test_backend.py evaluate-answer "What is the capital of France?" "Paris" 10
    ```

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.
