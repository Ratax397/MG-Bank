/*import Image from "next/image";

import { topCategoryStyles } from "@/constants";
import { cn } from "@/lib/utils";

import { Progress } from "./ui/progress";


const Category = ({ category }: CategoryProps) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
  topCategoryStyles.default;

  return (
    <div className={cn("gap-[18px] flex p-4 rounded-xl", bg)}>
      <figure className={cn("flex-center size-10 rounded-full", circleBg)}>
        <Image src={icon} width={20} height={20} alt={category.name} />
      </figure>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={cn("font-medium", main)}>{category.name}</h2>
          <h3 className={cn("font-normal", count)}>{category.count}</h3>
        </div>
        <Progress
          value={(category.count / category.totalCount) * 100}
          className={cn("h-2 w-full", progressBg)}
          indicatorClassName={cn("h-2 w-full", indicator)}
        />
      </div>
    </div>
  );
};

export default Category
*/

import Image from "next/image";

import { topCategoryStyles } from "@/constants";
import { cn } from "@/lib/utils";

import { Progress } from "./ui/progress";

// Fonction pour mapper les catégories Plaid vers les styles définis
const mapCategoryToStyle = (categoryName: string): string => {
  const categoryMap: { [key: string]: string } = {
    // Food & Drink
    'FOOD_AND_DRINK': 'Food and Drink',
    'Food And Drink': 'Food and Drink',
    
    // Travel & Transportation
    'TRANSPORTATION': 'Travel',
    'Transportation': 'Travel',
    'TRAVEL': 'Travel',
    'Travel': 'Travel',
    
    // General Merchandise
    'GENERAL_MERCHANDISE': 'General Merchandise',
    'General Merchandise': 'General Merchandise',
    
    // Income
    'INCOME': 'Income',
    'Income': 'Income',
    
    // Loan Payments
    'LOAN_PAYMENTS': 'Loan Payments',
    'Loan Payments': 'Loan Payments',
    
    // Transfer
    'TRANSFER': 'Transfer',
    'TRANSFER_IN': 'Transfer',
    'TRANSFER_OUT': 'Transfer',
    'Transfer': 'Transfer',
    'Transfert': 'Transfer',
  };

  return categoryMap[categoryName] || 'default';
};

const Category = ({ category }: CategoryProps) => {
  // Mapper le nom de la catégorie vers le style approprié
  const styleKey = mapCategoryToStyle(category.name);
  
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[styleKey as keyof typeof topCategoryStyles] || topCategoryStyles.default;

  // Formater le nom de la catégorie pour l'affichage
  const displayName = category.name
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className={cn("gap-[18px] flex p-4 rounded-xl", bg)}>
      <figure className={cn("flex-center size-10 rounded-full", circleBg)}>
        <Image src={icon} width={20} height={20} alt={displayName} />
      </figure>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={cn("font-medium", main)}>{displayName}</h2>
          <h3 className={cn("font-normal", count)}>{category.count}</h3>
        </div>
        <Progress
          value={(category.count / category.totalCount) * 100}
          className={cn("h-2 w-full", progressBg)}
          indicatorClassName={cn("h-2 w-full", indicator)}
        />
      </div>
    </div>
  );
};

export default Category