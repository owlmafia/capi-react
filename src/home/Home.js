import React, { useState, useEffect } from "react";

const wasmPromise = import("wasm");

export const Home = () => {
  const [foo, setFoo] = useState("");

  useEffect(() => {
    const init = async () => {
      const { init_log } = await wasmPromise;
      await init_log();
    };
    init();
  }, []);

  return (
    <div>
      <div className="container">
        <p>{"Foo res: " + JSON.stringify(foo)}</p>

        <button
          className="submit-button"
          onClick={async () => {
            const { foo } = await wasmPromise;

            try {
              let fooRes = await foo("not used string demo paramater", {
                field: "hello field!",
              });
              setFoo(fooRes);
            } catch (e) {
              console.error(e + "");
            }
          }}
        >
          {"Call foo"}
        </button>
      </div>
    </div>
  );
};
