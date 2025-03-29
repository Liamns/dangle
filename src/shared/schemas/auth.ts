import { z } from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, { message: "이메일은 필수 입력사항입니다." })
  .email({ message: "올바른 이메일 형식이 아닙니다." });

// Password validation schema
export const passwordSchema = z
  .string()
  .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." })
  .max(100)
  .regex(/[a-zA-Z]/, {
    message: "비밀번호에 최소 하나의 문자가 포함되어야 합니다.",
  })
  .regex(/[0-9]/, {
    message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다.",
  });

export const emailFormSchema = z.object({
  email: emailSchema,
});

export type EmailFormData = z.infer<typeof emailFormSchema>;

// Login form schema combining email and password
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Type for the login form data derived from the schema
export type LoginFormData = z.infer<typeof loginFormSchema>;

// Signup form schema with potentially different requirements
export const passwordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

// Type for the password form data derived from the schema
export type PasswordFormData = z.infer<typeof passwordFormSchema>;

export const authNumberSchema = z
  .string()
  .length(6, {
    message: "인증번호는 6자리입니다.",
  })
  .regex(/[0-9]/, {
    message: "인증번호는 숫자만 포함되어야 합니다.",
  });
export const authNumberFormSchema = z.object({
  authNumber: authNumberSchema,
});
export type AuthNumberFormData = z.infer<typeof authNumberFormSchema>;
