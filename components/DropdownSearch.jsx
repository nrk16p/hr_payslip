import { useState, useMemo } from "react";

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

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full border rounded-md px-3 py-2 text-sm cursor-pointer bg-white ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      >
        {selected ? selected.label : placeholder}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-slate-500">
                ไม่พบข้อมูล
              </div>
            )}

            {filtered.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
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
