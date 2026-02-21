import Link from "next/link"

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="mb-1 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
      {items.map((item, i) => (
        <span key={i} className="contents">
          {i > 0 && <span>›</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#1d6ef5]">{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
