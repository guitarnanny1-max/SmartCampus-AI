import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 px-6 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

        <div>
          <div className="text-xl font-bold">
            SmartCampus<span className="text-gray-500">AI</span>
          </div>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
            The AI-powered operating system for education.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Product</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <Link className="block" href="/product/crm">CRM</Link>
            <Link className="block" href="/product/erp">ERP</Link>
            <Link className="block" href="/product/lms">LMS</Link>
            <Link className="block" href="/product/bms">BMS</Link>
            <Link className="block" href="/product/ai">AI</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Company</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <Link className="block" href="/about">About</Link>
            <Link className="block" href="/contact">Contact</Link>
            <Link className="block" href="/pricing">Pricing</Link>
            <Link className="block" href="/demo">Book a Demo</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">ThomasG Technologies</h3>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            SmartCampusAI is a flagship product of
            ThomasG Technologies.
          </p>
        </div>

      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t pt-6 text-sm
text-gray-500">
        © 2026 ThomasG Technologies. All rights reserved.
      </div>
    </footer>
  );
}
