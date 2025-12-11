import { Dialog } from "@headlessui/react";

export default function ModalForm({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <Dialog open={open} onClose={onClose} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-semibold mb-4">{title}</Dialog.Title>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Close
        </button>
      </Dialog>
    </div>
  );
}
