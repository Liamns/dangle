"use client";

import useSWRMutation from "swr/mutation";
import { commonHeader } from "@/shared/consts/apis";
import { AUTH_ERROR_MESSAGE } from "../consts";

// 인증번호 발송 fetcher
async function sendVerificationFetcher(
  url: string,
  { arg }: { arg: { email: string; forgot?: boolean } }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: commonHeader,
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || AUTH_ERROR_MESSAGE.FAIL_REQUEST);
  }

  return response.json();
}

// 인증번호 발송 mutation
export function useSendVerificationMutation() {
  return useSWRMutation("/api/auth/send-verification", sendVerificationFetcher);
}

// 인증번호 확인 fetcher
async function confirmVerificationFetcher(
  url: string,
  { arg }: { arg: { email: string; code: string } }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: commonHeader,
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || AUTH_ERROR_MESSAGE.WRONG_CODE);
  }

  return response.json();
}

// 인증번호 확인 mutation
export function useConfirmVerificationMutation() {
  return useSWRMutation(
    "/api/auth/confirm-verification",
    confirmVerificationFetcher
  );
}

// 비밀번호 변경요청
async function passwordResetRequestFetcher(
  url: string,
  { arg }: { arg: { email: string } }
) {
  const response = await fetch(url, {
    method: "POST",
    headers: commonHeader,
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || AUTH_ERROR_MESSAGE.UNKNOWN_EMAIL);
  }
  return response.json();
}

export function usePasswordResetRequest() {
  return useSWRMutation(
    "/api/auth/password-reset-request",
    passwordResetRequestFetcher
  );
}
