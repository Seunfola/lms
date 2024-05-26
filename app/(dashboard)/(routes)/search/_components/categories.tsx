"use client";

import { Category } from "@prisma/client";

import { 
  FcMultipleDevices, 
  FcCommandLine,
  FcEngineering,
  FcComboChart,
  FcCustomerSupport, 
  FcTwoSmartphones, 
  FcTemplate, 
} from 'react-icons/fc';
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Web-Development": FcEngineering,
    "Robotics": FcMultipleDevices,
    "Data-Analysis": FcComboChart,
    "Cloud-Engineering": FcCommandLine,
    "IT-Support": FcCustomerSupport,
    "UI/UX": FcTwoSmartphones,
    "Project-Management": FcTemplate,
};

export const Categories = ({ items, }: CategoriesProps) => {
    return (
        <div className="flex items-center pb-2 overflow-x-auto gap-x-2">
            {items.map((item) => (
                <CategoryItem 
                key={item.id} 
                label={item.name} 
                icon={iconMap[item.name]} 
                value={item.id} />
            ))}
        </div>
    );
};
