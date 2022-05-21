import React, { useState } from "react";
import { ImageCropper } from "./ImageCropper";

export const ImageUpload = ({ setImageBytes }) => {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");

  const updateBlob = (blob) => {
    // pass blob up from the ImageCropper component

    const bytes = blobToArrayBuffer(blob);
    setImageBytes(bytes);
    // TODO remove this
    setBlob(blob);
  };

  const onInputChange = (e) => {
    // convert image file to base64 string
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        setInputImg(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();
    console.log("do something with blob: %o", blob);
  };

  return (
    <form className="upload-form" onSubmit={handleSubmitImage}>
      <div className="upload-container">
        <div className="ft-color-black">Upload an cover image</div>
        <div className="upload-custom">
          <label class="file-custom">Upload Image</label>
          <input className="upload-input" type="file" accept="image/*" onChange={onInputChange} />
        </div>
        <div className="ft-color-black">or Darg and drop here</div>
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
