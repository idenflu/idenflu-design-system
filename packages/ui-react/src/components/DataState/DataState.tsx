import * as React from "react";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { List, ListItem } from "../List";
import { useDataState, type DataStateOptions } from "./useDataState";
import styles from "./DataState.module.css";

export type DataStateProps<T> = DataStateOptions<T> & {
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => React.Key;
  searchLabel?: string;
};
export function DataState<T>({ load, matches, initialItems, renderItem, getKey, searchLabel = "검색" }: DataStateProps<T>) {
  const state = useDataState({ load, matches, initialItems });
  return <section className={styles.root} data-state={state.status} aria-busy={state.status === "loading"}>
    <TextInput label={searchLabel} value={state.query} onChange={(event) => state.setQuery(event.target.value)} />
    <p role="status">{state.status === "loading" ? "목록을 불러오는 중입니다." : state.status === "error" ? "목록을 불러오지 못했습니다." : state.status === "empty" ? "등록된 항목이 없습니다." : state.status === "no-results" ? "검색 결과가 없습니다." : `${state.visibleItems.length}개 항목을 표시합니다.`}</p>
    {state.status === "error" && <Button variant="outlined" onClick={() => void state.reload()}>다시 시도</Button>}
    {state.status === "empty" && <Button variant="outlined" onClick={() => void state.reload()}>목록 불러오기</Button>}
    {state.status === "no-results" && <Button variant="ghost" onClick={() => state.setQuery("")}>검색 초기화</Button>}
    {state.status === "success" && <><Button variant="outlined" onClick={() => void state.reload()}>새로고침</Button><List>{state.visibleItems.map((item, index) => <ListItem key={getKey(item, index)}>{renderItem(item, index)}</ListItem>)}</List></>}
  </section>;
}
