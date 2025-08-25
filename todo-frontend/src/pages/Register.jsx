import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Change this import to use auth from the api.js file
import { auth } from "@/lib/api"; // Changed from "@/lib/auth"
import { useAuth } from "@/context/AuthContext"; // Add this for direct context access

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setError("All fields are required");
    }
    
    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }
    
    try {
      setLoading(true);
      // Use the auth API directly or the context register function
      await auth.register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">Start organizing your tasks.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="********"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={onChange}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="********"
            autoComplete="new-password"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Register'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  )
}