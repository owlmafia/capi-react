import { useEffect, useState } from "react";
import { getWasmVersion } from "../app/controller";

export const AppVersion = ({ deps }) => {
  const [wasmVersion, setWasmVersion] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      getWasmVersion(deps, setWasmVersion);
    }
    asyncInit();
  }, []);

  return (
    <div>
      {"Version: " + process.env.REACT_APP_VERSION + "::" + wasmVersion}
    </div>
  );
};
