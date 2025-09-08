import GenericBlockSkeleton from "@/components/ui/skeleton-card";

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full">
        <GenericBlockSkeleton />
      </div>
    </div>
  );
}
