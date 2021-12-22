import { useEffect } from "react";

const useTitle = title => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return document.title;
};

export default useTitle;
