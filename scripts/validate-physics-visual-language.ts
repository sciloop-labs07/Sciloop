import { isValidPhysicsVisualRecipe, physicsVisualLanguageRecipes, validatePhysicsVisualRecipe } from "../src/physics-visual-language";

const failures = physicsVisualLanguageRecipes.flatMap((recipe) =>
  isValidPhysicsVisualRecipe(recipe)
    ? []
    : [`${recipe.id}: ${validatePhysicsVisualRecipe(recipe).map((issue) => issue.message).join(" | ")}`],
);

if (failures.length > 0) {
  console.error("Physics Visual Language validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${physicsVisualLanguageRecipes.length} canonical physics recipes.`);
}

