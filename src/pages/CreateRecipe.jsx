import { useState } from "react";
import { createRecipe } from "../services/recipeService";
import { useNavigate } from "react-router-dom";
import RichEditor from "../components/RichEditor";
import API from "../services/api";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    ingredients: "",
    instructions: "",
    image_url: "",
    video_url: "",
    servings: 1
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await API.post("/recipes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setRecipe({ ...recipe, image_url: res.data.url });
    } catch (err) {
      console.error("Image upload error:", err);
      // Fall back to using file URL if upload fails
      const fileUrl = URL.createObjectURL(file);
      setRecipe({ ...recipe, image_url: fileUrl });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting recipe with data:", recipe);
      
      // Format ingredients as array (split by newlines)
      const ingredientsArray = recipe.ingredients
        .split("\n")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      console.log("Formatted ingredients:", ingredientsArray);

      // Format instructions - keep as HTML string from RichEditor
      const formattedData = {
        title: recipe.title,
        ingredients: ingredientsArray,
        instructions: recipe.instructions || "",
        image_url: recipe.image_url || "",
        video_url: recipe.video_url || "",
        category: recipe.category || "",
        servings: parseInt(recipe.servings) || 1
      };

      console.log("Sending to API:", formattedData);

      const response = await createRecipe(formattedData);
      console.log("Recipe created successfully:", response);
      alert("Recipe created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error creating recipe:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || err.message || "Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recipe Title *
          </label>
          <input
            type="text"
            placeholder="Enter recipe title"
            className="input"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <input
            type="text"
            placeholder="e.g., Dessert, Vegan, Italian"
            className="input"
            value={recipe.category}
            onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
          />
        </div>

        {/* Servings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Servings
          </label>
          <input
            type="number"
            min="1"
            className="input w-24"
            value={recipe.servings}
            onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ingredients * (one per line)
          </label>
          <textarea
            placeholder="Enter ingredients, one per line"
            className="input h-32"
            value={recipe.ingredients}
            onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}
            required
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Instructions *
          </label>
          <RichEditor
            value={recipe.instructions}
            onChange={(val) => setRecipe({ ...recipe, instructions: val })}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100
                dark:file:bg-orange-900 dark:file:text-orange-100"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
            {recipe.image_url && (
              <div className="mt-2">
                <img src={recipe.image_url} alt="Preview" className="h-32 w-auto rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setRecipe({ ...recipe, image_url: "" })}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image URL (alternative) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Or Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="input"
            value={recipe.image_url}
            onChange={(e) => setRecipe({ ...recipe, image_url: e.target.value })}
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL
          </label>
          <input
            type="url"
            placeholder="https://youtube.com/..."
            className="input"
            value={recipe.video_url}
            onChange={(e) => setRecipe({ ...recipe, video_url: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Recipe..." : "Save Recipe"}
        </button>
      </form>
    </div>
  );
}
