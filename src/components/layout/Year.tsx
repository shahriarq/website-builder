"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Anno corrente: il valore di build viene sostituito da quello del browser. */
export function Year({ initial }: { initial: number }) {
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => initial);
  return <>{year}</>;
}
