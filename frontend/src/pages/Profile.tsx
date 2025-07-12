import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Edit } from 'lucide-react'

function Profile() {
  const { currentUser } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentUser?.displayName || 'User'}
              </h2>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
            <button className="ml-auto btn-secondary">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900">
                    {currentUser?.metadata.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
                <p className="text-sm text-gray-600">
                  {currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Last Sign In</h3>
                <p className="text-sm text-gray-600">
                  {currentUser?.metadata.lastSignInTime 
                    ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-600">Update your account password</p>
          </button>
          
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-600">Manage your notification settings</p>
          </button>
          
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">Privacy Settings</h3>
            <p className="text-sm text-gray-600">Control your privacy and data</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile 