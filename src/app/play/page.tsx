import Play from "@/components/Play/Play";
import React, { Suspense } from "react";

export default function PlayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Play />
    </Suspense>
  );
}
