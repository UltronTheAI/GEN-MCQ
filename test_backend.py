import requests
import argparse

# Function to get output from user prompt
def get_output(prompt):
    url = "http://localhost:5000/get-output"
    params = {"prompt": prompt}
    response = requests.get(url, params=params)
    return response.json()

# Function to generate MCQs
def generate_mcq(text, number_of_questions, level, image=None):
    url = "http://localhost:5000/generate-mcq"
    params = {
        "text": text,
        "number_of_questions": number_of_questions,
        "level": level
    }
    if image:
        params["image"] = image
    response = requests.get(url, params=params)
    return response.json()

# Function to summarize text
def summarize(text, image=None):
    url = "http://localhost:5000/summarize"
    params = {"text": text}
    if image:
        params["image"] = image
    response = requests.get(url, params=params)
    return response.json()

# Function to evaluate answer
def evaluate_answer(question, answer, max_marks):
    url = "http://localhost:5000/evaluate-answer"
    params = {"question": question, "answer": answer, "max_marks": max_marks}
    response = requests.get(url, params=params)
    return response.json()

# Main function to parse command-line arguments and call appropriate functions
def main():
    parser = argparse.ArgumentParser(description="CLI to test Node.js backend")
    subparsers = parser.add_subparsers(dest="command")

    # Subparser for get-output command
    get_output_parser = subparsers.add_parser("get-output", help="Get output from user prompt")
    get_output_parser.add_argument("prompt", type=str, help="User prompt")

    # Subparser for generate-mcq command
    generate_mcq_parser = subparsers.add_parser("generate-mcq", help="Generate MCQs")
    generate_mcq_parser.add_argument("text", type=str, help="Text for MCQs")
    generate_mcq_parser.add_argument("number_of_questions", type=int, help="Number of questions")
    generate_mcq_parser.add_argument("level", type=int, help="Difficulty level")
    generate_mcq_parser.add_argument("--image", type=str, help="Image associated with the text", required=False)

    # Subparser for summarize command
    summarize_parser = subparsers.add_parser("summarize", help="Summarize text")
    summarize_parser.add_argument("text", type=str, help="Text to be summarized")
    summarize_parser.add_argument("--image", type=str, help="Image associated with the text", required=False)

    # Subparser for evaluate-answer command
    evaluate_answer_parser = subparsers.add_parser("evaluate-answer", help="Evaluate answer to a question")
    evaluate_answer_parser.add_argument("question", type=str, help="The question text")
    evaluate_answer_parser.add_argument("answer", type=str, help="The answer text")
    evaluate_answer_parser.add_argument("max_marks", type=int, help="The maximum marks for the question")

    args = parser.parse_args()

    if args.command == "get-output":
        result = get_output(args.prompt)
        print(result)
    elif args.command == "generate-mcq":
        result = generate_mcq(args.text, args.number_of_questions, args.level, args.image)
        print(result)
    elif args.command == "summarize":
        result = summarize(args.text, args.image)
        print(result)
    elif args.command == "evaluate-answer":
        result = evaluate_answer(args.question, args.answer, args.max_marks)
        print(result)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
