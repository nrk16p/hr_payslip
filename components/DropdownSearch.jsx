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
        className={`w-full flex justify-between items-center border rounded-lg px-3 py-2 text-sm cursor-pointer bg-ink-900/60 text-parchment transition-all
        ${error ? "border-oxblood/50" : "border-white/10"}
        hover:border-brass-400/40 focus-within:ring-2 focus-within:ring-brass-400/15`}
      >
        <span className={`${!selected && "text-slate-500"}`}>
          {selected ? selected.label : placeholder}
        </span>

        <div className="flex items-center gap-2">
          {selected && (
            <X
              size={14}
              className="text-slate-500 hover:text-oxblood-light cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          )}
          <ChevronDown size={16} className="text-slate-500" />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-ink-800 border border-brass-400/20 rounded-xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95">
          {/* Search */}
          <div className="p-2 border-b border-white/5">
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              className="w-full border border-white/10 rounded-md px-2 py-1 text-sm bg-ink-900/60 text-parchment placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brass-400/15"
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
                className={`px-3 py-2 text-sm cursor-pointer transition-colors text-slate-300
                ${
                  value === opt.value
                    ? "bg-brass-400/10 text-brass-300"
                    : ""
                }
                ${
                  highlightIndex === index
                    ? "bg-white/5"
                    : "hover:bg-white/5"
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
