"use client"

import React from "react"

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

/**
 * A6: Error Boundary for graceful degradation of client components.
 * Catches rendering errors and displays a premium-styled fallback UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 mb-6 border border-black/10 flex items-center justify-center">
                        <span className="text-2xl font-serif text-black/30">!</span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-black/40 font-medium mb-2">
                        Algo salió mal
                    </p>
                    <p className="text-sm text-black/50 font-light max-w-md">
                        No pudimos cargar esta sección. Intenta recargar la página.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-6 px-6 py-2 text-[10px] uppercase tracking-[0.2em] border border-black/20 text-black/60 hover:bg-black hover:text-white transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
