import { Suspense } from "react";
import ProfileViewerContent from "./content";
import LoadingOverlay from "@/shared/components/LoadingOverlay";

export default function ProfileViewerPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <ProfileViewerContent />
    </Suspense>
  );
}
