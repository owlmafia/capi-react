import React, { useState, useCallback } from "react";
import { ImageCropper } from "./ImageCropper";
import { useDropzone } from "react-dropzone";

const fileReader = new FileReader();

export const ImageUpload = ({ initImageBytes, setImageBytes }) => {
  // the initial image - not updated when changing the crop area
  // TODO why it works with the hardcoded base64 string and not initImageBytes (containing exactly the same string)?
  const [inputImg, setInputImg] = useState(
    // "data:image/png;base64,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"
    initImageBytes
  );
  //   console.log("initImageBytes: %o", initImageBytes);

  // sets image: called when uploading image with button or dropping it in target zone
  const onDrop = useCallback((acceptedFiles) => {
    console.log("drop: accepted files: %o", acceptedFiles);
    if (acceptedFiles && acceptedFiles.length === 1) {
      let file = acceptedFiles[0];
      setImageFromFile(file, setInputImg);
    } else {
      console.error("Unexpected: acceptedFiles: %o", acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // called when the crop area is updated (also triggered by setting the image)
  const updateCrop = (blob) => {
    const bytes = blobToArrayBuffer(blob);
    console.log("crop updated - setting image bytes: %o", bytes);
    setImageBytes(bytes);
  };

  const clear = () => {
    setInputImg(null); // clear displayed image
    setImageBytes([]); // clear state
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();
  };

  return (
    <form
      className={isDragActive ? "upload-form-highlighted" : "upload-form"}
      onSubmit={handleSubmitImage}
    >
      {/* <div className="upload-container"> */}

      {/* upload image: set in inputImg via onDrop */}
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

      {/* crop image: gets image from inputImg hook, updates it via updateCrop */}
      {inputImg && (
        <ImageCropper
          updateBlob={updateCrop}
          inputImg={inputImg}
          clear={() => clear()}
        />
      )}
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
const setImageFromFile = (file, setImg) => {
  fileReader.addEventListener(
    "load",
    () => {
      //   console.log("init bytes have to look like this: %o", fileReader.result);
      setImg(fileReader.result);
    },
    false
  );
  if (file) {
    fileReader.readAsDataURL(file);
  }
};
