import React, { useState, useCallback, useMemo, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { InfoView } from "./LabeledInput";

const fileReader = new FileReader();

export const FileUploader = ({ setBytes }) => {
  const [filename, setFilename] = useState("");

  const onDrop = useDrop((file) => {
    setFilename(file.name);
    setBytesFromFile(file, setBytes);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      className={
        isDragActive ? "upload-form-file-highlighted" : "upload-form-file"
      }
      onSubmit={handleSubmit}
    >
      <div {...getRootProps({ className: "upload-container" })}>
        <div className="grey-220">Upload your business prospectus</div>
        <div>{filename}</div>
        <InfoView
          info={
            "Your business prospectus, if you have one already. If you don't, you can upload it later."
          }
        />
        <div className="upload-custom">
          <button className="file-custom secondary-button">
            Upload prospectus
          </button>
          <input
            {...getInputProps()}
            className="upload-input"
            type="file"
            accept="image/*"
          />
        </div>
        <div className="grey-220">or Drag and drop here</div>
      </div>
    </form>
  );
};

const setBytesFromFile = (file, setBytes) => {
  fileReader.onload = () => {
    const binaryStr = fileReader.result;
    console.log(binaryStr);
    setBytes(binaryStr);
  };

  fileReader.readAsArrayBuffer(file);
};

// shared callback to be used for regular file and image upload
export const useDrop = (onFile) => {
  return useCallback((acceptedFiles) => {
    console.log("drop: accepted files: %o", acceptedFiles);
    if (acceptedFiles && acceptedFiles.length === 1) {
      let file = acceptedFiles[0];
      console.log(file);
      //   console.log("will set file: " + file.name);
      onFile(file);
    } else {
      console.error("Unexpected: acceptedFiles: %o", acceptedFiles);
    }
  }, []);
};
