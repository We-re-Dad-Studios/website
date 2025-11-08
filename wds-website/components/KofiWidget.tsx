"use client";
import { useEffect } from "react";

export default function KoFiWidget() {
  useEffect(() => {
    if(typeof window === "undefined")return;
    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.onload = () => {
      // @ts-ignore
      kofiWidgetOverlay.draw("weredadstudios", {
        type: "floating-chat",
        "floating-chat.donateButton.text": "Support Us",
        "floating-chat.donateButton.background-color": "#794bc4",
        "floating-chat.donateButton.text-color": "#fff"
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
