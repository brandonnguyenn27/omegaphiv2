import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonFormCard() {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="m-2 gap-2 flex flex-col">
          {/* Date input skeleton */}
          <div>
            <Skeleton className="h-10 w-full rounded-md" />
            {/* Error message skeleton - more subtle and shorter */}
            <Skeleton className="h-4 w-2/3 mt-1 rounded-sm opacity-40" />
          </div>

          {/* Start time input skeleton */}
          <div>
            <Skeleton className="h-10 w-full rounded-md" />
            {/* Error message skeleton - more subtle and shorter */}
            <Skeleton className="h-4 w-2/3 mt-1 rounded-sm opacity-40" />
          </div>

          {/* End time input skeleton */}
          <div>
            <Skeleton className="h-10 w-full rounded-md" />
            {/* Error message skeleton - more subtle and shorter */}
            <Skeleton className="h-4 w-2/3 mt-1 rounded-sm opacity-40" />
          </div>

          {/* Success/error message skeleton - more subtle */}
          <Skeleton className="h-4 w-full rounded-sm opacity-40" />

          {/* Button skeleton - exact height of a standard button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
