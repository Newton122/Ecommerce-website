export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-8xl font-extrabold text-white/10 mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
          Page Not Found
        </h2>
        <p className="text-white/60 text-base mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary text-black font-semibold hover:bg-primary/90 transition-all duration-200"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
