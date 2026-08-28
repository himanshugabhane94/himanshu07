'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock } from 'lucide-react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  onResend?: () => void;
  isResending?: boolean;
  resendCooldown?: number; // In seconds, default 30
  hasError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  onResend,
  isResending = false,
  resendCooldown = 30,
  hasError = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const [timer, setTimer] = useState(resendCooldown);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Split current value into array of length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Resend cooldown countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Initial focus on first empty box
  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleResendClick = () => {
    if (timer > 0 || isResending || !onResend) return;
    setTimer(resendCooldown);
    onResend();
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanDigit = rawVal.replace(/[^0-9]/g, '').slice(-1); // Take only the last entered digit

    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto-focus next input if a digit was entered
    if (cleanDigit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === length && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current box is empty, move back and clear previous
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputsRef.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputsRef.current[focusIndex]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="space-y-4">
      {/* 6 Auto-Focus Digit Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[index] || ''}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label={`Digit ${index + 1}`}
            className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-2xl border transition-all duration-200 outline-none select-none font-mono ${
              hasError
                ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-500 shadow-sm'
                : digits[index]
                ? 'border-govNavy-900 bg-govNavy-50/50 text-govNavy-950 shadow-soft-sm'
                : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-govNavy-800 focus:ring-2 focus:ring-govNavy-800/20'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        ))}
      </div>

      {/* Resend Cooldown Timer & Action */}
      {onResend && (
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <div className="flex items-center text-slate-500 font-medium space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Valid for 10 minutes</span>
          </div>

          <div>
            {timer > 0 ? (
              <span className="text-slate-400 font-semibold flex items-center space-x-1">
                <span>Resend code in</span>
                <span className="text-govNavy-900 font-bold font-mono">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendClick}
                disabled={isResending}
                className="text-govNavy-900 hover:text-saffron-600 font-bold inline-flex items-center space-x-1 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'Sending...' : 'Resend OTP'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
