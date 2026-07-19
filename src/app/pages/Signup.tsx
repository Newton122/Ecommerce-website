"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { Check } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { user, loading, signup } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const passwordRules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ]

  const allRulesMet = passwordRules.every((r) => r.met)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!allRulesMet) {
      setError("Please meet all password requirements")
      return
    }

    const err = await signup(email, password, name)
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
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Create account</p>
          <h1 className="mt-4 text-4xl font-extrabold">Sign up for Blacphics</h1>
          <p className="mt-3 text-muted-foreground">Create your account to save your cart, manage orders, and order custom designs faster.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80">Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-background px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

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
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-3 w-full rounded-3xl border border-white/10 bg-background px-4 py-3 text-white outline-none transition focus:border-primary"
            />
            <div className="mt-3 space-y-1.5">
              {passwordRules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2 text-xs">
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${rule.met ? "bg-primary border-primary text-black" : "border-white/20 text-transparent"}`}>
                    {rule.met && <Check size={10} />}
                  </span>
                  <span className={rule.met ? "text-white/80" : "text-white/40"}>{rule.label}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="rounded-3xl bg-red-500/15 px-4 py-3 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading || !allRulesMet}
            className="w-full rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-black shadow-xl shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <p>Already have an account?</p>
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
