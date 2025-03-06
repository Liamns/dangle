import styles from "../styles/wrapper.module.css";
import gradients from "../styles/gradients.module.css";
import classNames from "classnames";

export const Wrapper = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const InnerWrapper = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const classes = classNames(styles.innerWrapper, gradients.mainGradient);

  return <div className={classes}>{children}</div>;
};
