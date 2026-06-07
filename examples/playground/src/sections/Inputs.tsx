import * as React from "react";
import { Icon, Select, TextField, Textarea } from "@idenflu/ui-react";
import { Col, Group, Section } from "../Section";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "done", label: "Done" },
];

export function InputsSection() {
  return (
    <Section id="inputs" title="Inputs">
      <Group label="TextField — states">
        <Col>
          <TextField label="Default" placeholder="you@idenflu.com" helperText="회사 이메일을 입력하세요." />
          <TextField label="Required" required placeholder="필수 값" />
          <TextField label="Success" state="success" defaultValue="ok@idenflu.com" helperText="사용 가능한 값입니다." />
          <TextField label="Invalid" state="invalid" error="이 값은 사용할 수 없습니다." defaultValue="bad" />
          <TextField label="Server error" state="server-error" error="서버 검증에 실패했습니다." defaultValue="taken" />
        </Col>
      </Group>
      <Group label="TextField — availability">
        <Col>
          <TextField label="Readonly" availability="readonly" defaultValue="읽기 전용" />
          <TextField label="Disabled" availability="disabled" defaultValue="비활성" />
          <TextField label="Locked" availability="locked" defaultValue="권한 잠금" />
        </Col>
      </Group>
      <Group label="TextField — affixes">
        <Col>
          <TextField label="With icon" icon={<Icon name="icon-search" />} placeholder="검색" />
          <TextField label="With prefix" prefix={<span>KRW</span>} placeholder="0" />
          <TextField label="With suffix" suffix={<span>@idenflu.com</span>} placeholder="user" />
          <TextField label="Prefix + suffix" prefix={<span>₩</span>} suffix={<span>/mo</span>} placeholder="0" />
        </Col>
      </Group>
      <Group label="Textarea & Select">
        <Col>
          <Textarea label="Notes" placeholder="메모를 입력하세요." helperText="최대 500자" />
          <Textarea label="Brief (invalid)" state="invalid" error="내용을 입력하세요." />
          <Select label="Status" options={statusOptions} />
          <Select
            label="Status (disabled option)"
            options={[...statusOptions, { value: "archived", label: "Archived (잠금)", disabled: true }]}
          />
          <Select label="Status (required, invalid)" required state="invalid" error="상태를 선택하세요." options={statusOptions} />
        </Col>
      </Group>
    </Section>
  );
}
