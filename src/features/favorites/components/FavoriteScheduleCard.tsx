"use client";

import styles from "./FavoriteScheduleCard.module.scss";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/shared/components/layout";
import { FavoriteItem } from "../hooks/useFavorites";
import { FavoriteScheduleModel } from "@/entities/schedule/model";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import SortSvg from "@/shared/svgs/sort.svg";
import EmptyFavorites from "./EmptyFavorites";

interface FavoriteScheduleCardProps {
  favorites: FavoriteScheduleModel[];
  onEmptyClick: () => void;
  isSelectMode: boolean;
  onShareClick: (data: FavoriteItem[]) => void;
}

const FavoriteScheduleCard = memo(
  ({
    favorites,
    onEmptyClick,
    isSelectMode,
    onShareClick,
  }: FavoriteScheduleCardProps) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          sortRef.current &&
          !sortRef.current.contains(event.target as Node) &&
          isSortOpen
        ) {
          setIsSortOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSortOpen]);
    const [sortType, setSortType] = useState<"date" | "alias">("date");
    const handleSortChange = (type: "date" | "alias") => {
      setSortType(type);
      setIsSortOpen(false);
    };
    const getSortLabel = (type: "date" | "alias") => {
      return type === "date" ? "최근 등록순" : "별칭순";
    };
    const sortLabel = useMemo(() => getSortLabel(sortType), [sortType]);

    const sorted = useMemo(() => {
      const sort: FavoriteScheduleModel[] = [...favorites];

      return sort.sort((a, b) => {
        if (sortType === "date") {
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        } else {
          return a.alias.localeCompare(b.alias);
        }
      });
    }, [favorites, sortType]);

    const isEmpty = useMemo(() => sorted.length === 0, [sorted]);

    return (
      <Card py="20">
        <div className={styles.container}>
          {/* Sort */}
          <div
            className={styles.sortBox}
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <Text text={sortLabel} color={Colors.brown} fontWeight="bold" />
            <SortSvg className={styles.sortSvg} />

            {isSortOpen && (
              <div
                className={styles.sortSelector}
                ref={sortRef}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={styles.sortOption}
                  onClick={() => handleSortChange("date")}
                >
                  <Text text={getSortLabel("date")} />
                </div>
                <div className={styles.sortSelectorDivider}></div>
                <div
                  className={styles.sortOption}
                  onClick={() => handleSortChange("alias")}
                >
                  <Text text={getSortLabel("alias")} />
                </div>
              </div>
            )}
          </div>
          {/* End of Sort */}

          {/* Content */}
          {!isEmpty ? (
            <EmptyFavorites
              activeTab={"schedule"}
              onEmptyClick={onEmptyClick}
            />
          ) : (
            <div></div>
          )}
          {/* End of Content */}
        </div>
      </Card>
    );
  }
);

FavoriteScheduleCard.displayName = "FavoriteScheduleCard";
export default FavoriteScheduleCard;
