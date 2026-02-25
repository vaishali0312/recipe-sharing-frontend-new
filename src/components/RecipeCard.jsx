import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { addFavorite } from "../services/recipeService";

export default function RecipeCard({ recipe }) {
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Handle both Supabase (id) and MongoDB (_id) formats
  const recipeId = recipe.id || recipe._id;
  const imageUrl = recipe.image_url || recipe.image || "https://via.placeholder.com/400x300?text=No+Image";

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to add favorites");
      return;
    }
    
    try {
      await addFavorite(recipeId, user.id);
      setIsFavorite(true);
      alert("Added to favorites!");
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition relative">
      <button
        onClick={handleFavorite}
        className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-pink-500' : 'bg-white dark:bg-gray-700'} shadow-md hover:bg-pink-100 dark:hover:bg-pink-900 transition`}
        title="Add to favorites"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
      <Link to={`/recipe/${recipeId}`}>
        <img 
          src={imageUrl} 
          alt={recipe.title}
          className="h-48 w-full object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        <div className="p-4">
          <h2 className="font-semibold text-lg">{recipe.title}</h2>
          <p className="text-sm opacity-70">{recipe.category}</p>
          <span className="text-orange-500 font-medium hover:text-orange-600">
            View →
          </span>
        </div>
      </Link>
    </div>
  );
}
