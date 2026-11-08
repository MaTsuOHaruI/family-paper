import { describe, expect, it } from '@jest/globals';

import { createQueryClient } from '@/lib/query-client';

describe('createQueryClient', () => {
  it('returns a separate client on every call', () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });

  it('retries queries once and never retries mutations', () => {
    const options = createQueryClient().getDefaultOptions();
    expect(options.queries?.retry).toBe(1);
    expect(options.mutations?.retry).toBe(0);
  });

  it('keeps fetched data fresh for a short time', () => {
    const options = createQueryClient().getDefaultOptions();
    expect(options.queries?.staleTime).toBe(30_000);
  });
});
