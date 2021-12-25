import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

function useMouseOverElementRef(): HTMLElement | null {
  const [element, setElement] = useState<null | HTMLElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const resetHandler = () => {
      if (timeout != null) clearTimeout(timeout);
      !isScrolling && setIsScrolling(true);
      timeout = setTimeout(() => {
        setIsScrolling(false);
        timeout = null;
      }, 100);
    };

    const mouseOverHandler = (ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        if (ev.target.closest("[data-source-ui]")) return;
        let target = ev.target;
        if (!target.dataset.sourcePath) {
          target = target.closest("[data-source-path]") as HTMLElement;
        }
        if (target == null) {
          setElement(null);
        } else if (element !== target) {
          setElement(ev.target);
        }
      }
    };
    addEventListener("mouseover", mouseOverHandler);
    addEventListener("scroll", resetHandler);
    addEventListener("resize", resetHandler);
    return () => {
      removeEventListener("mouseover", mouseOverHandler);
      removeEventListener("scroll", resetHandler);
      removeEventListener("resize", resetHandler);
    };
  }, []);

  if (isScrolling) return null;
  return element;
}

export function Overlay() {
  const ref = useRef<HTMLDivElement>(null);
  const element = useMouseOverElementRef();
  const [active, setActive] = useState(false);

  const [sourceData, setSourceData] = useState<null | {
    rect: DOMRect;
    sourcePath: string;
    sourceDisplayName: string;
    sourceCode?: string;
  }>(null);

  useEffect(() => {
    const blurHandler = () => {
      setActive(false);
    };

    const keyDownHandler = (ev: KeyboardEvent) => {
      if (ev.key === "Shift") setActive(true);
    };
    const keyUpHandler = (ev: KeyboardEvent) => {
      if (ev.key === "Shift") setActive(false);
    };
    addEventListener("blur", blurHandler);

    addEventListener("keydown", keyDownHandler);
    addEventListener("keyup", keyUpHandler);
    return () => {
      removeEventListener("blur", blurHandler);
      removeEventListener("keydown", keyDownHandler);
      removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  useEffect(() => {
    if (!element) return;
    if (!ref.current) return;
    const rect = element.getBoundingClientRect();
    setSourceData({
      rect,
      sourcePath: element.dataset.sourcePath!,
      sourceDisplayName: element.dataset.sourceDisplayName!,
      sourceCode:
        element.dataset.sourceCode &&
        decodeURIComponent(element.dataset.sourceCode),
    });
  }, [element, setSourceData, ref]);

  const isVisible = element && active;
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        background: "rgba(255,255,0,0.1)",
        visibility: isVisible ? "visible" : "hidden",
        display: "grid",
        placeItems: "center",
        userSelect: "none",
        pointerEvents: "none",
        outline: "0.2rem dotted gray",
        boxSizing: "border-box",
        isolation: "isolate",
        left: sourceData?.rect.left,
        top: sourceData?.rect.top,
        width: sourceData?.rect.width,
        height: sourceData?.rect.height,
        cursor: "pointer",
      }}
    >
      {/* <div style={{ position: "relative", width: "100%", height: "100%" }}> */}
      <div
        style={{
          background: "rgba(0,0,255,0.5)",
          color: "#fff",
          padding: 5,
          zIndex: 1,
          borderRadius: 4,
          pointerEvents: "auto",
        }}
        onClick={() => {
          const el = document.createElement("a");
          el.href = sourceData?.sourcePath!;
          el.click();
        }}
      >
        🔗 {sourceData?.sourceDisplayName}
      </div>
      {sourceData?.sourceCode && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            fontFamily: "menlo, monospace",
            background: "rgba(0,0,255,0.8)",
            color: "white",
            borderRadius: 2,
            padding: 3,
            boxSizing: "border-box",
            zIndex: 1,
            width: "100%",
            overflow: "scroll",
          }}
        >
          <pre>
            <code>{sourceData?.sourceCode}</code>
          </pre>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

export function OverlayPortal() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const tooltip = document.createElement("div");
    tooltip.style.isolation = "isolation";
    tooltip.style.pointerEvents = "none";
    tooltip.dataset.sourceUi = "true";
    document.body.appendChild(tooltip);
    setElement(tooltip);
    return () => {
      setElement(null);
      tooltip.remove();
    };
  }, []);
  if (element == null) return <></>;
  return ReactDOM.createPortal(<Overlay />, element);
}
