# Colors

> 소스: `colors/colors.json`

idenflu의 **primitive color palette**입니다. 테마(light/dark)와 무관한 기본 색상 값을 정의하며, `theme` 도메인의 시맨틱 토큰이 `{Base.Blue.500}` 형태로 참조합니다.

## 철학

idenflu 색상 체계는 세 역할로 나뉩니다.

1. **Neutral anchor** — `White`, `Black`, `Gray`, `Gray-subtle`이 canvas·surface·border·text 계층을 만듭니다.
2. **Brand chroma** — `Blue`가 주요 CTA, 선택, focus, 핵심 링크를 담당합니다.
3. **Semantic chroma** — `Green`, `Red`, `Amber`는 성공·오류·주의 같은 **상태**를 읽히게 합니다. secondary brand color가 아닙니다.

컴포넌트와 제품 코드는 palette 단계를 직접 쓰지 않고, `theme`의 역할 토큰(`Theme.Text.primary`, `Theme.Interactive.danger` 등)을 통해 간접 참조합니다. palette는 **조색 원료**이고, 의미는 theme이 부여합니다.

## 계층 구조

```
Base
├── White          # 절대 밝은 앵커
├── Black          # 절대 어두운 앵커
├── Blue           # 100–900 브랜드 chroma
├── Green          # 100–900 성공 chroma
├── Red            # 100–900 오류 chroma
├── Amber          # 100–900 주의 chroma
├── Gray           # 100–900 표준 neutral scale
└── Gray-subtle    # 0–1000 세밀 neutral scale
```

토큰 경로 예: `Base.Blue.500`, `Base.Gray.300`, `Base.Gray-subtle.800`

## 팔레트 정의

### White / Black

절대 기준색입니다. light theme canvas와 dark theme inverse 기준으로 쓰입니다.

| 토큰 | Hex | 역할 |
|------|-----|------|
| `Base.White` | `#FFFFFF` | 기본 밝은 canvas, on-color 텍스트 기준 |
| `Base.Black` | `#000000` | 기본 어두운 기준, overlay·inverse 계산 기준 |

> `theme` JSON에는 alpha 단계가 있는 `White.100`–`900`, `Black.100`–`900`도 별도로 존재합니다. `colors` 도메인은 **불투명 단일 값**만 관리하고, 반투명 단계는 theme 빌드 시 보완합니다.

### Blue (Brand)

브랜드 primary chroma입니다. 500이 기준색, 100–400은 subtle surface, 600–900은 hover·pressed·강조용입니다.

| 단계 | Hex | 용도 |
|------|-----|------|
| 100 | `#F0F6FF` | primary subtle background |
| 300 | `#A4BFEA` | 비활성·장식 강조 |
| **500** | **`#266EE1`** | **brand default, link, focus** |
| 600 | `#0F54BB` | hover |
| 700 | `#063D8F` | pressed / active |
| 900 | `#011944` | 고대비 장식, illustrative only |

### Green (Success)

완료·정상·승인 상태용 semantic chroma입니다.

| 단계 | Hex | 용도 |
|------|-----|------|
| 100 | `#EFF8F0` | success subtle background |
| **500** | **`#1E7D3A`** | **success default** |
| 700 | `#095121` | success active / emphasis |

### Red (Error)

차단·실패·유효성 오류용 semantic chroma입니다.

| 단계 | Hex | 용도 |
|------|-----|------|
| 100 | `#FEF2F0` | error subtle background |
| **500** | **`#D2272E`** | **error default** |
| 700 | `#7F0D15` | error active / emphasis |

### Amber (Warning)

대기·마감 임박·확인 필요 상태용 semantic chroma입니다.

| 단계 | Hex | 용도 |
|------|-----|------|
| 100 | `#FCF3EB` | warning subtle background |
| **500** | **`#A6650A`** | **warning default** |
| 700 | `#613801` | warning active / emphasis |

### Gray (Standard neutral)

범용 neutral scale입니다. border, text hierarchy, secondary surface에 사용합니다.

| 단계 | Hex | 용도 |
|------|-----|------|
| 100 | `#FAFAFA` | muted border, subtle surface |
| 300 | `#BEBEBE` | default border |
| **500** | **`#737373`** | secondary text |
| 800 | `#262626` | primary text (light theme) |
| 900 | `#141414` | 강한 neutral emphasis |

