import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';
import { useRef } from 'react';

describe('useClickOutside', () => {
  it('should call handler when clicking outside', () => {
    const handler = vi.fn();
    let ref: any;

    const { result } = renderHook(() => {
      ref = useRef(null);
      useClickOutside(ref, handler);
      return ref;
    });

    const div = document.createElement('div');
    document.body.appendChild(div);
    result.current.current = div;

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
    
    document.body.removeChild(div);
    document.body.removeChild(outsideElement);
  });

  it('should not call handler when clicking inside', () => {
    const handler = vi.fn();
    let ref: any;

    const { result } = renderHook(() => {
      ref = useRef(null);
      useClickOutside(ref, handler);
      return ref;
    });

    const div = document.createElement('div');
    document.body.appendChild(div);
    result.current.current = div;
    
    const event = new MouseEvent('mousedown', { bubbles: true });
    div.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
    
    document.body.removeChild(div);
  });

  it('should clean up event listeners on unmount', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement>(null) as any;
      useClickOutside(ref, handler);
      return ref;
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
