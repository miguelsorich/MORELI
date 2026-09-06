import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F0EEEF] flex items-center justify-center p-6 text-stone-800">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              Ocurrió un inconveniente temporal
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              La aplicación protegió tus datos para evitar bloqueos. Puedes recargar el catálogo con un clic.
            </p>
            {this.state.error && (
              <p className="text-[11px] font-mono text-stone-400 bg-stone-50 p-2 rounded-xl text-left truncate">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2A5A29] hover:bg-[#1e421d] text-white font-bold text-sm shadow-md cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recargar Catálogo Moreli</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
