import Loading from "@/components/Loading/Loading";
import Play from "@/components/Play/Play";
import React, { Suspense } from "react";

export default function PlayPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Play />
    </Suspense>
  );
}
