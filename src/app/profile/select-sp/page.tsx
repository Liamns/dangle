import { Suspense } from "react";
import SelectSpContent from "./content";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function SelectSpPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <SelectSpContent />
    </Suspense>
  );
}
