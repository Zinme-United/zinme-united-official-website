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
};

function Loader({
  size = 64,
  loop = true,
  autoplay = true,
  speed = 1,
  style,
  className,
}: LoaderProps) {
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
      <Lottie
        animationData={loadingAnim}
        loop={loop}
        autoplay={autoplay}
        // @ts-expect-error lottie-react forwards this to lottie-web
        speed={speed}
      />
    </div>
  );
}

export default memo(Loader);
