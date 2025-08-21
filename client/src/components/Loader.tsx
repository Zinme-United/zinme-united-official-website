import { memo, type CSSProperties } from "react";
import Lottie from "lottie-react";
import loadingAnim from "../assets/loading.json";

type LoaderProps = {
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  style?: CSSProperties;
  className?: string;
  fullscreen?: boolean; // 👈 new prop to toggle overlay mode
};

function Loader({
  size = 64,
  loop = true,
  autoplay = true,
  speed = 1,
  style,
  className,
  fullscreen = false,
}: LoaderProps) {
  const content = (
    <Lottie
      animationData={loadingAnim}
      loop={loop}
      autoplay={autoplay}
      // @ts-expect-error lottie-react forwards this to lottie-web
      speed={speed}
      style={{ background: "transparent" }}
    />
  );

  if (fullscreen) {
    return (
      <div
        className={className}
        aria-label="Loading"
        role="status"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "grid",
          placeItems: "center",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          ...style,
        }}
      >
        <div style={{ width: size, height: size }}>{content}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        ...style,
      }}
      className={className}
      aria-label="Loading"
      role="status"
    >
      {content}
    </div>
  );
}

export default memo(Loader);
