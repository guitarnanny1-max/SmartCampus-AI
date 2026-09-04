import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <>

      <main className="px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-5xl font-bold">
            Contact SmartCampusAI
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Talk to our team about your institution, deployment,
            integrations or partnership opportunities.
          </p>

          <form className="mt-10 space-y-5">
            <input
              placeholder="Name"
              className="w-full rounded-xl border px-4 py-3"
            />

            <input
              placeholder="Email"
              type="email"
              className="w-full rounded-xl border px-4 py-3"
            />

            <textarea
              placeholder="How can we help?"
              rows={6}
              className="w-full rounded-xl border px-4 py-3"
            />

            <button className="w-full rounded-xl bg-black px-6 py-4
font-semibold text-white">
              Send Message
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
