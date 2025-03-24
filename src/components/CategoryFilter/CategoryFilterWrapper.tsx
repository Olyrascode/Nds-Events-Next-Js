"use client";

import React from "react";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import { useRouter } from "next/navigation";

interface CategoryFilterWrapperProps {
  categories: string[];
  selectedCategory: string | null;
  navCategory: string;
}

export default function CategoryFilterWrapper({
  categories,
  selectedCategory,
  navCategory,
}: CategoryFilterWrapperProps) {
  const router = useRouter();

  const handleSelectCategory = (selected: string | null) => {
    if (selected === null) {
      // "Tous" renvoie à la page principale de la navCategory
      router.push(`/${navCategory}`);
    } else {
      router.push(`/${navCategory}/${encodeURIComponent(selected)}`);
    }
  };

  return (
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
    />
  );
}
