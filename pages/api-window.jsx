import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import { getApiWindows, updateApiWindow } from "@/lib/api";

export default function ApiWindowPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await getApiWindows();
    setRows(res.data || []);
    setLoading(false);
  }

  function updateRow(id, field, value) {
    setRows((prev) =>
      prev.map((r) => (r.sheet_id === id ? { ...r, [field]: value } : r))
    );
  }

  async function save(row) {
    if (!row.api_active_from_bkk || !row.api_active_to_bkk) {
      alert("Please set From / To");
      return;
    }

    const payload = {
      sheet_id: row.sheet_id,
      api_is_active: Boolean(row.api_is_active),
      api_active_from: normalizeToISO(row.api_active_from_bkk),
      api_active_to: normalizeToISO(row.api_active_to_bkk),
    };

    console.log("PATCH payload", payload);

    setSaving((s) => ({ ...s, [row.sheet_id]: true }));

    try {
      await updateApiWindow(payload);
      await load(); // refresh is_active_now
    } catch (err) {
      console.error("PATCH failed", err);
      alert("Save failed (see console)");
    } finally {
      setSaving((s) => ({ ...s, [row.sheet_id]: false }));
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">API Window Management</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.sheet_id}>
              <TableCell>
                <div className="font-medium">{r.month_year}</div>
                <div className="text-xs text-muted-foreground">
                  Sheet #{r.sheet_id}
                </div>
              </TableCell>

              <TableCell>
                {r.is_active_now ? (
                  <Badge>Active now</Badge>
                ) : r.api_is_active ? (
                  <Badge variant="secondary">Scheduled</Badge>
                ) : (
                  <Badge variant="destructive">Disabled</Badge>
                )}
              </TableCell>

              <TableCell>
                <Input
                  type="datetime-local"
                  value={toInput(r.api_active_from_bkk)}
                  onChange={(e) =>
                    updateRow(
                      r.sheet_id,
                      "api_active_from_bkk",
                      fromInput(e.target.value)
                    )
                  }
                />
              </TableCell>

              <TableCell>
                <Input
                  type="datetime-local"
                  value={toInput(r.api_active_to_bkk)}
                  onChange={(e) =>
                    updateRow(
                      r.sheet_id,
                      "api_active_to_bkk",
                      fromInput(e.target.value)
                    )
                  }
                />
              </TableCell>

              <TableCell>
                <Switch
                  checked={Boolean(r.api_is_active)}
                  onCheckedChange={(v) =>
                    updateRow(r.sheet_id, "api_is_active", v)
                  }
                />
              </TableCell>

              <TableCell className="text-right">
                <Button
                  onClick={() => save(r)}
                  disabled={saving[r.sheet_id]}
                >
                  {saving[r.sheet_id] ? "Saving..." : "Save"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ===============================
   helpers (FE FIX)
================================ */

// แสดงใน <input type="datetime-local">
function toInput(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

// รับค่าจาก input → ISO string
function fromInput(v) {
  return new Date(v).toISOString();
}

// ⭐ ตัวสำคัญ: normalize ทุก format → ISO (ไม่มี tz, ไม่มี ms)
function normalizeToISO(value) {
  const d = new Date(value); // รับได้ทั้ง ISO + RFC1123
  if (isNaN(d.getTime())) {
    throw new Error("Invalid datetime: " + value);
  }

  // YYYY-MM-DDTHH:mm:ss
  return d.toISOString().replace("Z", "").split(".")[0];
}
