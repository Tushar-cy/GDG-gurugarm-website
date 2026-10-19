import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import { MobileDock } from './components/MobileDock'

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const Team = lazy(() => import('./pages/Team'))
const News = lazy(() => import('./pages/News'))
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const TPO = lazy(() => import('./pages/TPO'))
const Signup = lazy(() => import('./pages/Signup'))
const FormSubmission = lazy(() => import('./pages/FormSubmission'))
const FormBuilder = lazy(() => import('./pages/admin/FormBuilder'))
const FormsList = lazy(() => import('./pages/admin/FormsList'))
const FormSubmissions = lazy(() => import('./pages/admin/FormSubmissions'))
const Gallery = lazy(() => import('./pages/Gallery'))
const GalleryFolder = lazy(() => import('./pages/GalleryFolder'))

function App() {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-screen bg-white text-slate-900 overflow-x-hidden relative font-sans">
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-screen mx-auto pb-24 lg:pb-0">
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/gallery/:id" element={<GalleryFolder />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/tpo" element={<TPO />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* Form Builder Routes */}
                  <Route path="/forms/:id" element={<FormSubmission />} />
                  <Route path="/admin/forms" element={<FormsList />} />
                  <Route path="/admin/forms/new" element={<FormBuilder />} />
                  <Route path="/admin/forms/:id/edit" element={<FormBuilder />} />
                  <Route path="/admin/forms/:id/submissions" element={<FormSubmissions />} />
                  <Route path="/admin/forms/event/:eventId" element={<FormBuilder />} />
                </Routes>
              </Suspense>
            </main>
            <MobileDock />
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App