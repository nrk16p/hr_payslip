import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadCard({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div className="border-2 border-dashed border-brass-400/25 rounded-lg p-6 text-center bg-ink-900/40">
      <p className="mb-3 text-slate-400 flex items-center justify-center gap-1.5 text-sm">
        <UploadCloud size={16} strokeWidth={1.75} className="text-brass-400" />
        Drag & drop Excel file here or click below
      </p>
      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        id="file-upload"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <label
        htmlFor="file-upload"
        className="inline-block cursor-pointer text-sm font-semibold text-[#14100a] bg-gradient-to-b from-brass-300 to-brass-600 hover:brightness-110 px-4 py-2 rounded-md transition-all"
      >
        Choose File
      </label>
      {file && (
        <div className="mt-4">
          <p className="text-parchment text-sm">{file.name}</p>
          <button
            onClick={() => onUpload(file)}
            className="mt-2 text-sm font-medium text-emerald-brass border border-emerald-brass/30 hover:bg-emerald-brass/10 px-4 py-2 rounded-md transition-colors"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
