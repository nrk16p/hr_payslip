import { Dialog } from "@headlessui/react";

export default function ModalForm({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <Dialog
        open={open}
        onClose={onClose}
        className="bg-ink-800 border border-brass-400/20 rounded-lg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] p-6 w-full max-w-md text-parchment"
      >
        <Dialog.Title className="font-display text-xl font-semibold mb-4">
          {title}
        </Dialog.Title>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-slate-300 border border-white/10 hover:border-brass-400/30 hover:text-brass-300 transition-colors"
        >
          Close
        </button>
      </Dialog>
    </div>
  );
}
