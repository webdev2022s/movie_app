import { useEffect } from "react";

export default function useKey(key, callbackFunction) {
  useEffect(() => {
    function Escape(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        callbackFunction();
      }
    }
    document.addEventListener("keydown", Escape);

    return function () {
      document.removeEventListener("keydown", Escape);
    };
  }, [key, callbackFunction]);
}
