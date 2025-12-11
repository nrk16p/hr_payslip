import { useState } from "react";

export default function UploadCard({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
      <p className="mb-3 text-gray-600">📤 Drag & drop Excel file here or click below</p>
      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        id="file-upload"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Choose File
      </label>
      {file && (
        <div className="mt-4">
          <p className="text-gray-800">{file.name}</p>
          <button
            onClick={() => onUpload(file)}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
