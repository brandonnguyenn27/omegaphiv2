import { Skeleton } from "@/components/ui/skeleton"; // Ensure this path is correct

export default function GenericBlockSkeleton() {
  return (
    <div className="flex h-[50vh] flex-col space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="h-7 w-1/3 rounded-md" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>

      <div className="pt-2 space-y-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
