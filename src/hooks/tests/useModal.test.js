import { renderHook, act } from '@testing-library/react-hooks';
import useModal from '../useModal';

describe('useModal Hook', () => {
  it('renders the default state', () => {
    const { result } = renderHook(useModal);
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle the modal opened and closed', () => {
    const { result } = renderHook(useModal);
    act(() => result.current.toggleModal());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggleModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('should open and close the modal', () => {
    const { result } = renderHook(useModal);
    act(() => result.current.openModal());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.closeModal());
    expect(result.current.isOpen).toBe(false);
  });
});
