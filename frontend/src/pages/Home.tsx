import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  FileText, 
  Video, 
  Users, 
  Search, 
  Upload,
  Star,
  Download
} from 'lucide-react'

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Centralized Engineering Resource Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access curated study materials, lecture notes, video playlists, and question banks 
            organized by semester, year, and subject. Save time and reduce academic stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resources" className="btn-primary text-lg px-8 py-3">
              <Search className="h-5 w-5 inline mr-2" />
              Explore Resources
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-8 py-3">
              <Upload className="h-5 w-5 inline mr-2" />
              Start Contributing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white rounded-lg shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Academic Success
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Resources</h3>
              <p className="text-gray-600">
                High-quality PDFs, lecture notes, and reference materials carefully organized by subject and semester.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Playlists</h3>
              <p className="text-gray-600">
                Curated YouTube playlists and video tutorials for complex topics and practical demonstrations.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Question Banks</h3>
              <p className="text-gray-600">
                Comprehensive question banks with previous year papers and practice questions for exam preparation.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find exactly what you need with our intelligent search system that filters by subject, topic, and type.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Ratings</h3>
              <p className="text-gray-600">
                Rate and review resources to help fellow students find the most valuable materials.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Contribute your own materials and suggestions to help build a comprehensive resource library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Platform Statistics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Resources Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Subjects Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of engineering students who are already saving time and improving their grades.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            <Download className="h-5 w-5 inline mr-2" />
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 