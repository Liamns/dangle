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
  { arg }: { arg: { email: string; pw: string } }
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: arg.email,
    password: arg.pw,
  });

  if (error) {
    throw new Error(error.message || AUTH_ERROR_MESSAGE.FAIL_LOGIN);
  }

  return data;
}

export function useSignInMutation() {
  return useSWRMutation("supabase/signIn", signInFetcher);
}
