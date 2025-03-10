import styles from "../styles/layout.module.css";
import gradients from "../styles/gradients.module.css";
import classNames from "classnames";

export const Wrapper = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className={styles.wrapper}>{children}</div>;
};

interface InnerWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const InnerWrapper: React.FC<InnerWrapperProps> = ({
  children,
  className,
}) => {
  const classes = classNames(
    styles.innerWrapper,
    gradients.mainGradient,
    className
  );

  return <div className={classes}>{children}</div>;
};

export const Spacer = ({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <div
      className={styles.spacer}
      style={{ "--width": width, "--height": height } as React.CSSProperties}
    ></div>
  );
};
