import * as React from "react";
import { createRoot } from "react-dom/client";
import * as UI from "@idenflu/ui-react";
import { IconSpriteProvider } from "@idenflu/ui-react";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import "@idenflu/ui-react/fonts.css";
import "@idenflu/ui-react/styles.css";
import "./studio.css";
import { examples, FormExample, WorkspaceExample } from "./examples";
import { LayoutSample } from "./layout-sample";
import apiIndex from "../../api/index.json";

type Prop = {
  name: string;
  kind: string;
  required?: boolean;
  default?: string;
  values?: string[];
  description?: string;
};
type Contract = {
  id: string;
  label: string;
  props: Prop[];
  notes?: string[];
  accessibility?: { id: string; rule: string }[];
};
const modules = import.meta.glob<Contract>("../../api/components/*.json", {
  eager: true,
  import: "default",
});
const contracts = Object.fromEntries(
  Object.values(modules).map((contract) => [contract.id, contract])
);
const groups: { label: string; ids: string[] }[] = [
  {
    label: "입력",
    ids: [
      "button",
      "icon-button",
      "text-input",
      "text-area",
      "select",
      "checkbox",
      "radio",
      "switch",
      "number-field",
      "slider",
      "file-upload",
      "date-picker",
      "time-picker",
      "date-time-picker",
    ],
  },
  {
    label: "데이터 표시",
    ids: [
      "badge",
      "chip",
      "avatar",
      "typography",
      "icon",
      "svg-icon",
      "card",
      "list",
      "data-grid",
      "data-state",
      "progress",
      "circle-progress",
      "segmented-progress",
      "skeleton",
      "spinner",
      "nova-spinner",
      "slides",
    ],
  },
  {
    label: "레이아웃과 탐색",
    ids: [
      "accordion",
      "breadcrumb",
      "divider",
      "grid",
      "page-header",
      "pagination",
      "segmented",
      "stepper",
      "tabs",
      "tree",
    ],
  },
  {
    label: "피드백과 오버레이",
    ids: [
      "alert",
      "dialog",
      "drawer",
      "dropdown-menu",
      "popover",
      "toast",
      "tooltip",
    ],
  },
];
const grouped = new Set(groups.flatMap((group) => group.ids));
const missing = apiIndex.components.filter((id) => !grouped.has(id));
if (missing.length) groups.push({ label: "기타", ids: missing });
const title = (id: string) => contracts[id]?.label ?? id;
const route = () => window.location.hash.slice(1) || "/";

function ThemeButton() {
  const [dark, setDark] = React.useState(
    () => localStorage.getItem("ui-react-docs-theme") === "dark"
  );
  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("ui-react-docs-theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <UI.IconButton
      variant="ghost"
      color="neutral"
      className="theme-button"
      onClick={() => setDark(!dark)}
      label={dark ? "라이트 테마로 전환" : "다크 테마로 전환"}
      icon={<span>{dark ? "☀" : "◐"}</span>}
    />
  );
}

