import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../config/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { 
  Plus, 
  Trash2, 
  Save, 
  Wand2, 
  BookOpen, 
  Clock,
  FileText,
  Sparkles,
  Settings,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'
import { geminiService } from '../services/geminiService'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

function CreateTest() {
  const { currentUser } = useAuth()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [duration, setDuration] = useState(30)
  const [totalMarks, setTotalMarks] = useState(100)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const [showAIOptions, setShowAIOptions] = useState(false)

  // Dynamic topic suggestions based on subject
  const getTopicSuggestions = (selectedSubject: string) => {
    const topics: { [key: string]: string[] } = {
      'Computer Science': [
        'Data Structures',
        'Algorithms',
        'Object-Oriented Programming',
        'Database Management',
        'Web Development',
        'Machine Learning',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering',
        'Cybersecurity'
      ],
      'Mathematics': [
        'Calculus',
        'Linear Algebra',
        'Discrete Mathematics',
        'Probability & Statistics',
        'Differential Equations',
        'Number Theory',
        'Graph Theory',
        'Optimization',
        'Numerical Methods',
        'Mathematical Logic'
      ],
      'Physics': [
        'Mechanics',
        'Electromagnetism',
        'Thermodynamics',
        'Quantum Physics',
        'Optics',
        'Wave Motion',
        'Nuclear Physics',
        'Solid State Physics',
        'Fluid Dynamics',
        'Relativity'
      ],
      'Chemistry': [
        'Organic Chemistry',
        'Inorganic Chemistry',
        'Physical Chemistry',
        'Analytical Chemistry',
        'Biochemistry',
        'Chemical Kinetics',
        'Thermodynamics',
        'Electrochemistry',
        'Coordination Chemistry',
        'Polymer Chemistry'
      ],
      'Electronics': [
        'Digital Electronics',
        'Analog Electronics',
        'Microprocessors',
        'Communication Systems',
        'Control Systems',
        'Power Electronics',
        'VLSI Design',
        'Signal Processing',
        'Electromagnetic Theory',
        'Electronic Devices'
      ]
    }
    return topics[selectedSubject] || []
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions]
    if (field === 'options') {
      updatedQuestions[index] = { ...updatedQuestions[index], options: value }
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    }
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const generateQuestionsWithGemini = async () => {
    if (!title || !subject || !topic) {
      toast.error('Please enter test title, subject, and topic first')
      return
    }

    setGeneratingQuestions(true)
    try {
      const generatedQuestions = await geminiService.generateMCQQuestions(
        subject,
        topic,
        difficulty,
        questionCount
      )

      // Convert to our Question format
      const formattedQuestions: Question[] = generatedQuestions.map((q, index) => ({
        id: Date.now().toString() + index,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))

      setQuestions(formattedQuestions)
      toast.success(`Generated ${questionCount} questions for ${topic}!`)
    } catch (error) {
      console.error('Error generating questions:', error)
      toast.error('Failed to generate questions. Please try again.')
    } finally {
      setGeneratingQuestions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !subject) {
      toast.error('Please fill in all required fields')
      return
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`)
        return
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1} has empty options`)
        return
      }
    }

    setLoading(true)
    try {
      const testData = {
        title,
        subject,
        duration,
        totalMarks,
        questions,
        createdAt: Timestamp.now(),
        createdBy: currentUser?.uid,
        createdByEmail: currentUser?.email
      }

      await addDoc(collection(db, 'tests'), testData)
      
      toast.success('Test created successfully!')
      
      // Reset form
      setTitle('')
      setSubject('')
      setDuration(30)
      setTotalMarks(100)
      setQuestions([])
    } catch (error) {
      console.error('Error creating test:', error)
      toast.error('Failed to create test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Test</h1>
        <p className="text-gray-600">Create MCQ tests for students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Test Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Enter test title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setTopic('') // Reset topic when subject changes
                }}
                className="input-field"
                required
              >
                <option value="">Select Subject</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input-field"
                required
                disabled={!subject}
              >
                <option value="">Select Topic</option>
                {getTopicSuggestions(subject).map((topicOption) => (
                  <option key={topicOption} value={topicOption}>
                    {topicOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input-field"
                min="5"
                max="180"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="input-field"
                min="10"
                max="200"
              />
            </div>
          </div>
        </div>

        {/* AI Generation Options */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">AI Generation Options</h2>
            <div className="flex items-center space-x-3">
              {!showAIOptions && subject && topic && (
                <button
                  type="button"
                  onClick={generateQuestionsWithGemini}
                  disabled={generatingQuestions}
                  className="btn-secondary"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generatingQuestions ? 'Generating...' : 'Quick Generate'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAIOptions(!showAIOptions)}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showAIOptions ? 'Hide Options' : 'Show Options'}
              </button>
            </div>
          </div>
          
          {showAIOptions && (
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="input-field"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateQuestionsWithGemini}
                  disabled={generatingQuestions || !subject || !topic}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generatingQuestions ? 'Generating...' : 'Generate Questions'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question Manually
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No questions added yet.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowAIOptions(true)}
                  className="btn-secondary"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </button>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Manually
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="input-field"
                        rows={3}
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${index}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                              className="text-primary-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                              className="input-field flex-1"
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                        className="input-field"
                        rows={2}
                        placeholder="Explain why this is the correct answer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating Test...' : 'Create Test'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTest 