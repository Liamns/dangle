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

export const Card = ({
  children,
  pt,
  pr,
  pb,
  pl,
  mt,
  mr,
  mb,
  ml,
  width,
  height,
  color,
  radius,
}: {
  children: React.ReactNode;
  pt?: string;
  pr?: string;
  pb?: string;
  pl?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
  width?: string;
  height?: string;
  color?: string;
  radius?: string;
}) => {
  return (
    <div
      className={styles.card}
      style={
        {
          "--pt": pt,
          "--pr": pr,
          "--pb": pb,
          "--pl": pl,
          "--mt": mt,
          "--mr": mr,
          "--mb": mb,
          "--ml": ml,
          "--width": width,
          "--height": height,
          "--color": color,
          "--radius": radius,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

type InputType = "text" | "password" | "email" | "number" | "tel" | "url";

export const TextField = ({
  type = "text",
  value,
  onChange,
  placeholder,
  backgroundColor,
  border,
  radius,
  color,
  fontSize,
  height,
  width,
  pl,
  mt,
  mr,
  mb,
  ml,
}: {
  type?: InputType;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  backgroundColor?: string;
  border?: string;
  radius?: string;
  color?: string;
  fontSize?: string;
  height?: string;
  width?: string;
  pl?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
}) => {
  return (
    <input
      type={type}
      className={styles.textField}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={
        {
          "--background-color": backgroundColor,
          "--border": border,
          "--radius": radius,
          "--color": color,
          "--font-size": fontSize,
          "--height": height,
          "--width": width,
          "--pl": pl,
          "--mt": mt,
          "--mr": mr,
          "--mb": mb,
          "--ml": ml,
        } as React.CSSProperties
      }
    />
  );
};
