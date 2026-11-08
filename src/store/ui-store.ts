import { create } from 'zustand';

// UI 状態のみを保持する（FR-013 の基盤）。
// サーバーデータ（子ども一覧・書類・予定など）はここへ複製しない。
// それらは TanStack Query が持ち、ここには選択中の子どもの ID だけを置く。
// null は「すべての子ども」または未選択を表す（意味づけは S1A-03 で確定する）。
// 永続化はしない（端末ストレージ用ライブラリは未承認）。
export interface UiState {
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  selectedChildId: null,
  setSelectedChildId: (id) => set({ selectedChildId: id }),
}));
