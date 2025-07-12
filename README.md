# 🎓 Engineering Resource Hub

A comprehensive MERN stack-based web application designed as a centralized resource hub for engineering students. Built with modern technologies and AI-powered features for enhanced learning experience.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF)

## 🚀 Features

### 📚 Resource Management
- **Upload & Share**: Upload PDFs, videos, and notes with detailed metadata
- **Categorized Resources**: Organize by subject, semester, and resource type
- **Search & Filter**: Find resources quickly with advanced filtering
- **Resource Details**: View comprehensive information about each resource

### 🧪 AI-Powered Test Platform
- **Dynamic Test Creation**: Generate MCQ tests using Gemini AI
- **Smart Question Generation**: AI creates questions based on subject, topic, and difficulty
- **Real-time Testing**: Take tests with timer and progress tracking
- **Instant Results**: Get scores and detailed feedback immediately
- **Performance Analytics**: Track your test performance over time

### 🔍 OCR & Text Conversion
- **Handwritten Notes**: Convert handwritten notes to digital text
- **Image Analysis**: Extract text from images and documents
- **Gemini Vision Integration**: Powered by Google's Gemini AI model
- **High Accuracy**: Advanced OCR with mathematical symbol support

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure email/password and Google OAuth
- **Protected Routes**: Role-based access control
- **User Profiles**: Personalized dashboards and settings
- **Secure File Storage**: Firebase Storage with proper permissions

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on all devices
- **Tailwind CSS**: Beautiful, modern styling
- **Dark/Light Mode**: User preference support
- **Intuitive Navigation**: Clean and accessible interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

### Backend & Services
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Storage** - File storage
- **Google Gemini AI** - AI-powered features

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Google Cloud account (for Gemini AI)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd engineering-resource-hub
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Gemini API Configuration (Optional)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Storage
   - Update Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation component
│   │   ├── OCRConverter.tsx # OCR functionality
│   │   └── PrivateRoute.tsx # Route protection
│   ├── config/             # Configuration files
│   │   └── firebase.ts     # Firebase configuration
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── Resources.tsx   # Resource listing
│   │   ├── Upload.tsx      # Resource upload
│   │   ├── CreateTest.tsx  # Test creation
│   │   ├── TestPlatform.tsx # Test taking platform
│   │   └── Profile.tsx     # User profile
│   ├── services/           # API services
│   │   └── geminiService.ts # Gemini AI integration
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## 🚀 Usage

### For Students
1. **Register/Login**: Create an account or sign in with Google
2. **Browse Resources**: Explore uploaded study materials
3. **Take Tests**: Practice with AI-generated tests
4. **Convert Notes**: Use OCR to digitize handwritten notes
5. **Track Progress**: Monitor your performance in tests

### For Teachers
1. **Create Tests**: Generate MCQ tests using AI
2. **Upload Resources**: Share study materials
3. **Monitor Performance**: View student test results
4. **Customize Content**: Edit and refine AI-generated questions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features in Detail

### AI-Powered Test Generation
- **Dynamic Question Creation**: Generate questions based on subject and topic
- **Difficulty Levels**: Easy, Medium, Hard options
- **Customizable Count**: 3-20 questions per test
- **Smart Explanations**: AI provides detailed explanations for answers

### OCR Capabilities
- **Multi-format Support**: Images, PDFs, handwritten notes
- **Mathematical Symbols**: Preserves equations and formulas
- **High Accuracy**: Powered by Google's Gemini Vision
- **Real-time Processing**: Instant text extraction

### Resource Management
- **File Types**: PDF, Video, Notes, Documents
- **Metadata**: Subject, semester, description, tags
- **Search**: Full-text search across resources
- **Categories**: Organized by engineering subjects

## 🔒 Security Features

- **Authentication**: Firebase Auth with multiple providers
- **Authorization**: Protected routes and resources
- **Data Validation**: Input sanitization and validation
- **Secure Storage**: Firebase Security Rules
- **Environment Variables**: Secure configuration management

## 🎯 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with LMS platforms
- [ ] Video conferencing for study groups
- [ ] Advanced AI tutoring features
- [ ] Gamification elements
- [ ] Export/Import functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Firebase** - Backend services and authentication
- **Google Gemini AI** - AI-powered features
- **Tailwind CSS** - Beautiful styling framework
- **React Community** - Amazing ecosystem and tools
- **Vite** - Fast build tool and development experience

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for Engineering Students** 