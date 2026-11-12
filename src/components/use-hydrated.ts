import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress";

export function useProgressHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useProgress.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useProgress.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