번호가 커질수록 어두워집니다. 100에 가까울수록 surface·border, 700–900에 가까울수록 text·strong border에 씁니다.

### Gray-subtle (Fine neutral)

`Gray`보다 단계가 촘촘한 neutral scale입니다. 정보 밀도가 높은 운영 화면·계층이 많은 surface에 씁니다.

| 단계 | Hex | 용도 |
|------|-----|------|
| 0 | `#FAFAFA` | 가장 밝은 subtle surface |
| 100 | `#EAEAEA` | card·panel 배경 |
| 500 | `#696969` | mid neutral |
| 900 | `#252525` | dark-adjacent surface |
| 1000 | `#0E0E0E` | 가장 어두운 subtle surface |

`Gray`와 값이 겹치는 구간이 있어도 **용도가 다릅니다**. `Gray`는 범용 semantic 참조, `Gray-subtle`은 밀도 높은 UI의 미세한 surface 계층용입니다. 새 토큰은 둘 중 하나에만 추가합니다.

## 스케일 규칙

| 팔레트 유형 | 단계 | 규칙 |
|-------------|------|------|
| Chromatic (Blue, Green, Red, Amber) | 100–900 | 500 = 기본 chroma. 100–400 = tint, 600–900 = shade |
| Gray | 100–900 | 100 = 가장 밝음, 900 = 가장 어두움 |
| Gray-subtle | 0–1000 | 0 = 가장 밝음, 1000 = 가장 어두움. 11단계 |
| White / Black | 단일 값 | alpha 단계는 `theme`에서 관리 |

새 단계를 임의로 추가하지 않습니다. Figma Variables와 `colors.json`을 함께 갱신합니다.

## theme과의 관계

```
colors (primitive)          theme (semantic)
─────────────────          ─────────────────────────────
Base.Blue.500        →     Brand.Primary.default
Base.Blue.600        →     Brand.Primary.hover
Base.Gray.800        →     Theme.Text.primary
Base.Red.500         →     Theme.Interactive.danger
Base.Green.500       →     Theme.Text.success
```

- **colors**: palette 값의 단일 소스
- **theme**: light/dark 맥락에서의 역할·상태·컴포넌트 매핑

제품 코드에서는 `var(--if-*)` 시맨틱 CSS 변수를 사용하고, palette 경로를 직접 하드코딩하지 않습니다.

## 사용 가이드

**Blue**

- Primary CTA, 현재 선택, focus ring, 핵심 링크에만 500–700 구간 사용
- 100–200은 배경 강조, 800–900은 decorative limit

**Gray / Gray-subtle**

- Text: 800(primary), 600(secondary), 400(tertiary), 300(disabled)
- Border: 300(default), 100(muted), 400(strong)
- Surface: 100–200 계열

**Green / Red / Amber**

- Badge, toast, progress, field error 등 **상태 피드백**에만 사용
- navigation chrome, brand area, decorative illustration에 쓰지 않음

**White / Black**

- canvas·inverse·on-color 조합의 기준으로만 사용
- 개별 컴포넌트에서 `#FFFFFF` / `#000000` 리터럴 대신 토큰 참조

## 금지 사항

- 컴포넌트에서 `Base.*` palette를 직접 참조하지 않는다 → `theme` 시맨틱 토큰을 거친다
- palette 이름(Red, Green)으로 UI 의미를 설명하지 않는다 → `danger`, `success`, `warning` 역할 이름 사용
- Green을 secondary brand color로 사용하지 않는다
- Figma·JSON에 없는 hex를 제품 코드에 추가하지 않는다
- `Gray`와 `Gray-subtle`을 같은 화면 계층에 혼용하지 않는다
- chromatic 500을 텍스트 본문색으로 쓰지 않는다 (대비·가독성 위반)

## Figma 동기화

- Figma mode name: `light` (`$extensions.com.figma.modeName`)
- 변수는 Figma Variables에서 export 후 `colors.json`을 갱신합니다
- `com.figma.variableId`는 역추적용으로 유지하며, 수동 삭제하지 않습니다
- publish 대상이 아닌 변수(`hiddenFromPublishing`)는 theme 쪽 alpha scale에 남겨 두고, `colors`에는 불투명 primitive만 둡니다
