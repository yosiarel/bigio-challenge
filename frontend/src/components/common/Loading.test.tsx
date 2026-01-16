import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading, { LoadingSpinner } from './Loading';

describe('Loading', () => {
  it('should render loading component with spinner and text', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with minimum height of 400px', () => {
    const { container } = render(<Loading />);
    const wrapper = container.querySelector('.min-h-\\[400px\\]');
    expect(wrapper).toBeInTheDocument();
  });

  it('should center content', () => {
    const { container } = render(<Loading />);
    const wrapper = container.querySelector('.flex.items-center.justify-center');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('LoadingSpinner', () => {
  it('should render with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('.w-4');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with medium size', () => {
    const { container } = render(<LoadingSpinner size="md" />);
    const spinner = container.querySelector('.w-8');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.w-12');
    expect(spinner).toBeInTheDocument();
  });

  it('should default to medium size when size prop is not provided', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.w-8');
    expect(spinner).toBeInTheDocument();
  });

  it('should have orange top border', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.border-t-orange-500');
    expect(spinner).toBeInTheDocument();
  });

  it('should be circular', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.rounded-full');
    expect(spinner).toBeInTheDocument();
  });

  it('should have spin animation', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
