import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl bg-black px-8 py-16
text-center text-white md:px-16">

        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Ready to run your campus smarter?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300">
          Connect admissions, academics, learning, finance and
          operations in one intelligent platform.
        </p>

        <Link
          href="/demo"
          className="mt-8 inline-block rounded-xl bg-white px-7 py-4
font-semibold text-black"
        >
          Book a Demo
        </Link>

      </div>
    </section>
  );
}
