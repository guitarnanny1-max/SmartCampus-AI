import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpen,
  Building2,
} from "lucide-react";

const products = [
  {
    name: "CRM",
    title: "Turn enquiries into admissions.",
    description:
      "Manage leads, counselling, follow-ups, applications and conversion.",
    icon: Users,
    href: "/product/crm",
  },
  {
    name: "ERP",
    title: "Run your academic institution.",
    description:
      "Manage students, teachers, attendance, fees, academics and exams.",
    icon: GraduationCap,
    href: "/product/erp",
  },
  {
    name: "LMS",
    title: "Transform learning.",
    description:
      "Deliver courses, lessons, assignments, assessments and progress tracking.",
    icon: BookOpen,
    href: "/product/lms",
  },
  {
    name: "BMS",
    title: "Manage the business behind education.",
    description:
      "Manage finance, HR, assets, inventory, procurement and facilities.",
    icon: Building2,
    href: "/product/bms",
  },
];

export default function Platform() {
  return (
    <section id="features" className="border-y bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            One platform
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Everything your institution needs.
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Four connected business systems. One secure platform. One source
            of truth.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;

            return (
              <Link
                href={product.href}
                key={product.name}
                className="group rounded-3xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon size={32} />

                <p className="mt-7 text-sm font-bold uppercase tracking-wider">
                  {product.name}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {product.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {product.description}
                </p>

                <p className="mt-6 font-semibold">
                  Explore {product.name} →
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
