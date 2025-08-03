import { Suspense } from "react";
import PwContent from "./content";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function PwPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <PwContent />
    </Suspense>
  );
}
