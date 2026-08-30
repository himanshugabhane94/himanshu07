import React from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CrimeNet System Error Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-lg w-full p-8 rounded-2xl bg-slate-900 border border-red-500/40 shadow-2xl shadow-red-500/10 space-y-6 text-center">
            
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-100 tracking-tight">
                CrimeNet System Interruption
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected runtime error occurred in the investigative dashboard. The application caught the exception to prevent a complete crash.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
                <div className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Error Diagnostics:</span>
                </div>
                <div className="text-xs font-mono text-slate-300 break-words">
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
              >
                Try To Recover
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload CrimeNet</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              CrimeNet v1.0 • Ministry of Home Affairs • SIH26189
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
