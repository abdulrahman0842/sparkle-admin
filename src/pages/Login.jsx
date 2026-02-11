import { useState } from "react";
import { loginUser } from '../services/AuthService.js'
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage("");

        try {
            await loginUser(email, password)
            navigate('/', { replace: true })
            setLoading(false)

        } catch (error) {
            setError(error)
            setLoading(false)
        }
    };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center px-3">
            <div
                className="bg-white rounded-4 shadow-lg p-4 p-md-5"
                style={{ maxWidth: "420px", width: "100%" }}
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="fw-bold text-dark fs-4">
                        Welcome Back 👋
                    </h1>
                    <p className="text-muted small mt-2">
                        Sign in to continue
                    </p>
                </div>

                <form onSubmit={handleSignIn}>
                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="form-control form-control-lg"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="form-control form-control-lg"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                {error && <div className="text-danger py-2 d-flex justify-content-center">{error.toString()}</div>}
            </div>
        </div>

    );
}
