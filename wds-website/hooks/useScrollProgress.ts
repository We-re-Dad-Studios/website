import { useScroll, useSpring, useTransform } from "framer-motion";

export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleX = useTransform(smooth, (v) => v);

  return scaleX;
}
