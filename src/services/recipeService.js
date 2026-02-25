import API from "./api";

// recipes
export const getRecipes = () => API.get("/recipes");
export const getRecipe = (id) => API.get(`/recipes/${id}`);
export const createRecipe = (data) => API.post("/recipes", data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);

// comments
export const getComments = (id) => API.get(`/comments/${id}`);
export const addComment = (id, data) => API.post(`/comments/${id}`, data);

// ratings
export const getRatings = (id) => API.get(`/ratings/${id}`);
export const addRating = (id, data) => API.post(`/ratings/${id}`, data);

// favorites
export const getFavorites = (userId) => API.get(`/favorites/${userId}`);
export const addFavorite = (recipeId, userId) => API.post(`/favorites/${recipeId}`, { userId });
export const removeFavorite = (recipeId, userId) => API.delete(`/favorites/${recipeId}`, { data: { userId } });

// meal planner
export const getMealPlans = () => API.get("/planner");
export const getMealPlan = (id) => API.get(`/planner/${id}`);
export const createMealPlan = (data) => API.post("/planner", data);
export const updateMealPlan = (id, data) => API.put(`/planner/${id}`, data);
export const deleteMealPlan = (id) => API.delete(`/planner/${id}`);

// AI suggestions
export const suggestRecipes = (data) => API.post("/ai/suggest-recipes", data);
export const analyzeNutrition = (data) => API.post("/ai/nutrition", data);
export const getSubstitutes = (data) => API.post("/ai/substitutes", data);
