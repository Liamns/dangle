"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Spacer,
  TextInput,
} from "../../../shared/components/layout";
import { Domains } from "../../../shared/consts/strings";
import { emailSchema } from "../../../entities/user/schema";
import styles from "./EmailInput.module.scss";

interface EmailInputProps {
  value?: string;
  onChange?: (email: string) => void;
  onValidate?: (isValid: boolean) => void;
  placeholder?: string;
  error?: string | null;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value = "",
  onChange,
  onValidate,
  placeholder = "아이디",
  error,
}) => {
  const [localUsername, setLocalUsername] = useState("");
  const [localDomain, setLocalDomain] = useState("gmail.com");
  const [selectedDomainKey, setSelectedDomainKey] = useState<string>("gmail");
  const [customDomain, setCustomDomain] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Parse value prop into username and domain parts
  useEffect(() => {
    if (value && value.includes("@")) {
      const [username, domain] = value.split("@");
      setLocalUsername(username);

      // Check if domain matches any in our list
      const domainKey = Object.entries(Domains).find(
        ([_, domainValue]) => domainValue === domain
      )?.[0];

      if (domainKey) {
        setSelectedDomainKey(domainKey);
        setLocalDomain(domain);
      } else {
        setSelectedDomainKey("etc");
        setCustomDomain(domain);
        setLocalDomain(domain);
      }
    }
  }, [value]);

  // Update parent with combined email
  const updateEmail = (username: string, domain: string) => {
    if (username.length < 1) {
      setValidationError("이메일은 필수 입력사항입니다.");
      return;
    }

    const combinedEmail = domain ? `${username}@${domain}` : username;

    // Validate the email
    const validationResult = emailSchema.safeParse(combinedEmail);
    const isValid = validationResult.success;

    if (!isValid && username && domain) {
      try {
        emailSchema.parse(combinedEmail);
      } catch (err: any) {
        setValidationError(
          err.errors?.[0]?.message || "올바른 이메일 형식이 아닙니다."
        );
      }
    } else {
      setValidationError(null);
    }

    if (onChange) {
      onChange(combinedEmail);
    }

    if (onValidate) {
      onValidate(isValid);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setLocalUsername(newUsername);
    updateEmail(newUsername, localDomain);
  };

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDomainKey = e.target.value;
    setSelectedDomainKey(newDomainKey);

    if (newDomainKey !== "etc") {
      const newDomain = Domains[newDomainKey as keyof typeof Domains];
      setLocalDomain(newDomain);
      updateEmail(localUsername, newDomain);
    } else {
      setLocalDomain(customDomain);
      updateEmail(localUsername, customDomain);
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCustomDomain = e.target.value;
    setCustomDomain(newCustomDomain);
    setLocalDomain(newCustomDomain);
    updateEmail(localUsername, newCustomDomain);
  };

  return (
    <div className={styles.emailInputContainer}>
      <div className={styles.emailInputRow}>
        <TextInput
          type="text"
          value={localUsername}
          onChange={handleUsernameChange}
          placeholder={placeholder}
          required={true}
          style={{ flex: 1 }}
        />
        <span className={styles.atSymbol}>@</span>
        {selectedDomainKey === "etc" ? (
          <TextInput
            type="text"
            value={customDomain}
            onChange={handleCustomDomainChange}
            placeholder="직접 입력"
            style={{ flex: 1 }}
          />
        ) : (
          <select
            className={styles.domainSelect}
            value={selectedDomainKey}
            onChange={handleDomainSelect}
          >
            {Object.entries(Domains).map(([key, domain]) => (
              <option key={key} value={key}>
                {domain}
              </option>
            ))}
            <option value="etc">직접 입력</option>
          </select>
        )}
      </div>

      <span className={styles.errorMessage}>{error || validationError}</span>
    </div>
  );
};
