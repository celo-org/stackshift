import styles from "./FileHandler.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function FileHandler() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const onDrop = useCallback(async <T extends File>(acceptedFiles: T[]) => {
    // console.log(acceptedFiles[0]);
    if (acceptedFiles.length > 1 || !acceptedFiles.length) return;

    let folderSize = 0;
    const binaryFolderArray = [];

    setFileUpload(acceptedFiles[0]);

    for (let index = 0; index < acceptedFiles.length; index++) {
      let content = (await fileToBase64(acceptedFiles[index])) as string;
      if (content) {
        folderSize += acceptedFiles[index].size;
        setImageUrl(content);
        binaryFolderArray.push({
          path: "image",
          content: content.split(",")[1],
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const fileToBase64 = async (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
    });

  // useEffect(() => {
  //   function upload() {
  //     const formData = new FormData();
  //     formData.append("nftImage", fileUpload);

  //     formData.append("name", "The NFT Name");
  //     formData.append("desc", "The NFT Description");

  //     axios
  //       .post("http://localhost:4500/image/album", formData)
  //       .then((resp) => console.log(resp))
  //       .catch((err) => console.log(err));
  //   }

  //   if(fileUpload) upload()
  // }, [fileUpload]);

  return (
    <div>
      {
        <div
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundColor: imageUrl ? " rgba(50,50,50,.8)" : "transparent",
            backgroundBlendMode: "multiply",
            backgroundSize: "cover",
            color: imageUrl ? "white" : "black",
          }}
          className={styles.FileHandler}
          {...getRootProps()}
        >
          <input {...getInputProps()} accept="image/*" type="file" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop some files here, or click to select file</p>
          )}
        </div>
      }
    </div>
  );
}
