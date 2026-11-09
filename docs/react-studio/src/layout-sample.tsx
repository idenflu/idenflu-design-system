import * as React from "react";
import * as UI from "@idenflu/ui-react";
import { FormExample, WorkspaceExample } from "./examples";

type Page = "dashboard" | "projects" | "create";
const labels: Record<Page, string> = { dashboard: "대시보드", projects: "프로젝트 목록", create: "프로젝트 만들기" };
const items: UI.TreeNode[] = [
  { value: "dashboard", label: labels.dashboard },
  { value: "work", label: "프로젝트", children: [
    { value: "projects", label: labels.projects },
    { value: "create", label: labels.create },
  ] },
];

export function LayoutSample({ themeButton }: { themeButton: React.ReactNode }) {
  const [active, setActive] = React.useState<Page>("dashboard");
  const [opened, setOpened] = React.useState<Page[]>(["dashboard"]);
  const [menu, setMenu] = React.useState(false);
  const navigate = (value: string) => {
    const page = value as Page;
    setOpened(current => current.includes(page) ? current : [...current, page]);
    setActive(page);
    setMenu(false);
  };
  const close = (page: Page) => {
    const remaining = opened.filter(item => item !== page);
    setOpened(remaining);
    if (active === page) setActive(remaining[remaining.length - 1]);
  };
  const navigation = <><div className="sample-brand">idenflu <small>WORKSPACE</small></div><UI.Tree label="업무 탐색" items={items} value={active} defaultExpanded={["work"]} onValueChange={navigate} /></>;
  return <div className="sample-shell">
    <a className="sample-skip" href="#workspace-content">콘텐츠로 바로가기</a>
    <aside className="sample-sidebar">{navigation}</aside>
    <UI.Drawer side="left" open={menu} onClose={() => setMenu(false)} aria-label="업무 탐색"><UI.DrawerBody>{navigation}</UI.DrawerBody></UI.Drawer>
    <div className="sample-main">
      <header className="sample-topbar"><div className="sample-topbar-start"><UI.IconButton className="sample-menu" variant="ghost" color="neutral" label="메뉴 열기" aria-expanded={menu} onClick={() => setMenu(true)} icon={<span>☰</span>} /><UI.Breadcrumb items={[{ label: "업무 공간" }, { label: labels[active], current: true }]} /></div><div className="sample-topbar-actions">{themeButton}<UI.Avatar size="sm">김</UI.Avatar><span>김민수</span><a href="./#/patterns/layout">문서로 돌아가기</a></div></header>
      <UI.Tabs value={active} onValueChange={value => setActive(value as Page)} variant="scrollable" className="sample-tabs">
        <UI.TabsList aria-label="열린 업무 화면" variant="scrollable">{opened.map(page => <UI.TabsTrigger key={page} value={page} closable={page !== "dashboard"} closeLabel={`${labels[page]} 탭 닫기`} onClose={() => close(page)} onKeyDown={event => { if (event.key === "Delete" && page !== "dashboard") { event.preventDefault(); close(page); } }}>{labels[page]}</UI.TabsTrigger>)}</UI.TabsList>
        <main id="workspace-content" className="sample-content">{opened.map(page => <UI.TabsContent key={page} value={page} forceMount hidden={active !== page}>{page === "dashboard" ? <><UI.PageHeader title="대시보드" description="팀의 업무를 한눈에 확인하세요." /><div className="sample-dashboard"><UI.Card><h2>프로젝트 관리</h2><p>진행 중인 프로젝트를 살펴보고 새로운 프로젝트를 시작하세요.</p><UI.Button onClick={() => navigate("projects")}>프로젝트 보기</UI.Button></UI.Card><UI.Card><h2>새 프로젝트</h2><p>팀이 함께할 새로운 프로젝트를 만들어 보세요.</p><UI.Button variant="outlined" onClick={() => navigate("create")}>프로젝트 만들기</UI.Button></UI.Card></div></> : page === "projects" ? <WorkspaceExample onCreate={() => navigate("create")} /> : <><UI.PageHeader title="프로젝트 만들기" description="새 프로젝트의 기본 정보를 입력하세요." /><FormExample /></>}</UI.TabsContent>)}</main>
      </UI.Tabs>
    </div>
  </div>;
}
