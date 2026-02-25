import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecipes()
      .then((res) => {
        // Backend returns array directly
        setRecipes(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="mt-2 text-gray-500">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4 text-lg">{error}</div>
        <p className="text-gray-600">Please start the backend server at http://localhost:5000</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-orange-500 hover:text-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recipe Hub</h1>
        <a 
          href="/create"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          + Add Recipe
        </a>
      </div>
      
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No recipes found.</p>
          <p className="text-gray-600">Create your first recipe to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id || r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
