"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/utils";

type EncryptedTextProps = {
    text: string;
    className?: string;
    /**
     * Time in milliseconds between revealing each subsequent real character.
     * Lower is faster. Defaults to 50ms per character.
     */
    revealDelayMs?: number;
    /** Optional custom character set to use for the gibberish effect. */
    charset?: string;
    /**
     * Time in milliseconds between gibberish flips for unrevealed characters.
     * Lower is more jittery. Defaults to 50ms.
     */
    flipDelayMs?: number;
    /** CSS class for styling the encrypted/scrambled characters */
    encryptedClassName?: string;
    /** CSS class for styling the revealed characters */
    revealedClassName?: string;
};

const DEFAULT_CHARSET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
    const index = Math.floor(Math.random() * charset.length);
    return charset.charAt(index);
}

function generateGibberishPreservingSpaces(
    original: string,
    charset: string,
): string {
    if (!original) return "";
    let result = "";
    for (let i = 0; i < original.length; i += 1) {
        const ch = original[i];
        result += ch === " " ? " " : generateRandomCharacter(charset);
    }
    return result;
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
    text,
    className,
    revealDelayMs = 50,
    charset = DEFAULT_CHARSET,
    flipDelayMs = 50,
    encryptedClassName,
    revealedClassName,
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    const [revealCount, setRevealCount] = useState<number>(0);
    const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const lastFlipTimeRef = useRef<number>(0);
    const scrambleCharsRef = useRef<string[]>(
        text ? generateGibberishPreservingSpaces(text, charset).split("") : [],
    );
    const isCancelledRef = useRef<boolean>(false);

    const startAnimation = useCallback(() => {
        // Cancel any existing animation
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Reset state for a fresh animation
        const initial = text
            ? generateGibberishPreservingSpaces(text, charset)
            : "";
        scrambleCharsRef.current = initial.split("");
        startTimeRef.current = performance.now();
        lastFlipTimeRef.current = startTimeRef.current;
        setRevealCount(0);
        setIsAnimationComplete(false);
        isCancelledRef.current = false;

        const update = (now: number) => {
            if (isCancelledRef.current) return;

            const elapsedMs = now - startTimeRef.current;
            const totalLength = text.length;
            const currentRevealCount = Math.min(
                totalLength,
                Math.floor(elapsedMs / Math.max(1, revealDelayMs)),
            );

            setRevealCount(currentRevealCount);

            if (currentRevealCount >= totalLength) {
                setIsAnimationComplete(true);
                return;
            }

            // Re-randomize unrevealed scramble characters on an interval
            const timeSinceLastFlip = now - lastFlipTimeRef.current;
            if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
                for (let index = 0; index < totalLength; index += 1) {
                    if (index >= currentRevealCount) {
                        if (text[index] !== " ") {
                            scrambleCharsRef.current[index] =
                                generateRandomCharacter(charset);
                        } else {
                            scrambleCharsRef.current[index] = " ";
                        }
                    }
                }
                lastFlipTimeRef.current = now;
            }

            animationFrameRef.current = requestAnimationFrame(update);
        };

        animationFrameRef.current = requestAnimationFrame(update);
    }, [text, revealDelayMs, charset, flipDelayMs]);

    useEffect(() => {
        if (!isInView) return;
        startAnimation();

        return () => {
            isCancelledRef.current = true;
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInView, startAnimation]);

    const handleMouseEnter = () => {
        if (isAnimationComplete) {
            startAnimation();
        }
    };

    if (!text) return null;

    return (
        <motion.span
            ref={ref}
            className={cn(className, "cursor-pointer")}
            aria-label={text}
            role="text"
            onMouseEnter={handleMouseEnter}
        >
            {text.split("").map((char, index) => {
                const isRevealed = index < revealCount;
                const displayChar = isRevealed
                    ? char
                    : char === " "
                        ? " "
                        : (scrambleCharsRef.current[index] ??
                            generateRandomCharacter(charset));

                return (
                    <span
                        key={index}
                        className={cn(isRevealed ? revealedClassName : encryptedClassName)}
                    >
                        {displayChar}
                    </span>
                );
            })}
        </motion.span>
    );
};
