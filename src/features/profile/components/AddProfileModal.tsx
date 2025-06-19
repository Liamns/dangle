import Modal from "@/shared/components/modals";
import styles from "./AddProfileModal.module.scss";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import Close from "@/shared/svgs/close.svg";
import { InnerBox, Spacer } from "@/shared/components/layout";
import Image from "next/image";
import { Button } from "@/shared/components/buttons";
import { useRouter } from "next/navigation";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProfileModal({
  isOpen,
  onClose,
}: AddProfileModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContainer}>
        {/* 타이틀바 */}
        <div className={styles.titleBar}>
          <Text
            text="프로필 추가"
            fontWeight="bold"
            fontSize="md"
            color={Colors.background}
          />
          <div className={styles.closeButton}>
            <Close width={10} height={10} onClick={onClose} />
          </div>
        </div>

        {/* 모달 내용 */}
        <InnerBox px="27" py="24">
          <Text
            text={`새로운 프로필을\n만들어 주세요!`}
            color={Colors.invalid}
            fontWeight="bold"
            fontSize="lg"
          />
          <div className={styles.imgContainer}>
            <Image
              src="/images/shared/empty/addProfileModal.png"
              alt="새로운 프로필 등록"
              fill
            />
          </div>
          <Spacer height="27" />
          <Button
            width="246"
            color={Colors.primary}
            textColor={Colors.brown}
            fontWeight="bold"
            fontSize="md"
            height="37"
            style={{ boxShadow: "1px 2px 2px rgba(0, 0, 0, 0.1)" }}
            onClick={() => router.push("/profile/select-sp?isPlus=true")}
          >
            추가하기
          </Button>
        </InnerBox>
      </div>
    </Modal>
  );
}
