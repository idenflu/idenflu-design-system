import * as React from "react";
import * as UI from "@idenflu/ui-react";
import { SearchIcon } from "@idenflu/ui-react/icons";

export type Example = { demo: React.ReactNode; code: string };
const make = (demo: React.ReactNode, code: string): Example => ({ demo, code });
const choices = [{ value: "design", label: "디자인" }, { value: "product", label: "프로덕트" }, { value: "engineering", label: "엔지니어링" }];
const rows = [{ id: "1", name: "브랜드 리뉴얼", status: "진행 중" }, { id: "2", name: "팀 워크스페이스", status: "검토 중" }, { id: "3", name: "콘텐츠 가이드", status: "완료" }];
const columns: UI.DataGridColumn<(typeof rows)[number]>[] = [
  { id: "name", header: "프로젝트", accessor: row => row.name, flex: 1, minWidth: 180, maxWidth: 4096, sortable: true },
  { id: "status", header: "상태", accessor: row => row.status, width: 160, sortable: true },
];

function PaginationExample() { const [page, setPage] = React.useState(1); return <UI.Pagination page={page} pageCount={8} onPageChange={setPage} />; }
function DrawerExample() { const [open, setOpen] = React.useState(false); return <><UI.Button onClick={() => setOpen(true)}>상세 보기</UI.Button><UI.Drawer side="right" open={open} onClose={() => setOpen(false)}><UI.DrawerHeader><UI.DrawerTitle>프로젝트 상세</UI.DrawerTitle></UI.DrawerHeader><UI.DrawerBody>프로젝트 정보를 확인합니다.</UI.DrawerBody></UI.Drawer></>; }
function ToastExample() { const [open, setOpen] = React.useState(false); return <><UI.Button onClick={() => setOpen(true)}>알림 보기</UI.Button><UI.Toast position="bottom-end" open={open} onClose={() => setOpen(false)} autoHideDuration={4000} message="변경사항을 저장했습니다." /></>; }
function SwitchExample() { const [checked, setChecked] = React.useState(true); return <label className="switch-demo"><UI.Switch checked={checked} onCheckedChange={setChecked} /> 알림 받기</label>; }
function ChipExample() { const [visible, setVisible] = React.useState(true); return visible ? <UI.Chip density="compact" onDelete={() => setVisible(false)}>디자인</UI.Chip> : <UI.Button variant="outlined" onClick={() => setVisible(true)}>다시 표시</UI.Button>; }
function DataStateExample() { return <UI.DataState initialItems={["디자인", "프로덕트", "엔지니어링"]} load={async () => ["디자인", "프로덕트", "엔지니어링"]} matches={(item, query) => item.includes(query)} getKey={item => item} renderItem={item => item} />; }

