import useWindowWidth from '../useWindoWidth';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useWindowWidth', () => {
  it('resizes the window', () => {
    const { result } = renderHook(useWindowWidth);
    window.innerWidth = 500;

    act(() => {
      result.handleResize();
    });
    expect(result.current.windowWidth).toBe(500);
  });
});
