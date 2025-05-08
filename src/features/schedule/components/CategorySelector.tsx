"use client";
import React from "react";
import Image from "next/image";
import {
  MainCategory,
  SubCategory,
  mainCategories,
  getSubCategoriesByMain,
  getSubCategoryImagePath,
} from "@/shared/types/schedule-category";
import { InnerBox } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import styles from "./CategorySelector.module.scss";

interface CategorySelectorProps {
  mainCategory: MainCategory;
  subCategory: SubCategory;
  onCategoryChange: (
    mainCategory: MainCategory,
    subCategory: SubCategory
  ) => void;
}

/**
 * 카테고리 선택 컴포넌트
 * 메인 카테고리와 서브 카테고리를 선택할 수 있는 드롭다운과 아이콘을 제공합니다.
 */
const CategorySelector: React.FC<CategorySelectorProps> = ({
  mainCategory,
  subCategory,
  onCategoryChange,
}) => {
  // 현재 메인 카테고리에 따른 서브 카테고리 목록 가져오기
  const subCategories = getSubCategoriesByMain(mainCategory) as string[];
  
  // 현재 선택된 서브 카테고리에 해당하는 아이콘 경로
  const iconPath = getSubCategoryImagePath(subCategory);

  // 메인 카테고리 변경 핸들러
  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMainCategory = e.target.value as MainCategory;
    const newSubCategories = getSubCategoriesByMain(newMainCategory) as string[];
    // 새 메인 카테고리에 맞는 첫 번째 서브 카테고리 선택
    const newSubCategory = newSubCategories[0] as SubCategory;
    
    onCategoryChange(newMainCategory, newSubCategory);
  };

  // 서브 카테고리 변경 핸들러
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(mainCategory, e.target.value as SubCategory);
  };

  return (
    <InnerBox
      direction="row"
      align="center"
      justify="space-between"
      className={styles.container}
    >
      {/* 메인 카테고리 드롭다운 */}
      <select
        className={styles.mainCategorySelect}
        value={mainCategory}
        onChange={handleMainCategoryChange}
      >
        {mainCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* 카테고리 아이콘 */}
      <div className={styles.iconContainer}>
        {iconPath && (
          <Image
            src={iconPath}
            alt={subCategory}
            width={24}
            height={24}
          />
        )}
      </div>

      <div className={styles.divider}></div>

      {/* 서브 카테고리 드롭다운 */}
      <select
        className={styles.subCategorySelect}
        value={subCategory}
        onChange={handleSubCategoryChange}
      >
        {subCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </InnerBox>
  );
};

export default CategorySelector;
