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
    <div className="flex flex-col items-center p-8 bg-white shadow-2xl rounded-2xl max-w-2xl w-full mx-auto mt-10">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI vs Human Image Detector</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-100 h-100 object-cover rounded-xl shadow-md mb-4"
        />
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
      {result && (
        <p className="mt-6 text-xl font-semibold text-gray-700">
          Result: {result === "Ai" ? "🖥 AI-Generated" : "👤 Human-Generated"}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
