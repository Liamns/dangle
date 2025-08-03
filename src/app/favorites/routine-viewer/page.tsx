"use client";
import { Suspense } from "react";

import RoutineViewerContent from "./content";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function FavoriteRoutineViewerPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <RoutineViewerContent />
    </Suspense>
  );
}
