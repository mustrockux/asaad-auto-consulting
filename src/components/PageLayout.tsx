import { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-steel-light">{subtitle}</p>}
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
  );
}
