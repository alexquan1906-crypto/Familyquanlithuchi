import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class PageErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page render failed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-4 font-semibold text-slate-800">Trang này gặp lỗi khi hiển thị.</p>
          <button
            type="button"
            className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white"
            onClick={() => this.setState({ hasError: false })}
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
