import { useEffect } from "react";
import { PdfView } from "../pdf/PdfView";
import { updateHash } from "./controller";

export const ProspectusView = ({ deps, url, hash, setHash }) => {
  useEffect(() => {
    updateHash(deps, [], setHash);
  }, []);

  return (
    <div>
      <PdfView url={url} />
      <div>
        <span>{"Hash: "}</span>
        <span>{hash}</span>
      </div>
      <div>
        {
          "By acknowledging, you accept the conditions presented in this prospectus."
        }
      </div>
    </div>
  );
};
