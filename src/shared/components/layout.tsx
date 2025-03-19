import styles from "../styles/layout.module.scss";
import gradients from "../styles/gradients.module.css";
import classNames from "classnames";
import React from "react";

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

export const TextField = React.forwardRef<
  HTMLInputElement,
  {
    type?: InputType;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    backgroundColor?: string;
    border?: string;
    radius?: string;
    color?: string;
    fontSize?: string;
    height?: string;
    width?: string;
    pl?: string;
    pt?: string;
    pb?: string;
    mt?: string;
    mr?: string;
    mb?: string;
    ml?: string;
    error?: string | null;
    [key: string]: any;
  }
>(function TextField(props, ref) {
  const {
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
    pt,
    pb,
    mt,
    mr,
    mb,
    ml,
    error,
    ...rest
  } = props;

  return (
    <div
      className={styles.textFieldWrapper}
      style={
        {
          "--mt": mt,
          "--mr": mr,
          "--mb": mb,
          "--ml": ml,
        } as React.CSSProperties
      }
    >
      <input
        ref={ref}
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
            "--pt": pt,
            "--pb": pb,
          } as React.CSSProperties
        }
        {...rest}
      />
      <span
        className={classNames(styles.textFieldError, {
          [styles.errorVisible]: error,
        })}
      >
        {error}
      </span>
    </div>
  );
});

export const Center = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.center}>{children}</div>;
};
