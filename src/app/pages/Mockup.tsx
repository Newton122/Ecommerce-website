"use client"
import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function MockupPage() {
  const [src, setSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  async function handleFile(file?: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      try {
        sessionStorage.setItem("mockupImage", dataUrl)
        sessionStorage.setItem("mockupFileName", file.name)
        sessionStorage.setItem("mockupFileType", file.type)
        sessionStorage.setItem("mockupFileSize", String(file.size))
      } catch (e) {
        // ignore storage errors
      }
      setSrc(dataUrl)
      setFileName(file.name)
      setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`)
    }
    reader.readAsDataURL(file)
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (f) handleFile(f)
  }

  function clear() {
    setSrc(null)
    setFileName(null)
    setFileSize(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function goToCustom() {
    router.push("/custom")
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[40px] border border-border bg-card/90 p-10 shadow-[0_50px_120px_-70px_rgb(15,23,42)]">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">Mockup Studio</p>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">Large preview mockup for uploaded artwork.</h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">Upload your design here, preview it in a large canvas, then continue to the custom page for order configuration. The canvas is built to feel like a real product mockup stage.</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                >
                  Upload design
                </button>
                <button
                  onClick={goToCustom}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!src}
                >
                  Open on custom page
                </button>
              </div>
              <div className="rounded-3xl border border-white/10 bg-background/70 p-6 text-sm text-muted-foreground">
                <p className="font-semibold text-white mb-3">Design info</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-background/80 px-4 py-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">File</span>
                    <span className="text-sm text-white">{fileName ?? "No file selected"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-background/80 px-4 py-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">Size</span>
                    <span className="text-sm text-white">{fileSize ?? "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                className={`relative flex h-[680px] w-full flex-col overflow-hidden rounded-[36px] border border-border bg-background transition ${dragging ? "border-primary/60 bg-background/90" : "bg-background"}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_30%)] pointer-events-none" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-white/50">Live mockup preview</p>
                      <p className="text-xs text-muted-foreground">Drag & drop your artwork here</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-white/60">Preview mode</span>
                    </div>
                  </div>

                  <div className="relative flex-1 p-6">
                    <div className="absolute inset-6 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-inner" />
                    <div className="relative z-10 h-full overflow-hidden rounded-[28px] bg-background border border-white/5 p-6 flex items-center justify-center">
                      {!src ? (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-white mb-3">Upload artwork to preview</p>
                          <p className="max-w-xs text-sm text-muted-foreground">This canvas shows your design in a large, high-detail frame.</p>
                        </div>
                      ) : (
                        <img src={src} alt="Uploaded design preview" className="h-full w-full object-contain" />
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-xs text-muted-foreground">Tip: use a square or landscape image for best display.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}
