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
    <div className="flex flex-col items-center p-8 bg-gray-100 shadow-2xl rounded-2xl max-w-2xl w-full mx-auto mt-10">

<h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-lg">
        AI vs Human Image Detector
      </h1>
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0  file:font-semibold file:bg-blue-50 file:text-indigo-700 hover:file:bg-blue-100"
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
    </div>
  );
};

export default ImageUpload;
