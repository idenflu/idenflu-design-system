# Rounded (Border Radius)

모서리 둥글기(`Rounded`)는 단순한 장식 요소가 아니라 시스템 전반에 일관된 인상을 형성하고 인터페이스의 시각적 성격을 조정하기 위한 기준입니다.

기본적으로 직선적이고 구조적인 형태를 유지하며, 필요한 경우에만 `Rounded`를 적용하여 **요소의 성격과 중요도를 표현**합니다.

## Philosophy (철학 및 원칙)

1. **형태를 통한 위계 `depth` 표현**
   모서리 둥글기는 컴포넌트가 담고 있는 정보의 단위와 시각적 무게에 비례하여 적용됩니다.
   - Atomic 컴포넌트 (`Chip` · `Badge`)  
     중요한 정보를 전달하는 역할을 하므로, 상대적으로 크고 뚜렷한 반경을 적용하여 강조 효과를 제공

   - Container (`Card` · `Modal`)  
     작은 반경을 사용하여 시각적 안정감과 견고함을 확보

2. **`rounded-none`**
   기본적으로 Radius 없이 Hairline (Border)으로 구분합니다.
   특별한 의도나 컨테이너 구조를 가질 때 점진적으로 확장합니다.

## Usage Guidelines

### Do (권장 사항)

- 작은 요소는 큰 반경, 큰 요소는 작은 반경을 사용
- 텍스트 길이에 따라 좌우로 늘어나는 컴포넌트(`Tag`, `Chip`)에는 `rounded-full`을 사용하여 일관된 모양을 유지

### Dont't (금지 사항)

- 임의의 값을 사용하지 않기
- 대형 컨테이너에 과도하게 큰 값을 사용하지 않기
- 동일한 컴포넌트 계열에서 여러 값을 혼용하지 않기

## Tokens & Values (토큰 및 값)

| Token        | Value  |
| ------------ | ------ |
| rounded-none | 0px    |
| rounded-sm   | 2px    |
| rounded-md   | 4px    |
| rounded-lg   | 8px    |
| rounded-full | 9999px |
