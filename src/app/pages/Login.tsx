"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const err = await login(email, password)
    if (err) {
      setError(err)
      return
    }
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-6">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-border bg-card/90 p-10 shadow-2xl shadow-black/10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Account access</p>
          <h1 className="mt-4 text-4xl font-extrabold">Login to Blackphics</h1>
          <p className="mt-3 text-muted-foreground">Sign in to access your cart, order history, and custom design workflow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-3 w-full rounded-3xl border border-white/10 bg-background px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-3 w-full rounded-3xl border border-white/10 bg-background px-4 py-3 pr-12 text-white outline-none transition focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 mt-1 text-white/50 hover:text-white transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="rounded-3xl bg-red-500/15 px-4 py-3 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-black shadow-xl shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <p>Don't have an account?</p>
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}
