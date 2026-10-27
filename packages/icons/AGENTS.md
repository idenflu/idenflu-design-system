# Icon authoring rules

이 규칙은 `packages/icons/**`에서 아이콘을 생성·추가·수정할 때 적용한다.

## 기준과 작업 범위

- 아이콘은 요청의 의미와 [디자인 원칙](../../docs/foundations/icons/design-principles.md), 기존 `src/icons.svg`를 기준으로 생성한다. Figma 원본이나 노드 URL을 요구하지 않는다. 이 아이콘 작업 기준은 상위의 일반적인 Figma 기반 UI 컴포넌트 작업 절차보다 우선한다.
- 추가 전에 같은 의미·형태의 기존 아이콘을 확인하고 재사용한다. 새 모티프는 아래 생성 순서와 디자인 원칙의 공통 규격으로 직접 설계한다.
- 요청과 무관한 기존 아이콘의 재정렬·변형·이름 변경·삭제를 하지 않는다.

### 기준의 우선순위

- 요청에서 의미·사용 맥락을 파악하고, 형태는 디자인 원칙을 기준으로 결정한다. 기존 개별 아이콘의 예외를 새 아이콘의 기본값으로 확장하지 않는다.
- 기존 자산은 조형 비교 자료다. 선 두께는 1.5를 사용하며 기존 자산 전체의 변경은 사용자가 요청한 범위에서 수행한다.
- Material은 디자인 문서에 명시된 여백·키라인 등의 참고 자료이며, 외부 원본 확보는 생성의 선행 조건이 아니다.

### 생성 순서

1. 대상·동작을 한 문장으로 정하고 같은 의미의 기존 아이콘이 있는지 확인한다. 의미가 불분명해 모티프가 달라지는 경우에만 질문한다.
2. `src/icons.svg`에서 의미 또는 형태가 가까운 비교 아이콘을 선택한다. 같은 계열을 우선하고, 비교 자산이 없으면 기본 기하 형태에서 시작한다.
3. 핵심 모티프와 키라인을 선택하고 공통 선 규격으로 설계한다. 브랜드 고유 비유도 허용하되 의미와 계열의 일관성을 유지한다.
4. 14·16·20px에서 비교 아이콘과 나란히 보고 내부 공간·무게·중심·잘림을 보정한 뒤 등록한다. 크기마다 다른 도형을 만들지 않는다.
5. 아래 구조 검사와 브라우저 검증을 수행하고 근거와 결과를 기록한다.

### 디자인 근거 기록

- PR 설명에 아이콘의 의미, 선택한 모티프·키라인, 비교한 기존 아이콘 이름, 시각 보정과 규격 예외의 이유를 기록한다. 비교 자산이 없으면 공통 규격에서 설계했음을 적는다. PR을 만들지 않는 작업은 완료 보고에 남긴다.
- 요청의 의미가 불분명하거나 공통 규격 자체를 변경해야 하는 경우에만 필요한 결정을 질문한다. 원본이 없다는 이유로 생성을 중단하지 않는다.

## 디자인 원칙

생성·수정 전에 [Icon design principles](../../docs/foundations/icons/design-principles.md)를 읽고 의미·형태·선·공간·색상 기준을 따른다. 최소 내부 간격의 공통 수치는 아직 미확정이다. 문서의 비교 도형을 확정된 최소 간격의 수치 근거로 사용하지 않는다.

## SVG 구조

- `src/icons.svg`의 단일 스프라이트에 `<symbol>`로 등록한다. 아이콘별 React 컴포넌트나 별도 스프라이트를 만들지 않는다.
- 새 심볼의 공통 속성은 `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`다. 부분 채움은 디자인 원칙이 허용하는 점·작은 식별 요소에만 적용한다.
- 둥근 외곽 모서리가 필요한 경우 반경 1을 도형 경로에 반영한다. `stroke-linejoin="round"`나 `stroke-linecap="round"`로 대체하지 않는다.
- 다른 외곽에 연결되는 내부선은 별도 경로로 분리해 필요한 경우 `stroke-linecap="butt"`를 적용한다. 외부에 드러나는 선 끝은 square를 유지하고, 끝점 보정으로 해결할 수 있으면 공통 속성을 유지한다. 별도 경로를 한 `d` 안의 하위 경로로 합쳐 예외를 모든 선 끝에 적용하지 않는다.
- 겹침은 뒤쪽 선을 실제로 끊어서 표현한다. 앞쪽 외곽과 뒤쪽 선 끝의 실제 외곽 사이에 빈 여백을 두고 14px에서도 분리되는지 확인한다. 배경색으로 덮는 방식은 사용하지 않는다.
- 고정 색상·불투명도, 불필요한 편집기 메타데이터, 스크립트, 이벤트 속성, 외부 자산 참조를 넣지 않는다. 필요한 내부 참조 ID는 다른 심볼과 충돌하지 않게 한다.

## 이름과 등록

- 이름은 의미 중심의 소문자 kebab-case로 짓고, 방향은 `arrow-left`처럼 접미사로 구분한다. 기존 명명 패턴을 따른다.
- `symbol id`, `src/index.ts`의 `iconNames`, `src/index.d.ts`의 선언 목록을 함께 갱신한다. 중복 없이 세 곳의 이름 집합을 일치시킨다.
- `IconName`, `getIconHref`, 공개 export 경로와 스프라이트 참조 방식의 호환성을 유지한다.

