import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  BookOpen, 
  Upload, 
  User, 
  LogOut, 
  Menu, 
  X,
  Search,
  Home,
  FileText,
  Plus
} from 'lucide-react'

function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Engineering Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              <Home className="h-5 w-5 inline mr-1" />
              Home
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-primary-600 transition-colors">
              <Search className="h-5 w-5 inline mr-1" />
              Resources
            </Link>
            <Link to="/tests" className="text-gray-700 hover:text-primary-600 transition-colors">
              <BookOpen className="h-5 w-5 inline mr-1" />
              Tests
            </Link>
            <Link to="/ocr" className="text-gray-700 hover:text-primary-600 transition-colors">
              <FileText className="h-5 w-5 inline mr-1" />
              OCR
            </Link>
            {currentUser && (
              <>
                <Link to="/upload" className="text-gray-700 hover:text-primary-600 transition-colors">
                  <Upload className="h-5 w-5 inline mr-1" />
                  Upload
                </Link>
                <Link to="/create-test" className="text-gray-700 hover:text-primary-600 transition-colors">
                  <Plus className="h-5 w-5 inline mr-1" />
                  Create Test
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <User className="h-5 w-5" />
                  <span>{currentUser.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                <Home className="h-5 w-5 inline mr-2" />
                Home
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-primary-600 transition-colors">
                <Search className="h-5 w-5 inline mr-2" />
                Resources
              </Link>
              {currentUser && (
                <>
                  <Link to="/upload" className="text-gray-700 hover:text-primary-600 transition-colors">
                    <Upload className="h-5 w-5 inline mr-2" />
                    Upload
                  </Link>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5 inline mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              )}
              {!currentUser && (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="btn-secondary text-center">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 