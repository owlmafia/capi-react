import React, { useState, useCallback } from "react";
import { ImageCropper } from "./ImageCropper";
import { useDropzone } from "react-dropzone";

const fileReader = new FileReader();

export const ImageUpload = ({ initImageBytes, setImageBytes }) => {
  // the initial image - not updated when changing the crop area
  const [inputImg, setInputImg] = useState(initImageBytes + "");
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
