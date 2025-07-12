import { useParams } from 'react-router-dom'
import { BookOpen, Download, Star, User, Calendar } from 'lucide-react'

function ResourceDetail() {
  const { id } = useParams<{ id: string }>()

  // Mock resource data
  const resource = {
    id,
    title: 'Data Structures Complete Notes',
    description: 'Comprehensive notes covering all data structures with examples and algorithms.',
    subject: 'Computer Science',
    semester: '3rd',
    rating: 4.8,
    downloads: 156,
    uploader: 'John Doe',
    uploadDate: '2024-04-01',
    type: 'pdf',
    fileUrl: '#',
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>
        </div>
        <p className="text-gray-600 mb-4">{resource.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <span>Subject: {resource.subject}</span>
          <span>Semester: {resource.semester}</span>
          <span className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {resource.rating}
          </span>
          <span className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            {resource.downloads} downloads
          </span>
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            Uploaded by {resource.uploader}
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(resource.uploadDate).toLocaleDateString()}
          </span>
        </div>
        <a
          href={resource.fileUrl}
          download
          className="btn-primary"
        >
          <Download className="h-5 w-5 inline mr-2" />
          Download Resource
        </a>
      </div>
      {/* TODO: Add comments, ratings, and related resources */}
    </div>
  )
}

export default ResourceDetail 