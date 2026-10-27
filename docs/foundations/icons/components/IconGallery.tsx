import * as React from "react";
import { iconNames, type IconName } from "@idenflu/ui-icons";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import spriteSource from "@idenflu/ui-icons/icons.svg?raw";
import {
  Button,
  Icon,
  IconButton,
  IconSpriteProvider,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@idenflu/ui-react";
import { IconDrawing, iconJsx, readIconDrawings } from "./iconPreview";
import styles from "./IconGallery.module.css";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const previousFocus = document.activeElement;
    const area = document.createElement("textarea");
    area.value = text;
    area.style.cssText = "position:fixed;left:-9999px";
    document.body.appendChild(area);
    area.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      area.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }
  }
}

type CopyState = "idle" | "copying" | "copied" | "error";
type GalleryStyle = React.CSSProperties & {
  "--icon-gallery-size": string;
  "--icon-gallery-panel-height": string;
};

export function IconGallery() {
  const [query, setQuery] = React.useState("");
  const [size, setSize] = React.useState(16);
  const [strokeWidth, setStrokeWidth] = React.useState(1.5);
  const [selectedName, setSelectedName] = React.useState<IconName | null>(null);
  const [panelHeight, setPanelHeight] = React.useState(0);
  const [copyState, setCopyState] = React.useState<CopyState>("idle");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLElement>(null);
  const copyButtonRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const focusPanelRef = React.useRef(false);
  const copyVersionRef = React.useRef(0);
  const id = React.useId();
  const panelId = `${id}-details`;
  const headingId = `${id}-heading`;
  const drawings = React.useMemo(
    () => readIconDrawings(spriteSource),
    [spriteSource],
  );
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = iconNames.filter((name) => name.includes(normalizedQuery));
  const selectedShapes = selectedName ? drawings.get(selectedName) : undefined;
  const jsx = selectedShapes ? iconJsx(selectedShapes, size, strokeWidth) : "";

  React.useEffect(() => {
    copyVersionRef.current += 1;
    setCopyState("idle");
    return () => {
      copyVersionRef.current += 1;
    };
  }, [jsx]);

  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      setPanelHeight(0);
      return;
    }
    // Reserve the actual panel height so the last row remains reachable.
    const measure = () => setPanelHeight(panel.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [selectedName]);

  React.useEffect(() => {
    if (selectedName && focusPanelRef.current) {
      focusPanelRef.current = false;
      copyButtonRef.current?.focus();
    }
  }, [selectedName]);

  const selectIcon = (
    name: IconName,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    triggerRef.current = event.currentTarget;
    focusPanelRef.current = event.detail === 0;
    if (name === selectedName && focusPanelRef.current) {
      focusPanelRef.current = false;
      copyButtonRef.current?.focus();
    }
    setSelectedName(name);
  };

  const closePanel = () => {
    setSelectedName(null);
    focusPanelRef.current = false;
    const trigger = triggerRef.current;
    requestAnimationFrame(() => {
      if (trigger?.isConnected) trigger.focus();
      else searchRef.current?.focus();
    });
  };

  const copyJsx = async () => {
    const version = copyVersionRef.current;
    setCopyState("copying");
    const copied = await copyText(jsx);
    if (version === copyVersionRef.current)
      setCopyState(copied ? "copied" : "error");
  };

  const galleryStyle: GalleryStyle = {
    "--icon-gallery-size": `${size}px`,
    "--icon-gallery-panel-height": `${panelHeight}px`,
  };

  return (
    <IconSpriteProvider href={spriteUrl}>
      <TooltipProvider>
        <section
          className={`sb-unstyled ${styles.gallery}`}
          style={galleryStyle}
          data-details-open={selectedName ? "true" : undefined}
          aria-label="Icon gallery"
          onKeyDown={(event) => {
            if (
              event.key === "Escape" &&
              selectedName &&
              !event.defaultPrevented
            ) {
              event.preventDefault();
              closePanel();
            }
          }}
        >
          <div className={styles.toolbar}>
            <input
              ref={searchRef}
              type="search"
              className={styles.search}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons…"
              aria-label="Search icons"
            />
            <label className={styles.control}>
              <span>
                Stroke width <output>{strokeWidth}</output>
              </span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={strokeWidth}
                aria-label="Stroke width"
                onChange={(event) => setStrokeWidth(Number(event.target.value))}
              />
            </label>
            <label className={styles.control}>
              <span>
                Size <output>{size}px</output>
              </span>
              <input
                type="range"
                min="14"
                max="48"
                step="1"
                value={size}
                aria-label="Size"
                onChange={(event) => setSize(Number(event.target.value))}
              />
            </label>
          </div>
          {filtered.length === 0 ? (
            <p className={styles.empty}>일치하는 아이콘이 없습니다.</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((name) => (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={styles.card}
                      aria-label={`Inspect ${name}`}
                      aria-pressed={selectedName === name}
                      aria-controls={selectedName ? panelId : undefined}
                      onClick={(event) => selectIcon(name, event)}
                    >
                      <IconDrawing
                        shapes={drawings.get(name)!}
                        size={size}
                        strokeWidth={strokeWidth}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
          {selectedName && selectedShapes && (
            <section
              ref={panelRef}
              id={panelId}
              className={styles.panel}
              role="region"
              aria-labelledby={headingId}
            >
              <div className={styles.panelInner}>
                <div className={styles.previewGrid}>
                  <IconDrawing
                    shapes={selectedShapes}
                    size={size}
                    strokeWidth={strokeWidth}
                    grid
                    name={selectedName}
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.detailsHeading}>
                    <h3 id={headingId}>{selectedName}</h3>
                    <IconButton
                      label="Close icon details"
                      icon={<Icon name="close" />}
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      onClick={closePanel}
                    />
                  </div>
                  <p className={styles.metadata}>
                    24 × 24 grid · {size}px · Stroke {strokeWidth}
                  </p>
                  <pre
                    className={styles.code}
                    tabIndex={0}
                    aria-label="JSX code"
                  >
                    <code>{jsx}</code>
                  </pre>
                  <div className={styles.actions}>
                    <Button
                      ref={copyButtonRef}
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      startIcon={<Icon name="copy" />}
                      disabled={copyState === "copying"}
                      onClick={copyJsx}
                    >
                      Copy JSX
                    </Button>
                    <span
                      className={styles.status}
                      role="status"
                      aria-live="polite"
                    >
                      {copyState === "copied"
                        ? "복사되었습니다."
                        : copyState === "error"
                          ? "복사하지 못했습니다. 코드를 직접 선택해 주세요."
                          : ""}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </section>
      </TooltipProvider>
    </IconSpriteProvider>
  );
}
