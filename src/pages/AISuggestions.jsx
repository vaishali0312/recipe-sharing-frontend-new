import { useState } from "react";
import { suggestRecipes } from "../services/recipeService";

export default function AISuggestions() {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    try {
      setLoading(true);

      const res = await suggestRecipes({
        ingredients: ingredients.split(","),
        dietary_preference: diet,
      });

      setResults(res.data.suggestions);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        🤖 AI Recipe Suggestions
      </h1>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Enter ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <select
        className="w-full border p-3 rounded mb-3"
        value={diet}
        onChange={(e) => setDiet(e.target.value)}
      >
        <option value="">No Preference</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="keto">Keto</option>
      </select>

      <button
        onClick={handleSuggest}
        className="bg-primary text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Generating..." : "Suggest Recipes"}
      </button>

      {/* RESULTS */}
      <div className="mt-6 space-y-4">
        {results.map((recipe, i) => (
          <div
            key={i}
            className="p-4 bg-white shadow rounded-lg"
          >
            <h2 className="font-semibold text-lg">
              {recipe.title}
            </h2>
            <p className="text-gray-600">
              {recipe.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}