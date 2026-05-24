"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: "delay-0" | "delay-100" | "delay-200" | "delay-300";
  once?: boolean;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = "delay-0",
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }

          return;
        }

        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "-40px 0px -80px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${delay} ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}