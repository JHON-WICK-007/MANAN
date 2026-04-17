import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        this.setState({ info });
        console.error("Admin Panel Error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    background: "#0a0a0a", minHeight: "100vh", display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 40, color: "#fff", fontFamily: "monospace",
                }}>
                    <div style={{ fontSize: 36, marginBottom: 16 }}>💥</div>
                    <h2 style={{ color: "#ef4444", marginBottom: 12, fontSize: 18 }}>Something crashed</h2>
                    <pre style={{
                        background: "#1a1a1a", border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: 10, padding: 20, maxWidth: 800, width: "100%",
                        overflowX: "auto", fontSize: 12, color: "#f87171", whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}>
                        {this.state.error?.toString()}
                        {"\n\n"}
                        {this.state.info?.componentStack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: 20, padding: "10px 24px", background: "linear-gradient(135deg,#ee7c2b,#d46a1f)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 600, cursor: "pointer" }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
