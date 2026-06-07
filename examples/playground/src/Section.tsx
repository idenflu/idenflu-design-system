import * as React from "react";

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="pg-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pg-group">
      <h3>{label}</h3>
      {children}
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="pg-row">{children}</div>;
}

export function Col({ children }: { children: React.ReactNode }) {
  return <div className="pg-col">{children}</div>;
}
