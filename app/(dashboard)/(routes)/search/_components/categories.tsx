"use client"
import { Category } from "@prisma/client";
import { 
  FcSmartphoneTablet, 
  FcCodeFile, 
  FcServer, 
  FcCloud, 
  FcSettings, 
  FcLayout, 
  FcTimeline 
} from 'react-icons/fc';
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Mobile Development": FcSmartphoneTablet,
    "FrontEnd Engineering": FcCodeFile,
    "Backend Engineering": FcServer,
    "Cloud Engineering": FcCloud,
    "IT Support": FcSettings,
    "UI/UX": FcLayout,
    "Project Management": FcTimeline,
};

export const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center pb-2 overflow-x-auto gap-x-2">
            {items.map((item) => (
                <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
            ))}
        </div>
    );
};
