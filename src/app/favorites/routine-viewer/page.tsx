"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import { useSearchParams } from "next/navigation";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import { decrypt } from "@/shared/lib/crypto";
import { EMPTY_PROFILE, useProfileStore } from "@/entities/profile/store";
import { InnerWrapper } from "@/shared/components/layout";
import LoadingOverlay from "@/shared/components/LoadingOverlay";
import Image from "next/image";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import useEmblaCarousel from "embla-carousel-react";
import cn from "classnames";
import FavoriteRoutineViewerCard from "@/features/favorites/components/FavoriteRoutineViewerCard";

function FavoriteRoutineViewer() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const [routines, setRoutines] = useState<RoutineWithContentsModel[]>([]);

  useEffect(() => {
    if (!dataParam) return;

    try {
      const decode = decodeURIComponent(dataParam);
      const decryptedText = decrypt(decode);
      const parsedData = JSON.parse(decryptedText);
      setRoutines(parsedData as RoutineWithContentsModel[]);
      console.log("Decrypted and parsed data:", parsedData);
    } catch (e) {
      console.error("Error parsing data:", e);
    }
  }, [dataParam]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const profile = useProfileStore((state) => state.currentProfile);

  const handleSave = useCallback(
    (data: RoutineWithContentsModel) => {
      if (!profile || profile === EMPTY_PROFILE) {
        alert("댕글 회원가입 후 이용해주세요.");
        return;
      }

      console.log("Saving routine:", data);
    },
    [currentIndex, profile]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    loop: false,
    slidesToScroll: 1,
    dragFree: false,
    dragThreshold: 90,
  });

  useEffect(() => {
    if (emblaApi) {
      const applyStyles = () => {
        const slideNodes = emblaApi.slideNodes();
        const selectedIndex = emblaApi.selectedScrollSnap();

        setCurrentIndex(selectedIndex);
      };

      // 초기 스타일 적용
      applyStyles();

      // 슬라이드 변경 시 스타일 적용
      emblaApi.on("select", applyStyles);

      // 클린업
      return () => {
        emblaApi.off("select", applyStyles);
      };
    }
  }, [emblaApi]);

  const [isFront, setIsFront] = useState<boolean[]>([]);
  useEffect(() => {
    if (routines.length > 0) {
      setIsFront(Array(routines.length).fill(true));
    }
  }, [routines]);
  const toggleCardFace = useCallback((index: number) => {
    setIsFront((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  }, []);

  return (
    <InnerWrapper>
      {routines.length > 0 ? (
        <div className={styles.container}>
          {/* Title */}
          <div className={styles.titleBox}>
            <div className={styles.badge}>
              <Image src={"/images/shared/badge.png"} alt="댕글 뱃지" fill />
            </div>

            <div className={styles.title}>
              <Text
                text={`슬기로운 반려생활,\u00a0`}
                color={Colors.brown}
                fontSize="lg"
              />
              <Text
                text="댕글"
                color={Colors.brown}
                fontFamily="jalnan"
                fontWeight="bold"
                fontSize="title"
              />
            </div>

            <div className={styles.subtitle}>
              <Text
                text="따듯하고 편리한 "
                color={Colors.brown}
                fontWeight="bold"
                fontSize="tiny"
              />
              <Text
                text="반려생활을 위하여"
                color={Colors.brown}
                fontSize="tiny"
              />
            </div>
          </div>
          {/* End of Title */}

          {/* Content */}
          <div className={styles.carouselWrapper}>
            {/* Pagination */}
            <div className={styles.pagination}>
              {routines.map((_, index) => {
                return (
                  <div
                    className={cn(styles.paginationDot, {
                      [styles.selected]: currentIndex === index,
                    })}
                    key={index}
                  >
                    <Text
                      text={`${index + 1}`}
                      color={Colors.white}
                      fontWeight="bold"
                    />
                  </div>
                );
              })}
            </div>
            <div className={styles.carousel} ref={emblaRef}>
              {/* Carousel */}
              <div className={styles.carouselContainer}>
                {routines.map((routine, index) => {
                  return (
                    <FavoriteRoutineViewerCard
                      key={index}
                      routine={routine}
                      index={index}
                      currentIndex={currentIndex}
                      isFront={isFront[index]}
                      toggleCardFace={toggleCardFace}
                      handleSave={() => {}}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          {/* End of Content */}
        </div>
      ) : (
        <LoadingOverlay isLoading={!hydrated} />
      )}
    </InnerWrapper>
  );
}

FavoriteRoutineViewer.displayName = "FavoriteRoutineViewer";
export default FavoriteRoutineViewer;
