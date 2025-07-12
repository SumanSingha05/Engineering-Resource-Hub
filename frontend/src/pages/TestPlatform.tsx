import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../config/firebase'
import { collection, addDoc, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  FileText, 
  Upload,
  Eye,
  Trophy
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Test {
  id: string
  title: string
  subject: string
  duration: number // in minutes
  questions: Question[]
  totalMarks: number
  createdAt: Timestamp
}

interface TestResult {
  id: string
  testId: string
  userId: string
  userEmail: string
  answers: number[]
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number // in minutes
  submittedAt: Timestamp
}

function TestPlatform() {
  const { currentUser } = useAuth()
  const [tests, setTests] = useState<Test[]>([])
  const [currentTest, setCurrentTest] = useState<Test | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTests()
    fetchUserResults()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (testStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        if (timeLeft === 1) {
          submitTest()
        }
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [testStarted, timeLeft])

  const fetchTests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tests'))
      const testsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Test[]
      setTests(testsData)
    } catch (error) {
      console.error('Error fetching tests:', error)
      toast.error('Failed to load tests')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserResults = async () => {
    if (!currentUser) return
    
    try {
      const querySnapshot = await getDocs(collection(db, 'testResults'))
      const results = (querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) as TestResult[])
        .filter(result => result.userId === currentUser.uid)
      setTestResults(results)
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  }

  const startTest = (test: Test) => {
    setCurrentTest(test)
    setCurrentQuestionIndex(0)
    setUserAnswers(new Array(test.questions.length).fill(-1))
    setTestStarted(true)
    setTestCompleted(false)
    setShowResults(false)
    setTimeLeft(test.duration * 60) // Convert to seconds
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentTest?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const submitTest = async () => {
    if (!currentTest || !currentUser) return

    try {
      const correctAnswers = userAnswers.filter((answer, index) => 
        answer === currentTest.questions[index].correctAnswer
      ).length

      const score = (correctAnswers / currentTest.questions.length) * currentTest.totalMarks
      const timeTaken = currentTest.duration - Math.floor(timeLeft / 60)

      const result: Omit<TestResult, 'id'> = {
        testId: currentTest.id,
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        answers: userAnswers,
        score: Math.round(score * 100) / 100,
        totalQuestions: currentTest.questions.length,
        correctAnswers,
        timeTaken,
        submittedAt: Timestamp.now()
      }

      await addDoc(collection(db, 'testResults'), result)
      
      setTestCompleted(true)
      setTestStarted(false)
      setShowResults(true)
      
      toast.success('Test submitted successfully!')
      fetchUserResults() // Refresh results
    } catch (error) {
      console.error('Error submitting test:', error)
      toast.error('Failed to submit test')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentResult = () => {
    if (!currentTest) return null
    return testResults.find(result => result.testId === currentTest.id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test platform...</p>
        </div>
      </div>
    )
  }

  if (testStarted && currentTest) {
    const currentQuestion = currentTest.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Test Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentTest.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-red-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentTest.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={index}
                  checked={userAnswers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="sr-only"
                />
                <span className="flex-shrink-0 w-6 h-6 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                  {userAnswers[currentQuestionIndex] === index && (
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  )}
                </span>
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-4">
            {currentQuestionIndex === currentTest.questions.length - 1 ? (
              <button
                onClick={submitTest}
                className="btn-primary"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (showResults && currentTest) {
    const result = getCurrentResult()
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-8">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
            <p className="text-gray-600">{currentTest.title}</p>
          </div>

          {result && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{result.score}</div>
                <div className="text-sm text-green-600">Total Score</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{result.correctAnswers}/{result.totalQuestions}</div>
                <div className="text-sm text-blue-600">Correct Answers</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{result.timeTaken} min</div>
                <div className="text-sm text-purple-600">Time Taken</div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {currentTest.questions.map((question, index) => {
              const userAnswer = result?.answers[index] ?? -1
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800'
                                : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                            )}
                            {optionIndex === userAnswer && !isCorrect && (
                              <span className="ml-2 text-red-600 font-medium">✗ Your Answer</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setCurrentTest(null)
                setShowResults(false)
                setTestCompleted(false)
              }}
              className="btn-primary"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Platform</h1>
        <p className="text-gray-600">Take MCQ tests and check your performance</p>
      </div>

      {/* Available Tests */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Tests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                  <p className="text-sm text-gray-600">{test.subject}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {test.duration} minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  {test.questions.length} questions
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  {test.totalMarks} marks
                </div>
              </div>

              <button
                onClick={() => startTest(test)}
                className="w-full btn-primary"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Test Results</h2>
        {testResults.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No test results yet. Take a test to see your performance!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correct Answers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testResults.map((result) => {
                    const test = tests.find(t => t.id === result.testId)
                    return (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {test?.title || 'Unknown Test'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {test?.subject || 'Unknown Subject'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {result.score}/{test?.totalMarks || 100}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.correctAnswers}/{result.totalQuestions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.timeTaken} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.submittedAt.toDate().toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestPlatform 