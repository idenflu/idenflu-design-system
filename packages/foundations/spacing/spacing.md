# Spacing

Spacing은 화면의 밀도, 정보 간 관계, 콘텐츠의 위계를 표현하기 위한 기준입니다.

적절한 간격은 콘텐츠를 구분하고 그룹화하며, 사용자가 정보를 빠르게 이해할 수 있도록 돕습니다.  
본 시스템은 [Carbon Design System - Spacing]의 간격 체계를 참고하여, 2·4·8 배수 기반의 스케일을 사용하며, `margin`과 `padding`을 체계적으로 제어해 화면 전반에 일관된 시각적 리듬을 부여합니다.

## Philosophy (철학 및 원칙)

1. **2·4·8 배수 기반의 단일 체계**  
   `2px`, `4px`, `8px` 배수를 정교하게 엮은 단일 체계를 사용하여, 촘촘한 내부 요소 정렬(소단계)부터 거대한 페이지 간격 정의(대단계)까지 하나의 흐름으로 유연하게 대응합니다.

2. **근접성의 원리 (Proximity Principle)**  
   여백은 단순히 비어있는 공간이 아니라 **정보를 그룹핑하는 시각적 도구**입니다.
   - 관계 표현
     - 가까울수록 관련성이 높음
     - 멀수록 독립적인 정보로 인식

   - 위계 표현
     - 작은 간격은 동일 그룹 내부
     - 큰 간격은 그룹과 그룹 사이
     - 매우 큰 간격은 섹션과 섹션 사이

## Core Concepts (핵심 개념)

**스페이스 사용 단계의 제한 (Spacing Rhythm)**

- **단계 수 최소화**
  동일한 화면이나 동일한 컴포넌트 그룹 안에서는 사용하는 스페이스 토큰의 종류(단계)를 최소한으로 제한
- **인접 단계 활용**  
  레이아웃을 구성할 때는 서로 인접한 단계를 조합하여 부드러운 밀도 변화를 유도

## Usage Guidelines (사용 기준 및 가이드라인)

### Do (권장 사항)

- 정보의 중요도와 묶음에 따라 한 화면 안에서 최대 3~4개 이내의 스페이스 토큰만 선택 집중하여 사용
- 인접한 단계의 토큰을 우선 사용

### Dont't (금지 사항)

- 임의의 px 값을 직접 사용하지 않기
- 너무 많은 간격 단계를 혼용하지 않기
- 그룹 내부 간격이 그룹 간 간격보다 작아지지 않도록 유의

## Tokens & Values (토큰 및 값)

| Token      | Value |
| ---------- | ----- |
| spacing-01 | 2px   |
| spacing-02 | 4px   |
| spacing-03 | 8px   |
| spacing-04 | 12px  |
| spacing-05 | 16px  |
| spacing-06 | 24px  |
| spacing-07 | 32px  |
| spacing-08 | 40px  |
| spacing-09 | 48px  |
| spacing-10 | 64px  |
| spacing-11 | 80px  |
| spacing-12 | 96px  |
| spacing-13 | 112px |
| spacing-14 | 160px |

## References

[Carbon Design System - Spacing]

[Carbon Design System - Spacing]: https://carbondesignsystem.com/elements/spacing/overview/
