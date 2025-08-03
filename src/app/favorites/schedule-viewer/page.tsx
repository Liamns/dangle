import { Suspense } from "react";
import ScheduleViewerContent from "./content";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function FavoriteScheduleViewerPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <ScheduleViewerContent />
    </Suspense>
  );
}
