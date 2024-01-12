import { useState, useEffect } from "react";

/**Local Storage  */
const initialStorage = () => {
  const data = JSON.parse(localStorage.getItem("WATCHEDLIST"));
  if (!data) return [];
  return data;
};

export default function useLocalStorageState() {
  const [value, setValue] = useState(initialStorage);

  /** Display Stored recent watch in local Storage */
  useEffect(() => {
    localStorage.setItem("WATCHEDLIST", JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
