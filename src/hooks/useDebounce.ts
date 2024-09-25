import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 250): T {
  const [debounceValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // clean up use effect
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}
