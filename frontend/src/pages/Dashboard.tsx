import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Upload, Star, Download, Eye } from 'lucide-react'

function Dashboard() {
  const { currentUser } = useAuth()

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.email}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resources Uploaded</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Data Structures Notes</p>
                  <p className="text-sm text-gray-600">Uploaded 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  45 views
                </span>
                <span className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  12 downloads
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Algorithm Practice Questions</p>
                  <p className="text-sm text-gray-600">Uploaded 1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  89 views
                </span>
                <span className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  34 downloads
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 