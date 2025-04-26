"use client";
import styles from "./anniv-widget.module.scss";
import Plus from "@/shared/svgs/plus.svg";
import Cake from "@/shared/svgs/cake.svg";
import Close from "@/shared/svgs/close.svg";
import { InnerBox, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Modal from "@/shared/components/modals";
import { useState } from "react";
import { Button } from "@/shared/components/buttons";

export default function AnnivWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={styles.emptyContainer}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Plus />
        <Spacer height="8" />
        <InnerBox direction="row" align="start">
          <Cake />
          <Spacer width="4" />
          <Text text="기념일 추가" color={Colors.brown} />
        </InnerBox>
      </div>

      {/* 기념일 목록 팝업 */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        style={{ backgroundColor: Colors.transparnet }}
      >
        <div className={styles.listContainer}>
          <div className={styles.listTitle}>
            <Close style={{ opacity: 0 }} />
            <Text
              text="기념일 목록"
              color={Colors.white}
              fontSize="lg"
              fontWeight="bold"
            />
            <Close onClick={() => setIsOpen(false)} />
          </div>
        </div>
        <div className={styles.listContent}>
          <Button
            width="260"
            height="37"
            fontSize="sm"
            fontWeight="bold"
            color={Colors.primary}
            textColor={Colors.brown}
            mt="12"
          >
            <Text text="등록하기" color={Colors.brown} fontWeight="bold" />
          </Button>
        </div>
      </Modal>
    </>
  );
}
