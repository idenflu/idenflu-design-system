import * as React from "react";
import styles from "./Tabs.module.css";

export type TabDescriptor = {
  /** Stable id used for panel matching and hash deep-linking. */
  id: string;
  label: string;
};

type TabsContextValue = {
  activeId: string;
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

const HASH_PREFIX = "tab-";

function readTabFromHash(validIds: readonly string[]): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw.startsWith(HASH_PREFIX)) return null;
  const id = raw.slice(HASH_PREFIX.length);
  return validIds.includes(id) ? id : null;
}

export type TabsProps = {
  tabs: readonly TabDescriptor[];
  /** Falls back to the first tab when omitted or unknown. */
  defaultTab?: string;
  /** Base id used to link tabs and panels via aria attributes. */
  baseId?: string;
  /** Accessible name for the tablist. */
  label?: string;
  children: React.ReactNode;
};

export function Tabs({
  tabs,
  defaultTab,
  baseId = "tabs",
  label = "Documentation tabs",
  children,
}: TabsProps) {
  const ids = React.useMemo(() => tabs.map((tab) => tab.id), [tabs]);
  const fallback = defaultTab && ids.includes(defaultTab) ? defaultTab : tabs[0]?.id;
  const [activeId, setActiveId] = React.useState(fallback);
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const fromHash = readTabFromHash(ids);
    if (fromHash) setActiveId(fromHash);

    const onHashChange = () => {
      const next = readTabFromHash(ids);
      if (next) setActiveId(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [ids]);

  const activate = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") {
      // No element carries this id, so the browser will not scroll-jump.
      window.location.hash = `${HASH_PREFIX}${id}`;
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = ids.indexOf(activeId);
    let nextIndex = current;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (current + 1) % ids.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (current - 1 + ids.length) % ids.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = ids.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextId = ids[nextIndex];
    activate(nextId);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.tabs}>
      <div
        className={`sb-unstyled ${styles.tablist}`}
        role="tablist"
        aria-label={label}
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              data-selected={selected || undefined}
              onClick={() => activate(tab.id)}
              onKeyDown={onKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <TabsContext.Provider value={{ activeId, baseId }}>
        {children}
      </TabsContext.Provider>
    </div>
  );
}

export type TabPanelProps = {
  id: string;
  children: React.ReactNode;
};

export function TabPanel({ id, children }: TabPanelProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabPanel must be rendered inside <Tabs>.");
  }
  const selected = context.activeId === id;
  return (
    <div
      role="tabpanel"
      id={`${context.baseId}-panel-${id}`}
      aria-labelledby={`${context.baseId}-tab-${id}`}
      hidden={!selected}
      tabIndex={0}
      className={styles.panel}
    >
      {children}
    </div>
  );
}
