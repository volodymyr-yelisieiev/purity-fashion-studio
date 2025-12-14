export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
        PURITY Fashion Studio
      </h1>
      <p className="mt-6 text-lg leading-8 text-neutral-600 max-w-2xl">
        Premium minimalist styling services and atelier. 
        Elevating your personal style with curated fashion.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Book a Consultation
        </button>
        <a href="/services" className="text-sm font-semibold leading-6 text-neutral-900">
          View Services <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
