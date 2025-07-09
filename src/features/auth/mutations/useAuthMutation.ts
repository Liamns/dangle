import { commonHeader } from "@/shared/consts/apis";
import { AUTH_ERROR_MESSAGE } from "../consts";
import useSWRMutation from "swr/mutation";
import { createClient } from "@/shared/lib/supabase/client";

async function signUpFetcher(
  url: string,
  { arg }: { arg: { email: string; password: string } } // 'pw'를 'password'로 변경
) {
  const response = await fetch(url, {
    method: "POST",
    headers: commonHeader,
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || AUTH_ERROR_MESSAGE.FAIL_SIGNUP);
  }

  return response.json();
}

export function useSignUpMutation() {
  return useSWRMutation("/api/auth/sign-up", signUpFetcher);
}

// --- Sign In Logic ---
async function signInFetcher(
  url: string, // Not used by Supabase client, but required by SWR
  { arg }: { arg: { email: string; password: string } }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: commonHeader,
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || AUTH_ERROR_MESSAGE.FAIL_LOGIN);
  }

  return response.json();
}

export function useSignInMutation() {
  return useSWRMutation("/api/auth/sign-in", signInFetcher);
}

async function resetPasswordFetcher(
  url: string,
  { arg }: { arg: { email: string; password: string } }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: commonHeader,
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || AUTH_ERROR_MESSAGE.FAIL_RESET_PASSWORD);
  }

  return response.json();
}

export function useResetPasswordMutation() {
  return useSWRMutation("/api/auth/reset-password", resetPasswordFetcher);
}
