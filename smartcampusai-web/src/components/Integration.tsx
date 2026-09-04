export default function Integration() {
  return (
    <section className="border-y bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">

        <p className="text-sm font-semibold uppercase tracking-widest
text-gray-500">
          Connected campus
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight
md:text-5xl">
          One student. Every system connected.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Enter information once. SmartCampusAI keeps the
          institution synchronized.
        </p>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4
md:grid-cols-4">
          {["CRM", "ERP", "LMS", "BMS"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-white p-8 text-2xl
font-bold shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-3xl border bg-black
p-8 text-white">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Unified intelligence
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            AI + Student 360°
          </h3>
        </div>

      </div>
    </section>
  );
}
