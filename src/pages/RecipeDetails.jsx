import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getRecipe,
  getComments,
  addComment,
  getRatings,
  addRating,
  addFavorite,
  deleteRecipe,
} from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";
import CommentBox from "../components/CommentBox";
import { scaleIngredients } from "../utils/servingsScaler";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [servings, setServings] = useState(1);
  const [originalServings, setOriginalServings] = useState(1);
  const [comments, setComments] = useState([]);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Check for servings in URL query params (for shared links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedServings = params.get('servings');
    if (sharedServings) {
      setServings(parseInt(sharedServings) || 1);
    }
  }, []);

  useEffect(() => {
    // Fetch recipe
    getRecipe(id)
      .then((res) => {
        setRecipe(res.data);
        const originalServ = res.data?.servings || 1;
        setOriginalServings(originalServ);
        // Use URL parameter if available, otherwise use recipe's original
        const params = new URLSearchParams(window.location.search);
        const urlServings = params.get('servings');
        setServings(urlServings ? parseInt(urlServings) : originalServ);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
      });

    // Fetch comments
    getComments(id)
      .then((res) => {
        setComments(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      });

    // Fetch ratings
    getRatings(id)
      .then((res) => {
        setRatingData(res.data || { average: 0, count: 0 });
      })
      .catch((err) => {
        console.error("Error fetching ratings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Generate share URL with current servings
  const generateShareUrl = () => {
    const baseUrl = window.location.origin + "/recipe/" + id;
    const urlWithServings = `${baseUrl}?servings=${servings}`;
    setShareUrl(urlWithServings);
    return urlWithServings;
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    const url = shareUrl || generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Scale ingredients when servings change
  const getScaledIngredients = () => {
    if (!recipe || !recipe.ingredients) return [];
    if (servings === originalServings) return recipe.ingredients;
    return scaleIngredients(recipe.ingredients, originalServings, servings);
  };

  const submitComment = async (text) => {
    if (!user) {
      alert("Please login to comment");
      return;
    }
    try {
      await addComment(id, { text, userId: user.id, userName: user.name });
      // Refresh comments
      const res = await getComments(id);
      setComments(res.data || []);
      alert("Comment added successfully!");
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to add comment");
    }
  };

  const submitRating = async () => {
    if (!user) {
      alert("Please login to rate");
      return;
    }
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      await addRating(id, { value: rating, userId: user.id });
      // Refresh ratings
      const res = await getRatings(id);
      setRatingData(res.data || { average: 0, count: 0 });
      alert("Rating submitted successfully!");
    } catch (err) {
      console.error("Rating error:", err);
      alert("Failed to submit rating");
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }
    try {
      await addFavorite(id, user.id);
      alert("Added to favorites!");
    } catch (err) {
      console.error("Favorite error:", err);
      alert("Failed to add to favorites");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    try {
      await deleteRecipe(id);
      alert("Recipe deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete recipe");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error || "Recipe not found"}</p>
        <Link to="/" className="text-orange-500 hover:text-orange-600">
          Go back to Home
        </Link>
      </div>
    );
  }

  const scaledIngredients = getScaledIngredients();
  const isScaled = servings !== originalServings;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back Link */}
      <Link to="/" className="text-orange-500 hover:text-orange-600 mb-4 inline-block">
        ← Back to Recipes
      </Link>

      {/* Recipe Image */}
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="rounded-xl w-full h-72 object-cover"
        />
      )}

      <h1 className="text-3xl font-bold mt-4">{recipe.title}</h1>
      {recipe.description && <p className="opacity-70 mt-2">{recipe.description}</p>}
      <p className="opacity-70">{recipe.category}</p>

      {/* Rating Display */}
      {ratingData.count > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span>{ratingData.average}</span>
          <span className="text-gray-500">({ratingData.count} ratings)</span>
        </div>
      )}

      {/* Video */}
      {recipe.video_url && (
        <iframe
          className="mt-4 w-full h-64"
          src={recipe.video_url}
          title="recipe video"
          frameBorder="0"
          allowFullScreen
        />
      )}

      {/* Servings Adjuster with Share */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Servings:</span>
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center"
          >
            -
          </button>
          <input
            type="number"
            value={servings}
            min="1"
            className="border rounded px-2 py-1 w-16 dark:bg-gray-700 dark:border-gray-600 text-center"
            onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button
            onClick={() => setServings(servings + 1)}
            className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center"
          >
            +
          </button>
        </div>
        
        {/* Share Button */}
        <button
          onClick={copyShareLink}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          {copied ? "✓ Copied!" : "🔗 Share with Servings"}
        </button>
        
        {isScaled && (
          <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
            ⚠️ Ingredients scaled from {originalServings} to {servings} servings
          </span>
        )}
      </div>

      {/* Ingredients - Now Scaled */}
      <h2 className="font-semibold mt-6 text-xl">Ingredients {isScaled && `(adjusted for ${servings} servings)`}</h2>
      {Array.isArray(scaledIngredients) ? (
        <ul className="list-disc list-inside mt-2 space-y-1">
          {scaledIngredients.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
      ) : (
        <p>{scaledIngredients}</p>
      )}

      {/* Instructions */}
      <h2 className="font-semibold mt-6 text-xl">Instructions</h2>
      {Array.isArray(recipe.instructions) ? (
        <ol className="list-decimal list-inside mt-2 space-y-2">
          {recipe.instructions.map((inst, index) => (
            <li key={index}>{inst}</li>
          ))}
        </ol>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          onClick={handleFavorite}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          ❤️ Add to Favorites
        </button>
        
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          🗑️ Delete Recipe
        </button>
      </div>

      {/* Rating Section */}
      <div className="mt-8 border-t pt-4">
        <h3 className="font-semibold text-lg mb-2">Rate this Recipe</h3>
        <div className="flex items-center gap-4">
          <RatingStars rating={rating} setRating={setRating} />
          <button
            onClick={submitRating}
            className="ml-3 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
          >
            Submit Rating
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 border-t pt-4">
        <h3 className="font-semibold text-lg mb-4">Comments ({comments.length})</h3>
        
        {/* Existing Comments */}
        {comments.length > 0 && (
          <div className="space-y-4 mb-6">
            {comments.map((comment, index) => (
              <div key={comment.id || index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{comment.userName || "Anonymous"}</span>
                  <span className="text-gray-500 text-sm">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <CommentBox onSubmit={submitComment} />
      </div>
    </div>
  );
}
