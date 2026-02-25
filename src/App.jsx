import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecipeDetails from './pages/RecipeDetails'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import Favorites from './pages/Favorites'
import MealPlanner from './pages/MealPlanner'
import Dashboard from './pages/Dashboard'
import Forum from './pages/Forum'
import AISuggestions from './pages/AISuggestions'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/edit/:id" element={<EditRecipe />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/ai" element={<AISuggestions />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
