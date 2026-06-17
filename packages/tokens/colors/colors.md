# Colors

Idenflu의 **Primitive Color Palette**입니다.

본 컬러 시스템은 제품의 시각적 계층 구조를 형성하고, **엔터프라이즈 환경에 최적화된 색상 체계**를 구성하여 사용자에게 일관되고 신뢰감 있는 인터페이스를 제공하기 위해 설계되었습니다.

테마와 무관한 기본 색상 값을 정의하며, `themes`의 시맨틱 토큰이 `{Base.Blue.500}` 형태로 참조합니다.

## Philosophy (철학 및 원칙)

1. **엔터프라이즈 톤의 시각적 무게**

   [Tailwind CSS]의 색상 구조와 `[color]-500` 중심 스케일 개념을 참고하되, **_운영 화면 및 관리자 인터페이스에 적합_** 하도록 명도와 채도를 재조정하여 실제 업무 환경에서 안정적으로 사용할 수 있도록 차분한 톤으로 구성했습니다.

2. **데이터 중심의 단계적 확장**

   각 컬러 패밀리는 `100`부터 `900`까지 균등한 명도 축을 기준으로 나누어져 있으며, 이는 **의미와 상태 전달**을 우선하여 사용자가 화면 내에서 **_명확한 시각적 위계(Visual Hierarchy)_** 를 인지할 수 있도록 돕습니다.

## Core Concepts (핵심 개념)

1. **Anchor(`500`) 기준과 확장성**

   각 컬러 패밀리의 중심축이 되는 `500` 단계는 가장 대표적이고 활용도 높은 중심 색상입니다.

   Tailwind의 `[color]-500` 개념을 기반으로 하되, 엔터프라이즈 환경에 맞게 재보정한 색상을 사용합니다.
   - 명도 기준
     - `Gray 500` 인근의 중간 명도
     - 목표 OKLCH Lightness: `54` ~ `60`
     - Hue 특성에 따라 $\pm3$ 허용
   - 인터랙션 확장성
     - `400` 방향으로 최소 1단계 밝은 호버(Hover-light) 상태
     - `600` / `700` 방향으로 최소 2단계 어두운 호버 및 액티브(Hover/Active) 상태 등
   - 접근성
     - `White` 배경 위 단독 인터랙션 요소로 시각적으로 충분히 인지 가능해야 함
     - 버튼, 링크, 상태 배지 등에서 안정적인 대비 확보

2. **숫자 간격을 활용한 접근성 추정**

   `Gray` 스케일은 접근성 검증의 효율성을 높이기 위해, 색상 팔레트 위의 "단계 간 간격" 개념을 사용하고 있습니다.  
   [WCAG 2.2 Contrast] 기준을 1차 스크리닝하는 용도이며 컬러의 Hue 특성에 따라 미세한 오차가 발생할 수 있으므로, 반드시 실제 명도 대비 측정으로 검증해야 합니다.
   - 4단계 차이 ($\Delta4$):  
      `WCAG Contrast Level AA 4.5:1` 대비 만족 (예: White 배경 위에는 500 이상의 컬러 배치)
   - 3단계 차이 ($\Delta3$):  
      `WCAG Contrast Level AA 3:1` 대비 만족 (큰 텍스트 및 UI 요소용)

   > **⚠️ 필수 유의사항**
   >
   > 1. 위 전제는 빠른 작업을 위한 1차 스크리닝 가이드입니다.
   > 2. 이 기준은 Gray 계열 기준의 경험적 스케일입니다.
   > 3. 컬러 계열(Blue/Red 등)은 명도 체감이 다르므로 동일 규칙을 그대로 적용하지 않습니다.
   > 4. 최종 검토 시에는 실제 명도 대비 도구를 활용해 실측 검증을 반드시 완료해야 합니다.

## Usage Guidelines (사용 기준 및 가이드라인)

### Do (권장 사항)

- 의미 기반 토큰 사용 (`color-text-primary`)
- 인터랙션 정의 시 `Anchor(500)`를 기준으로 상하 단계를 규칙적으로 매핑  
  예: Normal=`Blue 500` → Hover=`Blue 400` → Active=`Blue 600`
- 1차 대비 검토 후 실측 검증

### Dont't (금지 사항)

- 임의의 HEX 값을 직접 사용하지 않기
- 채도가 너무 높은 색상을 운영 화면에 과도하게 사용하지 않기
- 단계 차이 규칙만을 맹신하여 대비 검증을 생략 금지

## Tokens & Values (토큰 및 값)

### Base Colors

| Family | Level | Value   |
| ------ | ----- | ------- |
| White  |       | #FFFFFF |
| Black  |       | #000000 |
| Blue   | 100   | #F0F6FF |
|        | 200   | #D0DFF8 |
|        | 300   | #A4BFEA |
|        | 400   | #6393E1 |
|        | 500   | #266EE1 |
|        | 600   | #0F54BB |
|        | 700   | #063D8F |
|        | 800   | #042A65 |
|        | 900   | #011944 |
| Green  | 100   | #EFF8F0 |
|        | 200   | #D3E4D5 |
|        | 300   | #A9C6AC |
|        | 400   | #6BA374 |
|        | 500   | #1E7D3A |
|        | 600   | #156D30 |
|        | 700   | #095121 |
|        | 800   | #063816 |
|        | 900   | #01230A |
| Red    | 100   | #FEF2F0 |
|        | 200   | #F9D5D1 |
|        | 300   | #E9ABA5 |
|        | 400   | #DB6D66 |
|        | 500   | #D2272E |
|        | 600   | #AD0119 |
|        | 700   | #7F0D15 |
|        | 800   | #5D0108 |
|        | 900   | #3C0204 |
| Amber  | 100   | #FCF3EB |
|        | 200   | #EBDBCD |
|        | 300   | #D2B89E |
|        | 400   | #B88857 |
|        | 500   | #A6650A |
|        | 600   | #814D07 |
|        | 700   | #613801 |
|        | 800   | #442602 |
|        | 900   | #2B1702 |

### Gray Colors

| Family | Level | Value   | Usage                                |
| ------ | ----- | ------- | ------------------------------------ |
| Gray   | 100   | #FAFAFA | Background, Border Muted             |
|        | 200   | #E1E1E1 | Background Disabled, Border Disabled |
|        | 300   | #BEBEBE | Border , Text Disabled               |
|        | 400   | #919191 | Border Strong, Text Tertiary         |
|        | 500   | #737373 |
|        | 600   | #555555 | Text Secondary , Text Active         |
|        | 700   | #3C3C3C | Background, Text Hover               |
|        | 800   | #262626 | Background, Text Primary             |
|        | 900   | #141414 | Background                           |

## References

[WCAG 2.2 Contrast]  
[Carbon Design System - Color]  
[Tailwind CSS - Colors]

[WCAG 2.2 Contrast]: https://www.w3.org/TR/WCAG22/#contrast-minimum
[Carbon Design System - Color]: https://carbondesignsystem.com/elements/color/overview/
[Tailwind CSS - Colors]: https://tailwindcss.com/docs/colors
[Tailwind CSS]: https://tailwindcss.com/docs/colors
