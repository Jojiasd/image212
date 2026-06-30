"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  // Select Image
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  // Get Images
 async function getImages() {
  try {
    const res = await fetch("/api/images");

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    setImages(data);
  } catch (err) {
    console.error(err);
  }
}

  // Upload Image
  async function uploadImage() {
    if (!file) {
      alert("Please choose an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error);
        setLoading(false);
        return;
      }

      alert("Image Uploaded Successfully!");

      setFile(null);
      setPreview("");

      getImages();
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    }

    setLoading(false);
  }

  useEffect(() => {
    getImages();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Supabase Image Upload & Gallery</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {file && (
        <p>
          Selected: <b>{file.name}</b>
        </p>
      )}

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={300}
          height={300}
          unoptimized
        />
      )}

      <button
        onClick={uploadImage}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      <hr style={{ width: "100%", margin: "40px 0" }} />

      <h2>Uploaded Images</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          width: "100%",
        }}
      >
        {images.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Image
              src={item.image}
              alt="Uploaded Image"
              width={250}
              height={250}
              unoptimized
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}