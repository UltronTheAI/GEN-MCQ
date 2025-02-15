require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const schema = {
  description: "List of recipes",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: {
        type: SchemaType.STRING,
        description: "The question text",
        nullable: false,
      },
      options: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
          description: "Answer option",
        },
        nullable: false,
      },
      answer: {
        type: SchemaType.STRING,
        description: "Correct answer",
        nullable: false,
      },
      explanation: {
        type: SchemaType.STRING,
        description: "Explanation for the correct answer",
        nullable: true,
      },
    },
    required: ["question", "options", "answer"],
  },
};

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  },
});

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}

app.get('/get-output', async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          description: "Response text",
          type: SchemaType.OBJECT,
          properties: {
            output: {
              type: SchemaType.STRING,
              description: "The generated text",
              nullable: false,
            },
          },
          required: ["output"],
        },
      },
    });
    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/generate-mcq', async (req, res) => {
  const { text, number_of_questions, level, image } = req.query;
  if (!text || !number_of_questions || !level) {
    return res.status(400).json({ error: 'Text, number_of_questions, and level are required' });
  }
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    const prompt = `Generate ${number_of_questions} MCQs for the following text at level ${level}: ${text}`;
    
    console.log("Prompt:", prompt); // Log prompt
    const imageParts = image ? [fileToGenerativePart(image, 'image/jpeg')] : [];
    const generatedContent = await model.generateContent([prompt, ...imageParts]);

    console.log("Generated Content:", generatedContent.response.text()); // Log response

    res.json(JSON.parse(generatedContent.response.text()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/summarize', async (req, res) => {
  const { text, image } = req.query;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          description: "Summarized text",
          type: SchemaType.OBJECT,
          properties: {
            summary: {
              type: SchemaType.STRING,
              description: "The summary text",
              nullable: false,
            },
          },
          required: ["summary"],
        },
      },
    });
    const prompt = `Summarize the following text: ${text}`;
    
    console.log("Prompt:", prompt); // Log prompt
    const imageParts = image ? [fileToGenerativePart(image, 'image/jpeg')] : [];
    const generatedContent = await model.generateContent([prompt, ...imageParts]);

    console.log("Generated Content:", generatedContent.response.text()); // Log response

    res.json(JSON.parse(generatedContent.response.text()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/evaluate-answer', async (req, res) => {
    const { question, answer, max_marks } = req.query;
    if (!question || !answer || !max_marks) {
      return res.status(400).json({ error: 'Question, answer, and max_marks are required' });
    }
    
    const minLines = max_marks == 1 ? 1 : max_marks * 2;
    const answerLines = answer.split('\n').length;
    
    if (answerLines < minLines) {
      const missingLines = minLines - answerLines;
      return res.status(400).json({
        error: `Answer is too short. You need to write at least ${missingLines} more lines.`
      });
    }
  
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            description: "Evaluation",
            type: SchemaType.OBJECT,
            properties: {
              marks_scored: {
                type: SchemaType.INTEGER,
                description: "Marks scored for the given answer",
                nullable: false,
              },
              explanation: {
                type: SchemaType.STRING,
                description: "Detailed explanation for the given marks and suggestions for improvement",
                nullable: false,
              },
              correct_answer: {
                type: SchemaType.STRING,
                description: "The correct answer",
                nullable: false,
              },
            },
            required: ["marks_scored", "explanation", "correct_answer"],
          },
        },
      });
      
      const prompt = `Evaluate the following answer to the question. Provide a comprehensive evaluation including marks out of ${max_marks}, detailed explanation of the score, suggestions for improvement, and the correct answer. \n\nQuestion: ${question} \n\nAnswer: ${answer}`;
  
      console.log("Prompt:", prompt); // Log prompt
      const generatedContent = await model.generateContent(prompt);
  
      console.log("Generated Content:", generatedContent.response.text()); // Log response
  
      res.json(JSON.parse(generatedContent.response.text()));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
