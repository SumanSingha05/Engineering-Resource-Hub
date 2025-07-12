import { useState, useEffect } from 'react'
import { Search, Filter, BookOpen, Video, FileText, Star, Download } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

function Resources() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'resources'))
      const resourcesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setResources(resourcesData)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (resource: any) => {
    if (resource.fileData) {
      // Create a download link for base64 file
      const link = document.createElement('a')
      link.href = resource.fileData
      link.download = resource.fileName || 'resource'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Study Resources</h1>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="notes">Notes</option>
              </select>
            </div>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading resources...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: any) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-100 p-2 rounded-lg">
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{resource.subject}</span>
                <span>{resource.semester} Semester</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-gray-500">
                  <Download className="h-4 w-4 mr-1" />
                  {resource.fileSize ? `${Math.round(resource.fileSize / 1024)} KB` : 'Unknown size'}
                </span>
                <button 
                  onClick={() => handleDownload(resource)}
                  className="btn-primary text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Resources 