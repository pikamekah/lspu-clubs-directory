"use client";

type Props = {
  title?: string;
  message?: string;
};

export default function LoadingScreen({
  title = "UniLink",
  message = "Loading your dashboard...",
}: Props) {
  return (
    <main className="relative min-h-screen bg-[#f6fffb] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="h-[760px] w-[760px] animate-[pinwheelWipe_3.8s_ease-in-out_infinite]"
          aria-hidden="true"
        >
          <g opacity="0.75">
            <path d="M100 100 L100 0 A100 100 0 0 1 170.71 29.29 Z" fill="rgba(34, 211, 238, 0.42)" />
            <path d="M100 100 L170.71 29.29 A100 100 0 0 1 200 100 Z" fill="rgba(132, 204, 22, 0.38)" />
            <path d="M100 100 L200 100 A100 100 0 0 1 170.71 170.71 Z" fill="rgba(16, 185, 129, 0.34)" />
            <path d="M100 100 L170.71 170.71 A100 100 0 0 1 100 200 Z" fill="rgba(34, 211, 238, 0.34)" />
            <path d="M100 100 L100 200 A100 100 0 0 1 29.29 170.71 Z" fill="rgba(132, 204, 22, 0.36)" />
            <path d="M100 100 L29.29 170.71 A100 100 0 0 1 0 100 Z" fill="rgba(16, 185, 129, 0.30)" />
            <path d="M100 100 L0 100 A100 100 0 0 1 29.29 29.29 Z" fill="rgba(34, 211, 238, 0.36)" />
            <path d="M100 100 L29.29 29.29 A100 100 0 0 1 100 0 Z" fill="rgba(132, 204, 22, 0.34)" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="absolute -inset-6 bg-gradient-to-r from-cyan-200 to-lime-200 rounded-[40px] blur-2xl opacity-70" />

        <div className="relative bg-white rounded-[36px] px-10 py-12 shadow-xl text-center border border-cyan-100">
          <div className="relative flex justify-center mb-7">
            <div className="absolute h-24 w-24 rounded-full bg-cyan-200 blur-2xl opacity-70 animate-pulse" />

            <div className="relative h-20 w-20 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[3px] shadow-lg animate-pulse">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-lime-500 bg-clip-text text-transparent">
                  U
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-lime-500 bg-clip-text text-transparent">
            {title}
          </h1>

          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            {message}
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-600 animate-bounce" />
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.15s]" />
            <span className="h-3 w-3 rounded-full bg-lime-500 animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    </main>
  );
}