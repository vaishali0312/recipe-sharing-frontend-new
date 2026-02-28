# TODO - Recipe Sharing App Fixes

## Task 1: Fix Favorites in Dashboard ✅
- [x] Add automatic refresh in Dashboard when it becomes visible
- [x] Ensure favorites count is reloaded every time Dashboard mounts

## Task 2: Fix Delete from Favorites ✅
- [x] Improve state update logic in Favorites.jsx after deletion
- [x] Add proper error handling and refresh

## Task 3: Expand Ingredient Substitutes ✅
- [x] Update backend/app.js to add substitutes for 20+ common ingredients
- [x] Add more substitutes for each ingredient including dietary options

## Completed Changes:

### 1. Dashboard.jsx (src/pages/Dashboard.jsx)
- Added visibility change event listener to refresh stats when Dashboard becomes visible
- Added focus event listener to refresh stats when window gains focus
- Initial load refreshes stats automatically
- Proper cleanup of event listeners on unmount

### 2. Favorites.jsx (src/pages/Favorites.jsx)
- Implemented optimistic UI updates - update state before API call
- Added state rollback on error for better UX
- Improved error handling with specific error messages
- Preserved existing dashboard refresh functionality

### 3. Backend app.js (backend/app.js)
- Expanded substitutes database from 5 to 25+ ingredients:
  - Dairy: butter, milk, cream, cheese, sour cream, yogurt, buttermilk, heavy cream
  - Eggs: eggs (7 substitutes)
  - Sweeteners: sugar, honey
  - Flours/Starches: flour, cornstarch, baking powder, yeast
  - Fats/Oils: oil, vegetable oil
  - Condiments: vinegar, soy sauce
  - Seasonings: garlic, onion, lemon, lime
  - Grains: bread crumbs, pasta, rice
  - Baking: chocolate, vanilla, cinnamon, nutmeg
- Added dietary compatibility filtering (vegan, dairy-free, gluten-free, keto, etc.)
- Each substitute includes ratio, notes, and dietary tags
