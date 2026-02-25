import { useEffect, useState, useContext } from "react";
import { getFavorites } from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getFavorites(user.id)
        .then((res) => {
          const favData = res.data || [];
          setFavorites(favData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching favorites:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="p-6 text-center">Loading favorites...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please login to view your favorites.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">❤️ My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No favorites yet.</p>
          <p className="text-gray-400">Start adding recipes to your favorites from the recipe details page!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {favorites.map((r) => (
            <RecipeCard key={r.id || r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
