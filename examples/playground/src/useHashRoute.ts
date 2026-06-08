import * as React from "react";

/** "#/buttons" -> "buttons"; 빈 해시/"#/" -> "overview". */
function readHash(): string {
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  return raw || "overview";
}

/** URL 해시에서 현재 라우트 키. hashchange로 갱신. */
export function useHashRoute(): string {
  const [route, setRoute] = React.useState(readHash);
  React.useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
