# Theme

테마(`Theme`)는 Primitive Color를 제품 인터페이스의 실제 역할에 맞게 연결하는 시맨틱 토큰입니다.

컴포넌트는 직접 색상 값을 선택하지 않고, `Background`, `Surface`, `Border`, `Text`와 같은 역할 토큰을 사용해 라이트/다크 모드와 상태 표현을 일관되게 유지합니다.

> 소스: `src/themes/light.json`, `src/themes/dark.json`

## Philosophy (철학 및 원칙)

1. **역할 중심의 색상 사용**  
   색상은 시각적 값이 아니라 인터페이스 안에서의 역할로 선택합니다.  
   예: 버튼 배경은 `Brand.500`이 아니라 `Background.primary`를 사용합니다.

2. **테마 전환에 안전한 구조**  
   컴포넌트는 동일한 토큰 이름을 사용하고, 테마 파일이 실제 참조 값을 결정합니다.  
   이 구조를 통해 라이트/다크 모드에서도 컴포넌트 API와 스타일 규칙을 유지할 수 있습니다.

## Core Concepts (핵심 개념)

### Token Layer

| Layer     | Role                   | Example                    |
| --------- | ---------------------- | -------------------------- |
| Base      | 고정된 원시 색상 값    | `Base.Gray.900`            |
| Brand     | 브랜드 컬러 스케일     | `Brand.500`                |
| Theme     | 화면 역할 기반 토큰    | `Text.primary`             |
| Component | 컴포넌트의 실제 스타일 | `Button`, `Alert`, `Input` |

### Semantic Roles

| Role         | Usage                        |
| ------------ | ---------------------------- |
| `Background` | 버튼, 배지, 상태 영역의 배경 |
| `Surface`    | 페이지, 카드, 패널의 표면    |
| `Border`     | 구분선, 외곽선, 포커스 링    |
| `Text`       | 본문, 보조 텍스트, 링크      |

### State Scale

상태 토큰은 동일한 의미 안에서 단계적으로 확장합니다.

| State    | Meaning             | Example                     |
| -------- | ------------------- | --------------------------- |
| Default  | 기본 상태           | `Background.primary`        |
| Hover    | 마우스 오버 상태    | `Background.primary-hover`  |
| Active   | 눌림 또는 선택 상태 | `Background.primary-active` |
| Subtle   | 낮은 강조 배경      | `Background.error-subtle`   |
| Tint     | 가장 약한 강조 배경 | `Background.error-tint`     |
| Disabled | 비활성 상태         | `Text.disabled`             |

## Usage Guidelines (사용 기준 및 가이드라인)

### Do (권장 사항)

- 컴포넌트 스타일에는 `Base` 색상보다 `Theme` 토큰을 우선 사용
- 의미가 같은 상태는 같은 계열의 토큰으로 확장  
  예: `error` → `error-hover` → `error-active`
- 표면 위 요소는 `Surface`와 `on-*` 토큰의 관계를 기준으로 배치
- 텍스트 대비는 실제 배경 토큰과 함께 검증

### Dont't (금지 사항)

- 컴포넌트 CSS에서 HEX, RGB, Primitive Color를 직접 사용하지 않기
- 라이트/다크 모드별 스타일을 컴포넌트 내부에 중복 정의하지 않기
- 동일한 의미에 `Background`, `Border`, `Text` 토큰을 임의로 혼용하지 않기
- 상태 토큰 없이 hover, active 색상을 별도로 만들지 않기
