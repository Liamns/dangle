import styles from "../styles/layout.module.scss";
import gradients from "../styles/gradients.module.css";
import classNames from "classnames";
import React from "react";
import { alignType, directionType, justifyType } from "../types/layout";

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
      style={
        {
          "--spacer-width": width,
          "--spacer-height": height,
        } as React.CSSProperties
      }
    ></div>
  );
};

export const Card = ({
  children,
  px,
  py,
  mx,
  my,
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
  px?: string;
  py?: string;
  mx?: string;
  my?: string;
  width?: string;
  height?: string;
  color?: string;
  radius?: string;
  display?: string;
  direction?: directionType;
  justify?: justifyType;
  align?: alignType;
}) => {
  const calculatedHeight = height
    ? `calc(100dvh / 740 * ${height})`
    : undefined;

  return (
    <div
      className={styles.card}
      style={
        {
          "--card-my": my,
          "--card-mx": mx,
          "--card-width": width,
          "--card-height": calculatedHeight,
          "--card-color": color,
          "--card-radius": radius,
          "--card-display": display,
          "--card-direction": direction,
          "--card-justify": justify,
          "--card-align": align,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.cardInner}
        style={
          {
            "--card-inner-py": py,
            "--card-inner-px": px,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
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
          "--input-background-color": backgroundColor,
          "--input-border": border,
          "--input-radius": radius,
          "--input-text-color": color,
          "--input-font-size": fontSize,
          "--input-height": height,
          "--input-width": width,
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
          "--wrapper-mt": mt,
          "--wrapper-mr": mr,
          "--wrapper-mb": mb,
          "--wrapper-ml": ml,
          "--wrapper-width": width,
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

export const InnerBox = ({
  children,
  justify,
  align,
  direction,
  height,
}: {
  children: React.ReactNode;
  justify?: justifyType;
  align?: alignType;
  direction?: directionType;
  height?: string;
}) => {
  return (
    <div
      className={styles.innerBox}
      style={
        {
          "--inner-box-justify": justify,
          "--inner-box-align": align,
          "--inner-box-direction": direction,
          "--inner-box-height": height,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};
