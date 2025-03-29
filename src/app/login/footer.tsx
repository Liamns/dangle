import { Center, Spacer } from "@/shared/components/layout";
import { Text } from "@/shared/components/texts";
import { Colors } from "@/shared/consts/colors";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <>
      <Spacer height="18" />
      <div className={styles.footer}>
        <Center>
          <Text text={`편리한 반려생활,\u00a0`} color={Colors.brown} />
          <Text
            text={`댕글`}
            color={Colors.brown}
            fontFamily="jalnan"
            fontWeight="bold"
          />
        </Center>
      </div>

      <Spacer height="18" />
    </>
  );
}
