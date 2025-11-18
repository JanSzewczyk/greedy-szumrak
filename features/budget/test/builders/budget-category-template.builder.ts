import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild, sequence } from "@jackfranklin/test-data-bot";
import { type IconName } from "lucide-react/dynamic";
import { type BudgetCategoryTemplate } from "~/features/budget/types/budget-template";

/**
 * Builder for generating BudgetCategoryTemplate test data.
 *
 * @example
 * // Basic usage (using .one())
 * const category = budgetCategoryTemplateBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const category = budgetCategoryTemplateBuilder();
 *
 * @example
 * // Override specific fields
 * const housing = budgetCategoryTemplateBuilder.one({
 *   overrides: {
 *     id: "housing",
 *     name: "Housing",
 *     icon: "home"
 *   }
 * });
 *
 * @example
 * // Using traits
 * const housing = budgetCategoryTemplateBuilder.one({ traits: ["housing"] });
 * const groceries = budgetCategoryTemplateBuilder.one({ traits: ["groceries"] });
 * const entertainment = budgetCategoryTemplateBuilder.one({ traits: ["entertainment"] });
 */
export const budgetCategoryTemplateBuilder = build<BudgetCategoryTemplate>({
  fields: {
    id: perBuild(() => faker.helpers.slugify(faker.commerce.department()).toLowerCase()),
    name: perBuild(() => faker.commerce.department()),
    description: perBuild(() => faker.commerce.productDescription()),
    icon: perBuild(() =>
      faker.helpers.arrayElement([
        "home",
        "shopping-cart",
        "car",
        "heart",
        "film",
        "coffee",
        "shopping-bag",
        "smartphone",
        "plane",
        "briefcase",
        "graduation-cap",
        "dumbbell",
        "sparkles",
        "piggy-bank",
        "landmark",
        "wallet"
      ] as IconName[])
    ),
    color: perBuild(() => faker.helpers.arrayElement(["#EF4444", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6", "#10B981"])),
    percentage: perBuild(() => faker.number.int({ min: 5, max: 30 })),
    order: sequence(),
    examples: perBuild(() =>
      faker.helpers.arrayElements(
        [
          faker.commerce.product(),
          faker.commerce.product(),
          faker.commerce.product(),
          faker.commerce.product(),
          faker.commerce.product()
        ],
        { min: 2, max: 5 }
      )
    )
  },
  traits: {
    housing: {
      overrides: {
        id: "housing",
        name: "Housing",
        description: "Rent, utilities, internet",
        icon: "home",
        color: "#EF4444",
        percentage: 25,
        examples: ["Rent", "Electricity", "Gas", "Water", "Internet", "Trash"]
      }
    },
    groceries: {
      overrides: {
        id: "groceries",
        name: "Groceries",
        description: "Daily shopping and essentials",
        icon: "shopping-cart",
        color: "#F59E0B",
        percentage: 12,
        examples: ["Supermarket", "Vegetables and fruits", "Bread", "Meat"]
      }
    },
    transportation: {
      overrides: {
        id: "transportation",
        name: "Transportation",
        description: "Commute to work and daily travel",
        icon: "car",
        color: "#3B82F6",
        percentage: 8,
        examples: ["Gas", "Monthly pass", "Uber", "Parking"]
      }
    },
    health: {
      overrides: {
        id: "health",
        name: "Health",
        description: "Health insurance, doctors, medications",
        icon: "heart",
        color: "#EC4899",
        percentage: 5,
        examples: ["Private health insurance", "Medications", "Glasses", "Dentist"]
      }
    },
    entertainment: {
      overrides: {
        id: "entertainment",
        name: "Entertainment",
        description: "Going out, cinema, cultural events",
        icon: "film",
        color: "#8B5CF6",
        percentage: 10,
        examples: ["Cinema", "Theater", "Concerts", "Netflix", "Spotify"]
      }
    },
    diningOut: {
      overrides: {
        id: "dining_out",
        name: "Dining Out & Cafes",
        description: "Eating outside home",
        icon: "coffee",
        color: "#F97316",
        percentage: 8,
        examples: ["Restaurants", "Fast food", "Cafes", "Bars"]
      }
    },
    shopping: {
      overrides: {
        id: "shopping",
        name: "Shopping",
        description: "Clothing, electronics, personal items",
        icon: "shopping-bag",
        color: "#06B6D4",
        percentage: 7,
        examples: ["Clothing", "Shoes", "Electronics", "Accessories"]
      }
    },
    savings: {
      overrides: {
        id: "savings",
        name: "Savings",
        description: "Emergency fund and short-term goals",
        icon: "piggy-bank",
        color: "#10B981",
        percentage: 15,
        examples: ["Emergency fund", "Vacation fund", "New car", "Home down payment"]
      }
    },
    investments: {
      overrides: {
        id: "investments",
        name: "Investments",
        description: "Long-term wealth building",
        icon: "landmark",
        color: "#14B8A6",
        percentage: 5,
        examples: ["Stocks", "ETFs", "Retirement fund", "Real estate"]
      }
    }
  }
});
