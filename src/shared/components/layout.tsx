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
  style = {},
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
  style?: React.CSSProperties;
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
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
};

type InputType = "text" | "password" | "email" | "number" | "tel" | "url";

// Updated TextInput component with suffix support
export const TextInput = React.forwardRef<
  HTMLInputElement,
  {
    type?: InputType;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderFocusColor?: string;
    radius?: string;
    color?: string;
    fontSize?: string;
    height?: string;
    width?: string;
    suffix?: string;
    suffixColor?: string;
    pl?: string;
    [key: string]: any;
  }
>(function TextInput(props, ref) {
  const {
    type = "text",
    value,
    onChange,
    placeholder,
    backgroundColor,
    borderColor,
    borderFocusColor,
    radius,
    color,
    fontSize,
    height,
    width,
    suffix,
    suffixColor,
    pl,
    ...rest
  } = props;

  return (
    <div
      className={styles.textInputWrapper}
      style={{ position: "relative", width }}
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
            "--input-background-color": backgroundColor,
            "--input-border-color": borderColor,
            "--input-border-focus-color": borderFocusColor,
            "--input-radius": radius,
            "--input-text-color": color,
            "--input-font-size": fontSize,
            "--input-height": height,
            "--input-width": width,
            "--input-pl": pl,
          } as React.CSSProperties
        }
        {...rest}
      />
      {suffix && (
        <span
          className={styles.suffix}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize,
            color: suffixColor || color,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
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
    borderColor?: string;
    borderFocusColor?: string;
    radius?: string;
    color?: string;
    fontSize?: string;
    height?: string;
    width?: string;
    mt?: string;
    mr?: string;
    mb?: string;
    ml?: string;
    pl?: string;
    error?: string | null;
    suffix?: string;
    suffixColor?: string;
    [key: string]: any;
  }
>(function TextField(props, ref) {
  const {
    type = "text",
    value,
    onChange,
    placeholder,
    backgroundColor,
    borderColor,
    borderFocusColor,
    radius,
    color,
    fontSize,
    height,
    width,
    mt,
    mr,
    mb,
    ml,
    pl,
    error,
    suffix,
    suffixColor,
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
        borderColor={borderColor}
        borderFocusColor={borderFocusColor}
        radius={radius}
        color={color}
        fontSize={fontSize}
        height={height}
        width={width}
        suffix={suffix}
        suffixColor={suffixColor}
        pl={pl}
        {...rest}
      />
      <TextError error={error} />
    </div>
  );
});

export const Center = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.center}>{children}</div>;
};

export const InnerBox = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    justify?: justifyType;
    align?: alignType;
    direction?: directionType;
    height?: string;
    px?: string;
    py?: string;
    color?: string;
    style?: React.CSSProperties;
    className?: string;
  }
>(function InnerBox(
  {
    children,
    justify,
    align,
    direction,
    height,
    px,
    py,
    color,
    style = {},
    className = "",
  },
  ref
) {
  const combinedClass = classNames(styles.innerBox, className);

  return (
    <div
      ref={ref}
      className={combinedClass}
      style={
        {
          "--inner-box-justify": justify,
          "--inner-box-align": align,
          "--inner-box-direction": direction,
          "--inner-box-height": height,
          "--inner-box-px": px,
          "--inner-box-py": py,
          "--inner-box-color": color,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
});
