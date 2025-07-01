"use client";
import { memo, useCallback, useEffect, useState } from "react";
import styles from "./FavoriteRoutineViewerCard.module.scss";
import { RoutineWithContentsModel } from "@/entities/routine/schema";
import cn from "classnames";
import { RoutineCategoryColors, RoutineType } from "@/entities/routine/types";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import ClickSvg from "@/shared/svgs/click.svg";
import ChevronSvg from "@/shared/svgs/chevron.svg";
import { DEFAULT_ROUTINE_IMAGE_URL } from "@/features/routine/components/WriteRoutineContent";
import Routine from "@/app/routine/page";
import { InnerBox } from "@/shared/components/layout";

interface FavoriteRoutineViewerCardProps {
  routine: RoutineWithContentsModel;
  index: number;
  currentIndex: number;
  isFront: boolean;
  toggleCardFace: (index: number) => void;
  handleSave: (data: RoutineWithContentsModel) => void;
}

const FavoriteRoutineViewerCard = memo(
  ({
    routine,
    index,
    currentIndex,
    isFront,
    toggleCardFace,
    handleSave,
  }: FavoriteRoutineViewerCardProps) => {
    // 이 카드의 콘텐츠 슬라이더 상태
    const [currentSlide, setCurrentSlide] = useState(0);

    // 이 카드의 콘텐츠 슬라이더 설정
    const [slideRef, slideApi] = useEmblaCarousel({
      align: "center",
      containScroll: "keepSnaps",
      loop: false,
      slidesToScroll: 1,
      dragFree: false,
      watchDrag: false, // 드래그 완전 비활성화
    });

    // 슬라이더 이벤트 처리
    useEffect(() => {
      if (slideApi) {
        const updateCurrentSlide = () => {
          setCurrentSlide(slideApi.selectedScrollSnap());
        };

        updateCurrentSlide();
        slideApi.on("select", updateCurrentSlide);

        return () => {
          slideApi.off("select", updateCurrentSlide);
        };
      }
    }, [slideApi]);

    // 내비게이션 핸들러
    const handlePrev = useCallback(() => {
      slideApi?.scrollPrev();
    }, [slideApi]);

    const handleNext = useCallback(() => {
      slideApi?.scrollNext();
    }, [slideApi]);

    return (
      <div
        className={cn(styles.container, {
          [styles.selected]: currentIndex === index,
        })}
      >
        {isFront ? (
          <div
            className={styles.cardContainer}
            style={
              {
                "--routine-card-front-bg":
                  RoutineCategoryColors[routine.category],
              } as React.CSSProperties
            }
            onClick={() => toggleCardFace(index)}
          >
            {/* Front */}
            <div className={styles.upper}>
              <div className={styles.category}>
                <Text
                  text={routine.category}
                  color={Colors.white}
                  fontWeight="bold"
                  fontSize="title"
                />
                <ClickSvg className={styles.clickSvg} />
              </div>
              <div className={styles.name}>
                <Text
                  text={routine.name}
                  color={Colors.black}
                  fontSize="title"
                  fontWeight="bold"
                />
              </div>
            </div>

            <div className={styles.categoryImg}>
              <Image
                src={`/images/routine/${routine.category}.png`}
                alt="루틴 카테고리 이미지"
                fill
              />
            </div>

            <div
              className={cn(styles.type, {
                [styles.caution]: routine.type === RoutineType.CAUTION,
              })}
            >
              <Text
                text={routine.type}
                color={
                  routine.type === RoutineType.CAUTION
                    ? Colors.white
                    : Colors.brown
                }
                fontSize="title"
              />
            </div>
            {/* End of Front */}
          </div>
        ) : (
          <div
            className={cn(styles.cardContainer, styles.content)}
            style={
              {
                "--routine-card-front-bg":
                  RoutineCategoryColors[routine.category],
              } as React.CSSProperties
            }
          >
            {/* Back */}
            {routine.contents && routine.contents.length > 0 ? (
              <div className={styles.backContainer}>
                {/* Carousel */}
                <div className={styles.carousel} ref={slideRef}>
                  <div className={styles.carouselContainer}>
                    {routine.contents.map((content, contentIndex) => (
                      <div className={styles.carouselSlide} key={contentIndex}>
                        {/* Content */}
                        <div className={styles.contentBox}>
                          {/* Content Title */}
                          <div className={styles.contentTitle}>
                            <Text
                              text={routine.category}
                              color={RoutineCategoryColors[routine.category]}
                              fontSize="lg"
                            />
                            <InnerBox justify="space-between" direction="row">
                              <Text
                                text={content.title}
                                color={Colors.black}
                                fontWeight="bold"
                                fontSize="md"
                              />
                              <div
                                className={styles.flipButton}
                                onClick={() => toggleCardFace(index)}
                              >
                                <Text
                                  text="처음으로"
                                  color={Colors.white}
                                  fontWeight="bold"
                                />
                              </div>
                            </InnerBox>
                          </div>

                          {/* Content Image */}
                          <div className={styles.contentImage}>
                            <Image
                              src={
                                content.image
                                  ? content.image
                                  : DEFAULT_ROUTINE_IMAGE_URL
                              }
                              alt="콘텐츠 이미지"
                              fill
                            />
                          </div>

                          {/* Memo */}
                          <div className={styles.memoBox}>
                            <Text
                              text="Memo"
                              color={RoutineCategoryColors[routine.category]}
                              fontSize="md"
                            />
                            <textarea
                              className={styles.memo}
                              value={content.memo}
                              readOnly
                            ></textarea>
                          </div>
                        </div>
                        {/* End of Content */}
                      </div>
                    ))}
                  </div>
                </div>
                {/* End of Carousel */}

                <div className={styles.navigation}>
                  <div
                    className={styles.navigationButton}
                    onClick={handlePrev}
                    style={
                      {
                        "--routine-card-front-bg":
                          RoutineCategoryColors[routine.category],
                      } as React.CSSProperties
                    }
                  >
                    <ChevronSvg className={styles.chevronSvg} />
                  </div>
                  <Text
                    text={`${currentSlide + 1}/${routine.contents.length}`}
                    color={RoutineCategoryColors[routine.category]}
                  />
                  <div
                    className={cn(styles.navigationButton, styles.next)}
                    onClick={handleNext}
                    style={
                      {
                        "--routine-card-front-bg":
                          RoutineCategoryColors[routine.category],
                      } as React.CSSProperties
                    }
                  >
                    <ChevronSvg className={styles.chevronSvg} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.empty}>
                <Text
                  text="등록된 콘텐츠가 없어요."
                  color={Colors.brown}
                  fontSize="lg"
                />
              </div>
            )}
            {/* End of Back */}
          </div>
        )}
      </div>
    );
  }
);

FavoriteRoutineViewerCard.displayName = "FavoriteRoutineViewerCard";
export default FavoriteRoutineViewerCard;
