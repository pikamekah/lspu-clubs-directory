"use client";

type AnimatedProps = {
  children: React.ReactNode;
  className?: string;
};

export function FadeIn({ children, className = "" }: AnimatedProps) {
  return (
    <div className={`animate-[fadeIn_0.6s_ease-out] ${className}`}>
      {children}
    </div>
  );
}

export function SlideUp({ children, className = "" }: AnimatedProps) {
  return (
    <div className={`animate-[slideUp_0.55s_ease-out] ${className}`}>
      {children}
    </div>
  );
}

export function ScaleIn({ children, className = "" }: AnimatedProps) {
  return (
    <div className={`animate-[scaleIn_0.35s_ease-out] ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
  delay = "delay-0",
}: AnimatedProps & {
  delay?: "delay-0" | "delay-100" | "delay-200" | "delay-300";
}) {
  return (
    <div
      className={`w-full opacity-0 animate-[slideUp_0.5s_ease-out_forwards] ${delay} ${className}`}
    >
      {children}
    </div>
  );
}