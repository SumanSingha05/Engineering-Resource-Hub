// Gemini API Service for generating MCQ questions and OCR
// Uses the free gemini-1.5-flash model for all operations
// Note: You'll need to set up Google Cloud credentials and enable Gemini API

interface GeminiQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface OCRResult {
  text: string
  confidence: number
}

export class GeminiService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Using free model without API key.')
      console.info('To use paid features, set VITE_GEMINI_API_KEY in your .env file')
    }
  }

  private async makeRequest(endpoint: string, data: any) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file and restart the development server.')
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    return response.json()
  }

  async generateMCQQuestions(
    subject: string,
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    count: number = 5
  ): Promise<GeminiQuestion[]> {
    const prompt = `
Generate ${count} multiple choice questions for ${subject} on the topic of ${topic}.
Difficulty level: ${difficulty}

For each question, provide:
1. A clear, well-formulated question
2. Four options (A, B, C, D)
3. The correct answer (0-3, where 0=A, 1=B, 2=C, 3=D)
4. A brief explanation of why the answer is correct

Format the response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation here"
  }
]

Make sure the questions are relevant, accurate, and appropriate for engineering students.
`

    try {
      const response = await this.makeRequest('gemini-1.5-flash:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })

      const generatedText = response.candidates[0].content.parts[0].text
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from Gemini')
      }

      const questions = JSON.parse(jsonMatch[0])
      return questions
    } catch (error) {
      console.error('Error generating questions:', error)
      throw new Error('Failed to generate questions with Gemini API')
    }
  }

  async extractTextFromImage(imageFile: File): Promise<OCRResult> {
    // Convert image to base64
    const base64Image = await this.fileToBase64(imageFile)
    
    const prompt = `
Analyze this image and extract all the text content. 
Return the extracted text in a clean, readable format.
If there are mathematical equations, preserve them accurately.
If there are diagrams or charts, describe them briefly.
`

    try {
      const response = await this.makeRequest('gemini-1.5-flash:generateContent', {
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image.split(',')[1] // Remove data URL prefix
              }
            }
          ]
        }]
      })

      const extractedText = response.candidates[0].content.parts[0].text
      
      return {
        text: extractedText,
        confidence: 0.9 // Gemini doesn't provide confidence scores, so we estimate
      }
    } catch (error) {
      console.error('Error extracting text from image:', error)
      throw new Error('Failed to extract text from image')
    }
  }

  async convertHandwrittenNotesToText(imageFile: File): Promise<string> {
    const prompt = `
This image contains handwritten notes. Please:
1. Transcribe all handwritten text accurately
2. Preserve the structure and formatting
3. Convert mathematical symbols and equations properly
4. Organize the content in a logical manner
5. If there are diagrams or drawings, describe them

Return the transcribed text in a clean, structured format.
`

    try {
      const base64Image = await this.fileToBase64(imageFile)
      
      const response = await this.makeRequest('gemini-1.5-flash:generateContent', {
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image.split(',')[1]
              }
            }
          ]
        }]
      })

      return response.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Error converting handwritten notes:', error)
      throw new Error('Failed to convert handwritten notes to text')
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async analyzeQuestionPaper(imageFile: File): Promise<{
    questions: GeminiQuestion[]
    title: string
    subject: string
    totalMarks: number
  }> {
    const prompt = `
Analyze this question paper image and extract:
1. The title of the test/exam
2. The subject
3. Total marks
4. All questions with their options and correct answers

Format the response as JSON:
{
  "title": "Test Title",
  "subject": "Subject Name", 
  "totalMarks": 100,
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}
`

    try {
      const base64Image = await this.fileToBase64(imageFile)
      
      const response = await this.makeRequest('gemini-1.5-flash:generateContent', {
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image.split(',')[1]
              }
            }
          ]
        }]
      })

      const generatedText = response.candidates[0].content.parts[0].text
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from Gemini')
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error analyzing question paper:', error)
      throw new Error('Failed to analyze question paper')
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService() 