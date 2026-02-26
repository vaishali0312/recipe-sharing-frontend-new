import { useState } from "react";
import { getSubstitutes } from "../services/recipeService";

export default function IngredientSubstitutes({ ingredients = [] }) {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dietary, setDietary] = useState("");

  const handleSearch = async () => {
    if (!selectedIngredient) return;
    
    setLoading(true);
    try {
      const res = await getSubstitutes({ 
        ingredient: selectedIngredient,
        dietary: dietary || undefined
      });
      setSubstitutes(res.data.substitutes || []);
    } catch (err) {
      console.error("Error fetching substitutes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="font-semibold text-lg mb-4">🥗 Ingredient Substitutes</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Find alternative ingredients for dietary restrictions or preferences
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Select an ingredient</option>
          {ingredients.map((ing, idx) => (
            <option key={idx} value={ing}>{ing}</option>
          ))}
        </select>
        
        <select
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">No dietary restriction</option>
          <option value="vegan">Vegan</option>
          <option value="gluten_free">Gluten-Free</option>
          <option value="dairy_free">Dairy-Free</option>
        </select>
        
        <button
          onClick={handleSearch}
          disabled={!selectedIngredient || loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find Substitutes"}
        </button>
      </div>

      {substitutes.length > 0 && (
        <div className="space-y-3">
          {substitutes.map((sub, idx) => (
            <div key={idx} className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
              <div className="font-medium text-green-700 dark:text-green-300">
                {sub.substitute}
              </div>
              {sub.ratio && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ratio: {sub.ratio}
                </div>
              )}
              {sub.notes && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {sub.notes}
                </div>
              )}
              {sub.compatible !== undefined && (
                <div className={`text-sm ${sub.compatible ? 'text-green-600' : 'text-gray-500'}`}>
                  {sub.compatible ? '✓ Compatible with dietary preference' : '⚠ May not match dietary preference'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
