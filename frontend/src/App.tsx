import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import ResourceDetail from './pages/ResourceDetail'
import TestPlatform from './pages/TestPlatform'
import CreateTest from './pages/CreateTest'
import OCRConverter from './components/OCRConverter'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/tests" element={<TestPlatform />} />
            <Route path="/ocr" element={<OCRConverter />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/create-test" 
              element={
                <PrivateRoute>
                  <CreateTest />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App 