export const examples: Record<string, Example> = {
  accordion: make(<UI.Accordion><UI.AccordionItem title="프로젝트 정보">프로젝트의 기본 정보를 확인하세요.</UI.AccordionItem><UI.AccordionItem title="접근 권한">팀원별 권한을 관리합니다.</UI.AccordionItem></UI.Accordion>, '<Accordion><AccordionItem title="프로젝트 정보">내용</AccordionItem></Accordion>'),
  alert: make(<UI.Alert severity="success">변경사항이 저장되었습니다.</UI.Alert>, '<Alert severity="success">변경사항이 저장되었습니다.</Alert>'),
  avatar: make(<div className="demo-row"><UI.Avatar size="sm">이</UI.Avatar><UI.Avatar size="md">이</UI.Avatar><UI.Avatar size="lg">이</UI.Avatar></div>, '<Avatar size="md">이</Avatar>'),
  badge: make(<div className="demo-row"><UI.Badge>기본</UI.Badge><UI.Badge variant="success">완료</UI.Badge><UI.Badge variant="warning">검토 중</UI.Badge></div>, '<Badge variant="success">완료</Badge>'),
  breadcrumb: make(<UI.Breadcrumb items={[{ label: "홈" }, { label: "프로젝트" }, { label: "상세", current: true }]} />, '<Breadcrumb items={[{ label: "홈" }, { label: "상세", current: true }]} />'),
  button: make(<div className="demo-row"><UI.Button>저장</UI.Button><UI.Button variant="outlined">취소</UI.Button><UI.Button variant="ghost">자세히</UI.Button></div>, '<Button>저장</Button>\n<Button variant="outlined">취소</Button>'),
  card: make(<UI.Card><strong>프로젝트 요약</strong><p>최근 업데이트된 프로젝트를 확인하세요.</p></UI.Card>, '<Card><strong>프로젝트 요약</strong><p>설명</p></Card>'),
  checkbox: make(<div className="demo-stack"><UI.Checkbox label="이메일 알림" defaultChecked /><UI.Checkbox label="주간 요약" /></div>, '<Checkbox label="이메일 알림" defaultChecked />'),
  chip: make(<ChipExample />, '<Chip density="compact" onDelete={handleDelete}>디자인</Chip>'),
  'circle-progress': make(<UI.CircleProgress value={65} label="진행률" />, '<CircleProgress value={65} label="진행률" />'),
  'data-grid': make(<UI.DataGrid label="프로젝트" rows={rows} columns={columns} getRowId={row => row.id} searchable pagination />, 'const columns = [\n  { id: "name", header: "프로젝트", accessor: row => row.name, flex: 1, minWidth: 180, maxWidth: 4096 },\n  { id: "status", header: "상태", accessor: row => row.status, width: 160 },\n];\n<DataGrid label="프로젝트" rows={rows} columns={columns} getRowId={row => row.id} searchable pagination />'),
  'data-state': make(<DataStateExample />, '<DataState initialItems={items} load={load} matches={matches} getKey={item => item.id} renderItem={item => item.name} />'),
  'date-picker': make(<UI.DatePicker label="시작 날짜" />, '<DatePicker label="시작 날짜" />'),
  'date-time-picker': make(<UI.DateTimePicker label="시작 일시" />, '<DateTimePicker label="시작 일시" />'),
  dialog: make(<UI.Dialog><UI.DialogTrigger asChild><UI.Button>대화상자 열기</UI.Button></UI.DialogTrigger><UI.DialogContent><UI.DialogHeader><UI.DialogTitle>프로젝트 저장</UI.DialogTitle><UI.DialogDescription>변경사항을 저장하시겠습니까?</UI.DialogDescription></UI.DialogHeader><UI.DialogBody>저장한 정보는 팀과 공유됩니다.</UI.DialogBody></UI.DialogContent></UI.Dialog>, '<Dialog><DialogTrigger asChild><Button>열기</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>프로젝트 저장</DialogTitle></DialogHeader><DialogBody>내용</DialogBody></DialogContent></Dialog>'),
  divider: make(<div className="demo-stack"><span>프로젝트 정보</span><UI.Divider /><span>팀 설정</span></div>, '<Divider />'),
  drawer: make(<DrawerExample />, '<Drawer side="right" open={open} onClose={() => setOpen(false)}><DrawerHeader><DrawerTitle>프로젝트 상세</DrawerTitle></DrawerHeader><DrawerBody>내용</DrawerBody></Drawer>'),
  'dropdown-menu': make(<UI.DropdownMenu><UI.DropdownMenuTrigger asChild><UI.Button variant="outlined">더 보기</UI.Button></UI.DropdownMenuTrigger><UI.DropdownMenuContent><UI.DropdownMenuItem>수정</UI.DropdownMenuItem><UI.DropdownMenuItem>복제</UI.DropdownMenuItem></UI.DropdownMenuContent></UI.DropdownMenu>, '<DropdownMenu><DropdownMenuTrigger asChild><Button>더 보기</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>수정</DropdownMenuItem></DropdownMenuContent></DropdownMenu>'),
  'file-upload': make(<UI.FileUpload label="파일 첨부" />, '<FileUpload label="파일 첨부" onFilesChange={setFiles} />'),
  grid: make(<UI.Grid columns={{ base: 1, md: 3 }} gap={4}>{["하나", "둘", "셋"].map(item => <UI.Card key={item}>{item}</UI.Card>)}</UI.Grid>, '<Grid columns={{ base: 1, md: 3 }} gap={4}><Card>하나</Card><Card>둘</Card></Grid>'),
  icon: make(<div className="demo-row"><SearchIcon /><SearchIcon size={24} /></div>, 'import { SearchIcon } from "@idenflu/ui-react/icons";\n<SearchIcon size={24} label="검색" />'),
  'icon-button': make(<UI.IconButton label="검색" icon={<SearchIcon />} />, '<IconButton label="검색" icon={<SearchIcon />} />'),
  list: make(<UI.List><UI.ListItem>디자인 시스템 정리</UI.ListItem><UI.ListItem>팀원 초대하기</UI.ListItem></UI.List>, '<List><ListItem>디자인 시스템 정리</ListItem></List>'),
  'nova-spinner': make(<UI.NovaSpinner />, '<NovaSpinner label="로딩 중" />'),
  'number-field': make(<UI.NumberField label="수량" defaultValue="5" min="0" />, '<NumberField label="수량" defaultValue="5" min="0" />'),
  'page-header': make(<UI.PageHeader headingLevel={2} eyebrow="워크스페이스" title="프로젝트" description="팀의 프로젝트를 관리합니다." actions={<UI.Button>새 프로젝트</UI.Button>} />, '<PageHeader headingLevel={2} title="프로젝트" description="팀의 프로젝트를 관리합니다." actions={<Button>새 프로젝트</Button>} />'),
  pagination: make(<PaginationExample />, '<Pagination page={page} pageCount={8} onPageChange={setPage} />'),
  popover: make(<UI.Popover trigger="필터" label="필터 설정"><p>표시할 항목을 선택하세요.</p><UI.Checkbox label="완료 항목 포함" /></UI.Popover>, '<Popover trigger="필터" label="필터 설정"><Checkbox label="완료 항목 포함" /></Popover>'),
  progress: make(<UI.Progress value={65} max={100} aria-label="진행률" />, '<Progress value={65} max={100} aria-label="진행률" />'),
  radio: make(<div className="demo-stack"><UI.Radio name="priority" label="보통" defaultChecked /><UI.Radio name="priority" label="높음" /></div>, '<Radio name="priority" label="보통" defaultChecked />'),
  segmented: make(<UI.Segmented label="보기" options={[{ value: "list", label: "목록" }, { value: "grid", label: "그리드" }]} />, '<Segmented label="보기" options={[{ value: "list", label: "목록" }, { value: "grid", label: "그리드" }]} />'),
  'segmented-progress': make(<UI.SegmentedProgress value={3} total={5} label="설정 진행률" />, '<SegmentedProgress value={3} total={5} label="설정 진행률" />'),
  select: make(<div className="demo-stack"><UI.Select label="담당 팀" options={choices} /><UI.SearchSelect label="팀 검색" options={choices} /><UI.MultiSelect label="공유 팀" options={choices} searchable presentation="inline" /></div>, 'const options = [{ value: "design", label: "디자인" }];\n<Select label="담당 팀" options={options} />\n<SearchSelect label="팀 검색" options={options} />\n<MultiSelect label="공유 팀" options={options} searchable presentation="inline" />'),
  skeleton: make(<div className="demo-stack"><UI.Skeleton style={{ width: 220, height: 18 }} /><UI.Skeleton style={{ width: 160, height: 18 }} /></div>, '<Skeleton style={{ width: 220, height: 18 }} />'),
  slider: make(<UI.Slider aria-label="볼륨" defaultValue={60} />, '<Slider aria-label="볼륨" defaultValue={60} />'),
  slides: make(<UI.Slides label="안내" slides={[<p>프로젝트를 만듭니다.</p>, <p>팀원을 초대합니다.</p>]} />, '<Slides label="안내" slides={[<p>프로젝트를 만듭니다.</p>, <p>팀원을 초대합니다.</p>]} />'),
  spinner: make(<div className="demo-row"><UI.Spinner size="sm" /><UI.Spinner size="md" /><UI.Spinner size="lg" /></div>, '<Spinner size="md" />'),
  stepper: make(<UI.Stepper steps={["기본 정보", "팀원 초대", "완료"]} currentStep={1} />, '<Stepper steps={["기본 정보", "팀원 초대", "완료"]} currentStep={1} />'),
  'svg-icon': make(<SearchIcon size={24} label="검색" />, 'import { SearchIcon } from "@idenflu/ui-react/icons";\n<SearchIcon size={24} label="검색" />'),
  switch: make(<SwitchExample />, '<Switch checked={enabled} onCheckedChange={setEnabled} aria-label="알림 받기" />'),
  tabs: make(<UI.Tabs defaultValue="overview"><UI.TabsList><UI.TabsTrigger value="overview">개요</UI.TabsTrigger><UI.TabsTrigger value="members">팀원</UI.TabsTrigger></UI.TabsList><UI.TabsContent value="overview">프로젝트 개요입니다.</UI.TabsContent><UI.TabsContent value="members">팀원 목록입니다.</UI.TabsContent></UI.Tabs>, '<Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">개요</TabsTrigger><TabsTrigger value="members">팀원</TabsTrigger></TabsList><TabsContent value="overview">프로젝트 개요</TabsContent><TabsContent value="members">팀원 목록</TabsContent></Tabs>'),
  'text-area': make(<UI.TextArea label="설명" placeholder="프로젝트를 소개해주세요" />, '<TextArea label="설명" placeholder="프로젝트를 소개해주세요" />'),
  'text-input': make(<UI.TextInput label="프로젝트 이름" placeholder="이름을 입력하세요" helperText="팀원이 알아보기 쉬운 이름을 사용하세요." />, '<TextInput label="프로젝트 이름" placeholder="이름을 입력하세요" helperText="팀원이 알아보기 쉬운 이름을 사용하세요." />'),
  'time-picker': make(<UI.TimePicker label="시작 시간" />, '<TimePicker label="시작 시간" />'),
  toast: make(<ToastExample />, '<Toast position="bottom-end" open={open} onClose={() => setOpen(false)} autoHideDuration={4000} message="저장했습니다." />'),
  tooltip: make(<UI.TooltipProvider><UI.Tooltip><UI.TooltipTrigger asChild><UI.Button variant="outlined">도움말</UI.Button></UI.TooltipTrigger><UI.TooltipContent>프로젝트 정보를 확인하세요.</UI.TooltipContent></UI.Tooltip></UI.TooltipProvider>, '<TooltipProvider><Tooltip><TooltipTrigger asChild><Button>도움말</Button></TooltipTrigger><TooltipContent>도움말 내용</TooltipContent></Tooltip></TooltipProvider>'),
  tree: make(<UI.Tree label="프로젝트" items={[{ value: "team", label: "팀", children: [{ value: "design", label: "디자인" }, { value: "product", label: "프로덕트" }] }]} defaultExpanded={["team"]} />, '<Tree label="프로젝트" items={items} defaultExpanded={["team"]} />'),
  typography: make(<div className="demo-stack"><UI.Typography variant="title-lg">프로젝트 제목</UI.Typography><UI.Typography>본문 텍스트입니다.</UI.Typography></div>, '<Typography variant="title-lg">프로젝트 제목</Typography>\n<Typography>본문 텍스트입니다.</Typography>'),
};

