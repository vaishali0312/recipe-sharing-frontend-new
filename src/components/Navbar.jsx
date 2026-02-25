import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
      <Link to="/" className="text-2xl font-bold text-orange-500">🍲 RecipeHub</Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">Home</Link>
        
        {user && (
          <>
            <Link to="/create" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">Create Recipe</Link>
            <Link to="/favorites" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">Favorites</Link>
          </>
        )}
        
        <Link to="/meal-planner" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">Meal Planner</Link>
        <Link to="/dashboard" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">Dashboard</Link>
        <Link to="/forum" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">Forum</Link>
        <Link to="/ai" className="hover:text-orange-500 transition text-gray-700 dark:text-gray-200">AI Suggestions</Link>
        <DarkModeToggle />
        
        {user ? (
          <button 
            onClick={logout}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-700 dark:text-gray-200"
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
