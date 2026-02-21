import { WorkspacePage } from "@/components/workspace/WorkspacePage"

export default async function WorkspaceRoute({
  searchParams,
}: {
  searchParams: Promise<{ issueId?: string; nodeId?: string }>
}) {
  const { issueId, nodeId } = await searchParams
  return <WorkspacePage initialIssueId={issueId} initialNodeId={nodeId} />
}
