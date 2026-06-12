# Typography

Typography는 정보의 위계와 가독성을 정의하는 기준입니다.

적절한 타이포그래피는 사용자가 콘텐츠를 빠르게 이해하고, 정보의 중요도와 관계를 자연스럽게 인식할 수 있도록 돕습니다.

## Philosophy (철학 및 원칙)

**웹 접근성 및 픽셀 보정**

화면 상에서 왜곡 없이 글꼴이 렌더링되도록 모든 폰트 크기(fontSize)는 물리 픽셀(px) 단위로 관리되며, 글꼴 고유의 속성을 보정하도록 매칭되어 있습니다.

## Core Concepts (핵심 개념)

1. **고정(Fixed) 스타일**
   본 시스템의 텍스트 스타일은 화면 크기에 따라 가변하는 뷰포트 기반 스케일이 아닌, 안정적이고 일관된 레이아웃 제어가 가능한 고정 크기 유틸리티 및 본문/헤딩 체계를 준수합니다.

2. **숫자 전용 가독성 (Tabular Numbers)**
   돈, 통계 수치, 시간 등 행간 정렬과 가로 정렬이 중요한 수치 데이터 표기에는 글자마다 고유한 고정 폭을 가지는 Numeric: "tabular-nums" 속성을 기본 부여하여 정보 식별력을 높입니다.

## Usage Guidelines (사용 기준 및 가이드라인)

### Do (권장 사항)

- 본문은 `14px` 기준을 사용
- 하나의 정보 영역 내부에서는 한 가지 컨텍스트 스타일 유지, 동일 역할의 텍스트는 동일한 스타일을 유지
- 표 형태의 데이터, 수량 및 실시간 변동 지표에는 `numeric` 스타일 세트를 지정

### Dont't (금지 사항)

- 타이틀 영역이 아닌 일반 UI 내 강조는 Medium(`500`)로 가독성 확보
- `fontSize`와 `lineHeight` 토큰의 교차 결합 지양하고 동일한 단계를 매칭해서 사용 (예: `fontSize-01` - `lineHeight-01`)

## Tokens & Values (토큰 및 값)

### Font Family

| Token      | Value                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Sans-serif | `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`                        |
| Monospace  | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` |

### UI Text Styles

| Category | Style         | Size   | Line Height | Weight           | Features                                |
| -------- | ------------- | ------ | ----------- | ---------------- | --------------------------------------- |
| Heading  | `heading.lg ` | `32px` | `40px`      | SemiBold (`600`) | 메인 타이틀                             |
|          | `heading.md ` | `24px` | `32px`      | SemiBold (`600`) | 일반 페이지 및 모달 타이틀              |
| Title    | `title.lg   ` | `20px` | `28px`      | SemiBold (`600`) | 카드/위젯 헤더 , 대단위 섹션 타이틀     |
|          | `title.md   ` | `18px` | `26px`      | Medium (`500`)   | 일반 컴포넌트 타이틀 , 서브 섹션 타이틀 |
| Body     | `body.lg    ` | `16px` | `24px`      | Regular (`400`)  | Expressive 기본 본문 줄글               |
|          | `body.md    ` | `14px` | `20px`      | Regular (`400`)  | Productive 기본 본문 줄글               |
| Label    | `label.lg   ` | `14px` | `20px`      | Medium (`500`)   | 폼 필드 상단 레이블 , 버튼 텍스트       |
|          | `label.md   ` | `12px` | `16px`      | Medium (`500`)   | 인풋 설명문 , 캡션 , 헬퍼 텍스트        |
| Numeric  | `numeric.lg ` | `16px` | `24px`      | Regular (`400`)  | 수치 전용 데이터 (tabular-nums)         |
|          | `numeric.md ` | `14px` | `20px`      | Regular (`400`)  | 수치 전용 데이터 (tabular-nums)         |
