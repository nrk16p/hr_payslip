import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export default function DropdownSearch({
  value,
  onChange,
  options = [],
  placeholder = "-- เลือก --",
  searchPlaceholder = "ค้นหา...",
  error = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [value, options]
  );

  const filtered = useMemo(() => {
    if (!search) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  // close when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // keyboard support
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1
      );
    }

    if (e.key === "Enter" && highlightIndex >= 0) {
      onChange(filtered[highlightIndex].value);
      setOpen(false);
      setSearch("");
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex justify-between items-center border rounded-lg px-3 py-2 text-sm cursor-pointer bg-white transition-all
        ${error ? "border-red-400" : "border-slate-300"}
        hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200`}
      >
        <span className={`${!selected && "text-slate-400"}`}>
          {selected ? selected.label : placeholder}
        </span>

        <div className="flex items-center gap-2">
          {selected && (
            <X
              size={14}
              className="text-slate-400 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          )}
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg animate-in fade-in zoom-in-95">
          {/* Search */}
          <div className="p-2 border-b">
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightIndex(-1);
              }}
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-slate-500 text-center">
                ไม่พบข้อมูล
              </div>
            )}

            {filtered.map((opt, index) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors
                ${
                  value === opt.value
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }
                ${
                  highlightIndex === index
                    ? "bg-slate-100"
                    : "hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