function Sidebar({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const normalized = query.trim().toLocaleLowerCase();
  return (
    <div className="sidebar-inner">
      <a className="brand" href="#/" onClick={onNavigate}>
        <span className="brand-mark">
          i<span>.</span>
        </span>
        <span>
          idenflu <small>DESIGN SYSTEM</small>
        </span>
      </a>
      <div className="sidebar-search">
        <UI.TextInput
          fullWidth
          aria-label="컴포넌트 검색"
          placeholder="컴포넌트 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          startAdornment={<UI.Icon name="search" aria-hidden="true" />}
        />
      </div>
      <nav aria-label="문서 탐색">
        <UI.Tree
          label="문서 메뉴"
          rootStyle="category"
          value={path}
          onValueChange={(value) => {
            window.location.hash = value;
            onNavigate();
          }}
          items={[
            { value: "getting-started", label: "시작하기", children: [
              { value: "/", label: "소개" },
              { value: "/foundations", label: "디자인 토큰" },
              { value: "/examples", label: "화면 예제" },
              { value: "/patterns/layout", label: "레이아웃" },
            ] },
            ...groups.flatMap((group) => {
              const ids = group.ids.filter((id) => !normalized || `${id} ${title(id)}`.toLocaleLowerCase().includes(normalized));
              return ids.length ? [{ value: group.label, label: group.label, children: ids.map((id) => ({ value: `/components/${id}`, label: title(id) })) }] : [];
            }),
          ]}
        />
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot" /> @idenflu/ui-react <span>문서</span>
      </div>
    </div>
  );
}
function Code({ children }: { children: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="code-block">
      <UI.Button
        className="copy-button"
        size="xs"
        variant="outlined"
        color="neutral"
        onClick={async () => {
          await navigator.clipboard.writeText(children);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }}
      >
        {copied ? "복사됨" : "복사"}
      </UI.Button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
function Intro() {
  return (
    <>
      <div className="eyebrow">
        <span /> IDENFLU UI REACT
      </div>
      <UI.Typography component="h1" variant="heading-lg">
        일관된 경험을 위한
        <br />
        <em>작은 단위의 약속.</em>
      </UI.Typography>
      <p className="lead">
        제품을 만드는 데 필요한 컴포넌트와 패턴을 살펴보세요. 모든 예제는 실제{" "}
        <code>@idenflu/ui-react</code> 패키지로 동작합니다.
      </p>
      <div className="intro-actions">
        <a className="primary-link" href="#/components/button">
          컴포넌트 살펴보기 <span>↗</span>
        </a>
        <a className="secondary-link" href="#/examples">
          화면 예제 보기 <span>→</span>
        </a>
      </div>
      <div className="intro-grid">
        <a href="#/foundations">
          <span>01 / FOUNDATIONS</span>
          <UI.Typography component="h2" variant="heading-sm">기본 원칙</UI.Typography>
          <p>색상, 타이포그래피, 간격과 테마의 기초를 확인하세요.</p>
          <b>살펴보기 ↗</b>
        </a>
        <a href="#/components/button">
          <span>02 / COMPONENTS</span>
          <UI.Typography component="h2" variant="heading-sm">컴포넌트</UI.Typography>
          <p>제품에 바로 사용할 수 있는 UI와 사용 방법을 제공합니다.</p>
          <b>{apiIndex.components.length}개 둘러보기 ↗</b>
        </a>
        <a href="#/examples">
          <span>03 / EXAMPLES</span>
          <UI.Typography component="h2" variant="heading-sm">화면 예제</UI.Typography>
          <p>컴포넌트를 조합한 실제 업무 흐름을 살펴보세요.</p>
          <b>예제 보기 ↗</b>
        </a>
      </div>
      <section className="install">
        <div>
          <span className="section-kicker">GET STARTED</span>
          <UI.Typography component="h2" variant="heading-sm">시작하기</UI.Typography>
          <p>패키지를 설치한 뒤 스타일과 글꼴을 앱의 진입점에 불러옵니다.</p>
        </div>
        <Code>
          {
            'npm install @idenflu/ui-react\n\nimport "@idenflu/ui-react/fonts.css";\nimport "@idenflu/ui-react/styles.css";\nimport { Button } from "@idenflu/ui-react";'
          }
        </Code>
      </section>
    </>
  );
}
function Foundations() {
  return (
    <>
      <div className="eyebrow">
        <span /> FOUNDATIONS
      </div>
      <UI.Typography component="h1" variant="heading-lg">디자인 토큰</UI.Typography>
      <p className="lead">
        컴포넌트는 공통 색상, 간격과 서체 토큰을 사용합니다. 테마는 문서 루트의{" "}
        <code>data-theme</code>으로 전환합니다.
      </p>
      <section className="doc-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">COLOR</span>
            <UI.Typography component="h2" variant="heading-sm">의미를 담은 색상</UI.Typography>
          </div>
          <p>화면 배경부터 강조 색상까지 역할에 따라 사용합니다.</p>
        </div>
        <div className="swatches">
          {[
            ["Canvas", "--canvas"],
            ["Surface", "--surface"],
            ["Primary", "--primary"],
            ["Success", "--success"],
            ["Warning", "--warning"],
            ["Danger", "--danger-text"],
          ].map(([label, token]) => (
            <div key={token}>
              <div style={{ background: `var(${token})` }} />
              <strong>{label}</strong>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>
      <section className="doc-section">
        <span className="section-kicker">TYPOGRAPHY & SPACING</span>
        <UI.Typography component="h2" variant="heading-sm">읽기 편한 리듬</UI.Typography>
        <p>기본 서체는 Pretendard이며, 간격은 4px 단위 토큰을 사용합니다.</p>
        <Code>
          {
            ':root {\n  font-family: var(--font-family-body);\n  gap: var(--space-4);\n}\n\n<html data-theme="dark">'
          }
        </Code>
      </section>
    </>
  );
}
function importsFor(code: string) {
  const exports = Object.keys(UI).filter(
    (name) => /^[A-Z]/.test(name) && new RegExp(`\\b${name}\\b`).test(code)
  );
  const reactImport = exports.length
    ? `import { ${exports.join(", ")} } from "@idenflu/ui-react";\n`
    : "";
  const iconImport =
    /\bSearchIcon\b/.test(code) &&
    !code.includes('from "@idenflu/ui-react/icons"')
      ? 'import { SearchIcon } from "@idenflu/ui-react/icons";\n'
      : "";
  return reactImport + iconImport;
}
function SelectReference() {
  const props = [
    [
      "searchable",
      "boolean",
      "false",
      "다중 선택 목록에 검색 입력을 표시합니다.",
    ],
    [
      "presentation",
      '"default" | "inline"',
      '"default"',
      "선택 항목을 텍스트 또는 인라인 태그로 표시합니다.",
    ],
    ["clearable", "boolean", "false", "선택 항목을 한 번에 지울 수 있습니다."],
    [
      "maxVisibleLabels",
      "number",
      "—",
      "기본 표시에서 보이는 선택 이름의 개수를 제한합니다.",
    ],
    [
      "maxVisibleTags",
      'number | "responsive"',
      '"responsive"',
      "인라인 표시에서 공간에 맞춰 보이는 태그를 제한합니다.",
    ],
    [
      "value / defaultValue",
      "readonly string[]",
      "[]",
      "다중 선택 값을 지정합니다.",
    ],
    [
      "onValueChange",
      "(value: string[]) => void",
      "—",
      "다중 선택이 변경되면 호출됩니다.",
    ],
  ];
  return (
    <section className="doc-section">
      <span className="section-kicker">SELECT VARIANTS</span>
      <UI.Typography component="h2" variant="heading-sm">검색과 다중 선택</UI.Typography>
      <p>
        SearchSelect는 검색 가능한 단일 선택이며 Select와 같은 속성을
        사용합니다. MultiSelect는 다음 속성을 추가로 지원합니다.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>타입</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            {props.map(([name, type, defaultValue, description]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>
                  <code>{type}</code>
                </td>
                <td>{defaultValue}</td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function ComponentPage({ id }: { id: string }) {
  const contract = contracts[id],
    example = examples[id];
  if (!contract) return <NotFound />;
  return (
    <>
      <UI.Breadcrumb className="breadcrumb" items={[
        { label: <a href="#/">문서</a> },
        { label: "컴포넌트" },
        { label: contract.label, current: true },
      ]} />
      <div className="eyebrow">
        <span /> COMPONENT
      </div>
      <UI.Typography component="h1" variant="heading-lg">{contract.label}</UI.Typography>
      <p className="lead">
        {contract.notes?.[0] ||
          `${contract.label} 컴포넌트의 사용법과 속성을 확인하세요.`}
      </p>
      {example ? (
        <section className="doc-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">PREVIEW</span>
              <UI.Typography component="h2" variant="heading-sm">직접 살펴보기</UI.Typography>
            </div>
            <p>아래 예제는 실제 패키지를 사용합니다.</p>
          </div>
          <div className="preview">{example.demo}</div>
          <Code>{`${importsFor(example.code)}\n${example.code}`}</Code>
        </section>
      ) : (
        <p>이 컴포넌트의 실행 예제를 준비하고 있습니다.</p>
      )}
      <section className="doc-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">API REFERENCE</span>
            <UI.Typography component="h2" variant="heading-sm">속성</UI.Typography>
          </div>
          <p>패키지의 API 계약을 기준으로 표시합니다.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>타입</th>
                <th>기본값</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              {contract.props.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                    {prop.required && <span className="required"> *</span>}
                  </td>
                  <td>
                    <code>{prop.values?.join(" | ") || prop.kind}</code>
                  </td>
                  <td>{prop.default ?? "—"}</td>
                  <td>{prop.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {id === "select" && <SelectReference />}
      {contract.accessibility?.length ? (
        <section className="doc-section">
          <span className="section-kicker">ACCESSIBILITY</span>
          <UI.Typography component="h2" variant="heading-sm">접근성</UI.Typography>
          <ul className="guidance">
            {contract.accessibility.map((item) => (
              <li key={item.id}>{item.rule}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
function ExamplesPage() {
  const [tab, setTab] = React.useState<"workspace" | "form">("workspace");
  return (
    <>
      <div className="eyebrow">
        <span /> EXAMPLES
      </div>
      <UI.Typography component="h1" variant="heading-lg">화면 예제</UI.Typography>
      <p className="lead">
        컴포넌트를 조합해 실제 업무에 가까운 화면을 만듭니다. 예제의 검색, 선택,
        입력을 직접 사용해 보세요.
      </p>
      <UI.Tabs value={tab} onValueChange={(value) => setTab(value as "workspace" | "form")}>
        <UI.TabsList className="example-tabs" aria-label="화면 예제">
          <UI.TabsTrigger value="workspace">프로젝트 목록</UI.TabsTrigger>
          <UI.TabsTrigger value="form">프로젝트 만들기</UI.TabsTrigger>
        </UI.TabsList>
        <UI.TabsContent value="workspace" className="example-frame">
          <WorkspaceExample onCreate={() => setTab("form")} />
        </UI.TabsContent>
        <UI.TabsContent value="form" className="example-frame"><FormExample /></UI.TabsContent>
      </UI.Tabs>
      <p className="footnote">예시 데이터는 브라우저에서만 사용됩니다.</p>
    </>
  );
}
function LayoutPage() {
  return (
    <>
      <div className="eyebrow">
        <span /> PATTERNS
      </div>
      <UI.Typography component="h1" variant="heading-lg">레이아웃</UI.Typography>
      <p className="lead">
        사이드바 탐색과 탭으로 여러 업무를 오가는 화면을 살펴보세요.
      </p>
      <section className="doc-section">
        <UI.Card>
          <span className="section-kicker">SIDEBAR WORKSPACE</span>
          <UI.Typography component="h2" variant="heading-sm">사이드바형 업무 화면</UI.Typography>
          <p>
            메뉴에서 업무 화면을 열고 탭을 전환하며 프로젝트 목록과 입력 화면을
            사용해보세요.
          </p>
          <a
            className="primary-link"
            href="?layout=sidebar"
            target="_blank"
            rel="noreferrer"
          >
            샘플 화면 열기 <span aria-hidden="true">↗</span>
          </a>
        </UI.Card>
      </section>
      <section className="doc-section">
        <UI.Typography component="h2" variant="heading-sm">구성과 동작</UI.Typography>
        <ul className="guidance">
          <li>사이드바의 트리 메뉴에서 화면을 열고 탭으로 이동합니다.</li>
          <li>좁은 화면에서는 메뉴 버튼으로 탐색을 엽니다.</li>
          <li>
            탭을 전환해도 열려 있는 화면의 입력 상태가 유지됩니다. 새로고침하면
            초기화됩니다.
          </li>
        </ul>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <>
      <div className="eyebrow">
        <span /> NOT FOUND
      </div>
      <UI.Typography component="h1" variant="heading-lg">페이지를 찾을 수 없습니다.</UI.Typography>
      <p className="lead">주소를 확인하거나 문서 홈으로 돌아가세요.</p>
      <a className="primary-link" href="#/">
        문서 홈으로
      </a>
    </>
  );
}
function App() {
  const [path, setPath] = React.useState(route);
  const [menu, setMenu] = React.useState(false);
  React.useEffect(() => {
    const update = () => {
      setPath(route());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  let page =
    path === "/" ? (
      <Intro />
    ) : path === "/foundations" ? (
      <Foundations />
    ) : path === "/examples" ? (
      <ExamplesPage />
    ) : path === "/patterns/layout" ? (
      <LayoutPage />
    ) : path.startsWith("/components/") ? (
      <ComponentPage key={path} id={path.slice(12)} />
    ) : (
      <NotFound />
    );
  return (
    <>
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <Sidebar path={path} onNavigate={() => setMenu(false)} />
      </aside>
      {menu && (
        <UI.Button
          className="mobile-backdrop"
          aria-label="메뉴 닫기"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="app-main">
        <header className="topbar">
          <UI.IconButton
            className="menu-button"
            label="메뉴 열기"
            variant="ghost"
            color="neutral"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
            icon={<span>☰</span>}
          />
          <span>
            Design system <span className="topbar-separator">/</span>{" "}
            <strong>React</strong>
          </span>
          <div className="topbar-actions">
            <a href="../../index.html">기존 문서 ↗</a>
            <ThemeButton />
          </div>
        </header>
        <main id="main-content" className="content">
          {page}
          <footer className="page-footer">
            <span>idenflu design system</span>
            <span>Built with @idenflu/ui-react</span>
          </footer>
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IconSpriteProvider href={spriteUrl}>
      {new URLSearchParams(window.location.search).get("layout") ===
      "sidebar" ? (
        <LayoutSample themeButton={<ThemeButton />} />
      ) : (
        <App />
      )}
    </IconSpriteProvider>
  </React.StrictMode>
);
