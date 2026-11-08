import { beforeEach, describe, expect, it } from '@jest/globals';

import { useUiStore } from '@/store/ui-store';

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ selectedChildId: null });
  });

  it('starts with no selected child', () => {
    expect(useUiStore.getState().selectedChildId).toBeNull();
  });

  it('updates and clears the selected child id', () => {
    useUiStore.getState().setSelectedChildId('child-1');
    expect(useUiStore.getState().selectedChildId).toBe('child-1');

    useUiStore.getState().setSelectedChildId(null);
    expect(useUiStore.getState().selectedChildId).toBeNull();
  });

  it('holds only UI state (no server data)', () => {
    const keys = Object.keys(useUiStore.getState()).sort();
    expect(keys).toEqual(['selectedChildId', 'setSelectedChildId']);
  });
});
