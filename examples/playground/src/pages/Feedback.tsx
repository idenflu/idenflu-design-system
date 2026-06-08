import * as React from "react";
import { Banner, Button, EmptyState, ErrorState, Icon, LoadingState, Skeleton } from "@idenflu/ui-react";
import { Col, Group, Row, Section } from "../Section";
import { Example } from "../Example";

export function FeedbackSection() {
  const [bannerOpen, setBannerOpen] = React.useState(true);

  return (
    <Section id="feedback" title="Feedback">
      <Example
        title="주요 예시 — Banner"
        code={`<Banner tone="info" title="Info">일반 안내 메시지입니다.</Banner>`}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <Banner tone="info" title="Info">
            일반 안내 메시지입니다.
          </Banner>
        </div>
      </Example>
      <Group label="Banner — tones / action / dismiss">
        <Col>
          {bannerOpen ? (
            <Banner
              tone="warning"
              title="검토 대기 중"
              icon={<Icon name="icon-alert" />}
              action={
                <Button variant="quiet" size="small">
                  Review
                </Button>
              }
              onDismiss={() => setBannerOpen(false)}
            >
              3건의 제출물이 검토를 기다리고 있습니다.
            </Banner>
          ) : (
            <Button variant="quiet" size="small" onClick={() => setBannerOpen(true)}>
              Banner 다시 보기
            </Button>
          )}
          <Banner tone="info" title="Info">
            일반 안내 메시지입니다.
          </Banner>
          <Banner tone="success" title="Success">
            저장되었습니다.
          </Banner>
          <Banner tone="error" title="Error">
            저장에 실패했습니다.
          </Banner>
        </Col>
      </Group>
      <Group label="LoadingState — sizes">
        <Row>
          <LoadingState label="Loading" size="small" />
          <LoadingState label="Loading reviewers" description="잠시만 기다려 주세요." />
          <LoadingState label="Loading" size="large" />
        </Row>
      </Group>
      <Group label="ErrorState — tones">
        <Row>
          <ErrorState tone="error" title="불러오기 실패" description="네트워크를 확인하세요." action={<Button variant="quiet" size="small">Retry</Button>} />
          <ErrorState tone="warning" title="부분 실패" description="일부 항목을 불러오지 못했습니다." />
          <ErrorState tone="critical" title="치명적 오류" description="관리자에게 문의하세요." />
        </Row>
      </Group>
      <Group label="EmptyState — tones">
        <Row>
          <EmptyState tone="empty" title="결과 없음" description="필터를 조정해 보세요." />
          <EmptyState tone="filtered" title="필터 결과 없음" description="조건을 완화해 보세요." />
          <EmptyState tone="permission" title="접근 권한 없음" description="관리자에게 요청하세요." />
          <EmptyState tone="error" title="오류" description="다시 시도하세요." />
        </Row>
      </Group>
      <Group label="Skeleton — variants">
        <Col>
          <Skeleton variant="text" lines={3} />
          <Row>
            <Skeleton variant="circle" />
            <Skeleton variant="block" width={220} height={56} />
          </Row>
        </Col>
      </Group>
    </Section>
  );
}