export function WorkspaceExample({ onCreate }: { onCreate?: () => void } = {}) {
  return <div className="workspace-example"><UI.PageHeader headingLevel={2} eyebrow="워크스페이스" title="프로젝트" description="팀과 함께 진행하는 프로젝트를 한곳에서 관리하세요." actions={<UI.Button onClick={onCreate}>프로젝트 만들기</UI.Button>} /><div className="workspace-cards"><UI.Card><span>전체 프로젝트</span><strong>3</strong><small>샘플 프로젝트</small></UI.Card><UI.Card><span>진행 중</span><strong>1</strong><small>진행 중인 프로젝트</small></UI.Card><UI.Card><span>완료</span><strong>1</strong><small>완료된 프로젝트</small></UI.Card></div><UI.DataGrid label="최근 프로젝트" rows={rows} columns={columns} getRowId={row => row.id} searchable pagination /></div>;
}
export function FormExample() {
  const [saved, setSaved] = React.useState(false);
  return <UI.Card><form className="demo-stack" onSubmit={event => { event.preventDefault(); setSaved(true); }}><UI.TextInput label="프로젝트 이름" name="name" required placeholder="이름을 입력하세요" /><UI.Select label="담당 팀" name="team" options={choices} /><UI.TextArea label="설명" placeholder="프로젝트를 소개해주세요" /><UI.Checkbox label="팀원에게 공유" defaultChecked /><UI.Button type="submit">저장하기</UI.Button>{saved && <UI.Alert severity="success">프로젝트를 저장했습니다.</UI.Alert>}</form></UI.Card>;
}
