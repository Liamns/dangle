import styles from "../styles/text.module.css";

interface DangleTextProps {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

export const DangleText: React.FC<DangleTextProps> = ({
  text,
  fontSize,
  fontWeight,
  color,
}) => {
  return (
    <span
      className={styles.dangle}
      style={
        {
          "--font-size": fontSize,
          "--font-weight": fontWeight,
          "--color": color,
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
};

export const Text = ({
  text,
  fontSize,
  fontWeight,
  color,
}: {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}) => {
  return (
    <span
      className={styles.text}
      style={
        {
          "--font-size": fontSize,
          "--font-weight": fontWeight,
          "--color": color,
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
};
