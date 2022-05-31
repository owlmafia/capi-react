import React, { useState, useCallback } from "react";
import { ImageCropper } from "./ImageCropper";
import { useDropzone } from "react-dropzone";

const fileReader = new FileReader();

export const ImageUpload = ({ setImageBytes }) => {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    console.log("accepted files: %o", acceptedFiles);
    if (acceptedFiles && acceptedFiles.length === 1) {
      let file = acceptedFiles[0];
      processFile(file, setInputImg);
    } else {
      console.error("Unexpected: acceptedFiles: %o", acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const updateBlob = (blob) => {
    // pass blob up from the ImageCropper component

    const bytes = blobToArrayBuffer(blob);
    setImageBytes(bytes);
    // TODO remove this
    setBlob(blob);
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();
    console.log("do something with blob: %o", blob);
  };

  return (
    <form
      className={isDragActive ? "upload-form-highlighted" : "upload-form"}
      onSubmit={handleSubmitImage}
    >
      {/* <div className="upload-container"> */}

      <div {...getRootProps({ className: "upload-container" })}>
        <div className="ft-color-black">Upload an cover image</div>
        <div className="upload-custom">
          <button className="file-custom secondary-button">Upload Image</button>
          <input
            {...getInputProps()}
            className="upload-input"
            type="file"
            accept="image/*"
          />
        </div>
        <div className="ft-color-black">or Drag and drop here</div>
      </div>
      {inputImg && <ImageCropper updateBlob={updateBlob} inputImg={inputImg} />}
    </form>
  );
};

async function blobToArrayBuffer(blob) {
  if ("arrayBuffer" in blob) return await blob.arrayBuffer();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject;
    reader.readAsArrayBuffer(blob);
  });
}

// convert image file to base64 string and set
const processFile = (file, setImg) => {
  fileReader.addEventListener(
    "load",
    () => {
      setImg(fileReader.result);
    },
    false
  );
  if (file) {
    fileReader.readAsDataURL(file);
  }
};
