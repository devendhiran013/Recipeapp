import { useContext, useEffect, useState } from "react"; // Added useState
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  // Added state for recipe details loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecipeDetails() {
      setLoading(true); // Set loading to true when fetching data
      try {
        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );
        const data = await response.json();
        console.log(data);
        if (data?.data) {
          setRecipeDetailsData(data?.data);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    getRecipeDetails();
  }, [id, setRecipeDetailsData]); // Added id and setRecipeDetailsData to dependencies

  console.log(recipeDetailsData, " recipeDetailsData");
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        {/* Added alt attribute */}
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={recipeDetailsData?.recipe?.image_url}
            alt={recipeDetailsData?.recipe?.title || "Recipe Image"}
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-cyan-700 font-medium">
          {recipeDetailsData?.recipe?.publisher}
        </span>
        <h3 className="font-bold text-2xl truncate text-black">
          {recipeDetailsData?.recipe?.title}
        </h3>
        <div>
          <button
            onClick={() => handleAddToFavorite(recipeDetailsData?.recipe)}
            className="p-3 px8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
          >
            {favoritesList &&
            favoritesList.length > 0 &&
            favoritesList.findIndex(
              (item) => item.id === recipeDetailsData?.recipe?.id
            ) !== -1
              ? "Remove from favorites"
              : "Add to favorites"}
          </button>
        </div>
        <div>
          <span className="text-2xl font-semibold text-black">Ingrediants</span>
          <ul className="flex flex-col gap-3">
            {recipeDetailsData?.recipe?.ingredients.map((ingredients, index) => (
              <li key={index}> {/* Added key prop */}
                <span className="text-sm text-cyan-700 font-medium">
                  {ingredients.quantity}
                  {ingredients.unit}
                </span>
                <span className="text-sm text-cyan-700 font-medium">
                  {ingredients.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
