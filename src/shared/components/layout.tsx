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
  display,
  direction,
  justify,
  align,
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
  display?: string;
  direction?: string;
  justify?: string;
  align?: string;
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
          "--display": display,
          "--direction": direction,
          "--justify": justify,
          "--align": align,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

type InputType = "text" | "password" | "email" | "number" | "tel" | "url";

// New TextInput component
export const TextInput = React.forwardRef<
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
    [key: string]: any;
  }
>(function TextInput(props, ref) {
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
    ...rest
  } = props;

  return (
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
        } as React.CSSProperties
      }
      {...rest}
    />
  );
});

// New TextError component
export const TextError = ({ error }: { error?: string | null }) => {
  return (
    <span
      className={classNames(styles.textFieldError, {
        [styles.errorVisible]: error,
      })}
    >
      {error}
    </span>
  );
};

// Refactored TextField component that uses TextInput and TextError
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
      <TextInput
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        backgroundColor={backgroundColor}
        border={border}
        radius={radius}
        color={color}
        fontSize={fontSize}
        height={height}
        width={width}
        {...rest}
      />
      <TextError error={error} />
    </div>
  );
});

export const Center = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.center}>{children}</div>;
};
