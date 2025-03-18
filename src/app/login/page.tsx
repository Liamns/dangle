"use client";
import { Card, Spacer, TextField } from "@/shared/components/layout";
import styles from "./page.module.css";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card>
      <span className={styles.title}>이메일 로그인</span>
      <Spacer height="25" />
      <TextField
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
        placeholder="이메일주소를 입력해 주세요."
        type="email"
        mb="15"
      />
      <TextField
        placeholder="비밀번호를 입력해 주세요."
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
    </Card>
  );
}
