import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error uploading file:", error);
      setResult("Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">AI vs Human-Generated Image Detector</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {preview && <img src={preview} alt="Preview" className="w-64 h-64 object-cover mb-4" />}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
      {result && (
        <p className="mt-4 text-lg font-semibold">
          Result: {result === "AI" ? "🖥 AI-Generated" : "👤 Human-Generated"}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
