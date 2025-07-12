import { useState } from 'react'
import { Upload as UploadIcon, FileText, Video, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../config/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

// Test Firebase connectivity
const testFirebase = async () => {
  try {
    console.log('Testing Firebase connectivity...')
    console.log('Firestore:', db)
    
   
    
    return true
  } catch (error) {
    console.error('Firebase test failed:', error)
    return false
  }
}

function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [semester, setSemester] = useState('')
  const [type, setType] = useState('pdf')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!file) {
        toast.error('Please select a file to upload.')
        setLoading(false)
        return
      }

      if (!currentUser) {
        toast.error('You must be logged in to upload resources.')
        setLoading(false)
        return
      }

      // Check file size (Firestore has limits)
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB for Firestore storage.')
        setLoading(false)
        return
      }

      console.log('Starting upload for file:', file.name)
      console.log('File size:', file.size, 'bytes')
      
      // Convert file to base64
      const reader = new FileReader()
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const resourceData = {
        title,
        description,
        subject,
        semester,
        type,
        fileName: file.name,
        fileSize: file.size,
        fileData: fileData, // Base64 encoded file
        createdAt: Timestamp.now(),
        uploader: currentUser.uid,
        uploaderEmail: currentUser.email,
      }

      console.log('Saving to Firestore:', { ...resourceData, fileData: 'base64_data_here' })
      const docRef = await addDoc(collection(db, 'resources'), resourceData)
      console.log('Document saved with ID:', docRef.id)

      toast.success('Resource uploaded successfully!')
      // Reset form
      setTitle('')
      setDescription('')
      setSubject('')
      setSemester('')
      setType('pdf')
      setFile(null)
    } catch (error: any) {
      console.error('Upload error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      toast.error(`Failed to upload resource: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Resource</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter resource title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Describe the resource content"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Subject</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
                <option value="7th">7th Semester</option>
                <option value="8th">8th Semester</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                <input
                  type="radio"
                  name="type"
                  value="pdf"
                  checked={type === 'pdf'}
                  onChange={(e) => setType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span>PDF</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={type === 'video'}
                  onChange={(e) => setType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <Video className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Video</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                <input
                  type="radio"
                  name="type"
                  value="notes"
                  checked={type === 'notes'}
                  onChange={(e) => setType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Notes</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.mp4,.mov,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary-600 hover:text-primary-500 font-medium">
                  Choose a file
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              {file && (
                <p className="text-sm text-gray-600 mt-2">{file.name}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={testFirebase}
              className="btn-secondary flex-1"
            >
              Test Firebase
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Upload 