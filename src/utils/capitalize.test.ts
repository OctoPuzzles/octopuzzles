import { describe, it, expect } from 'vitest';
import capitalize from './capitalize';

describe('capitalize', () => {
  it('capitalizes correctly', () => {
    expect(capitalize("hello there_man")).toEqual("Hello There Man");
  });
});
