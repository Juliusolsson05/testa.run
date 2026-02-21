import { RequireAuth } from "@/components/auth/RequireAuth"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}
