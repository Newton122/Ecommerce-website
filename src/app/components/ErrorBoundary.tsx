"use client";

import { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("Unhandled error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.replace(window.location.pathname);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4 text-primary"><AlertCircle size={48} /></div>
            <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
              Something went wrong
            </h2>
            <p className="text-white/50 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              We hit an unexpected error. You can try again or go back home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-primary text-black rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-all"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
