import { Suspense } from "react";
import ScheduleContent from "./content";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function SchedulePage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <ScheduleContent />
    </Suspense>
  );
}