## 접근성과 사용 책임

- 심볼 내부에 특정 언어의 고정 레이블을 넣지 않는다. 장식용 숨김과 의미 전달용 레이블은 사용하는 `Icon`에서 처리한다.
- 색상·불투명도로 표현하는 상태는 소비하는 UI에서 처리한다. 의미가 달라지는 별도 도형은 요청된 동작·상태에 필요하고 기존 아이콘으로 대체할 수 없을 때 추가한다. 같은 계열의 기본 도형과 비례를 유지한다.

## 완료 전 검증

### 구조 검사

저장소 루트에서 다음 명령으로 XML 파싱, 중복 ID, 세 등록 목록의 집합 일치와 참조 대상을 확인한다. 공통 속성의 누락·차이는 출력된 항목을 디자인 원칙의 허용 예외와 작업 기록에 대조한다. 이 검사는 렌더링, 도형의 잘림, 금지된 SVG 콘텐츠 검토를 대신하지 않는다.

```bash
python3 - <<'PY'
from collections import Counter
from pathlib import Path
import re
import xml.etree.ElementTree as ET

base = Path("packages/icons/src")
root = ET.parse(base / "icons.svg").getroot()
assert root.tag == "{http://www.w3.org/2000/svg}svg", "SVG root/namespace"
symbols = root.findall("{http://www.w3.org/2000/svg}symbol")
assert symbols and all(node.get("id") for node in symbols), "Missing symbol ID"
ids = [node.get("id") for node in root.iter() if node.get("id")]
assert all(count == 1 for count in Counter(ids).values()), "Duplicate SVG IDs"
names = {node.get("id") for node in symbols}
for filename in ("index.ts", "index.d.ts"):
    match = re.search(r"\biconNames\s*(?::\s*readonly\s*)?(?:=\s*)?\[([^\]]*)\]", (base / filename).read_text())
    assert match, f"iconNames not found: {filename}"
    entries = re.findall(r'"([^"]+)"', match[1])
    assert len(entries) == len(set(entries)), f"Duplicate names: {filename}"
    assert set(entries) == names, f"Name set mismatch: {filename}"
common = {"viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor",
          "stroke-width": "1.5", "stroke-linecap": "square", "stroke-linejoin": "miter"}
for symbol in symbols:
    for node in symbol.iter():
        for key, expected in common.items():
            if key == "stroke-linecap" and node is not symbol and node.get(key) == "butt":
                print("Review junction-only butt:", symbol.get("id"))
                continue
            if (node is symbol or key in node.attrib) and node.get(key) != expected:
                print("Review design-rule exception:", symbol.get("id"), key, node.get(key))
for node in root.iter():
    for key, value in node.attrib.items():
        if key.split("}")[-1] == "href":
            assert value.startswith("#") and value[1:] in ids, f"Invalid href: {value}"
        for target in re.findall(r'url\(\s*[\'"]?#([^\s)\'"]+)[\'"]?\s*\)', value):
            assert target in ids, f"Missing reference: {target}"
print("Icon structure checks passed; review any exceptions above.")
PY
```

- 최종 diff에서 고정 색상·불투명도, 스크립트, 이벤트 속성, 외부 참조 등 금지 요소가 없는지 확인한다.
- 출력된 부분 채움·접합용 butt가 허용된 용도에만 쓰였는지 확인한다. 변경 대상의 미해결 위반이 있으면 완료로 보고하지 않는다.
- `npm run check:packages`도 실행한다. 이 명령은 패키지 구조와 필수 파일·문구를 검사하며, 위 아이콘 구조 검사나 브라우저 검증을 대신하지 않는다.

### 브라우저 검증

- 저장소 루트에서 `npm run storybook:ui-react`로 Storybook을 실행한다.
- Storybook `Foundations/Icons`에서 실제 `<use>`로 새 아이콘이 표시되는지 확인한다.
- 실제 `<use>`를 14·16·20px에서 표시하고 밝은·어두운 테마의 색상 상속을 확인한다. 현재 `Icon`의 `small`은 12px이므로 최소 가독성 확인에는 숫자 크기 `size={14}`를 명시한다. 이 문서 변경만으로 기존 크기 API를 변경하지 않는다.
- 접합부는 확대해서도 확인한다. 화살촉과 축, 봉투의 접힌 선, 문서 접힘, 겹친 도형의 끝에 돌출·이중선·원치 않는 접촉이 없는지 확인하고, 14px 원본 배율에서 다시 확인한다.
- 브라우저 검증이 불가능하면 미검증 항목을 명시한다. 단독 의미 식별과 같은 계열 옆의 무게·중심·비례를 모두 확인하고, PR 설명 또는 완료 보고에 아이콘 이름, 비교 대상, 확인한 크기·테마, 보정 이유와 결과를 기록한다.
- 최종 diff에서 요청 외 변경이 없는지 확인한다.

사용법과 구조는 [아이콘 가이드](../../docs/foundations/icons/icons.mdx)를 참고한다.
