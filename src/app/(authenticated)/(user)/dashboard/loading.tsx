import GenericBlockSkeleton from "@/components/ui/skeleton-card"; // Adjust path if needed

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 md:flex-row md:gap-4">
      <div className="w-full md:w-1/2">
        <GenericBlockSkeleton />
      </div>

      <div className="w-full md:w-1/2">
        <GenericBlockSkeleton />
      </div>
    </div>
  );
}
