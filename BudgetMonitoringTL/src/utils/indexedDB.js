import { openDB } from "idb";

const DB_NAME = "LiquidationDB";
const STORE_NAME = "drafts";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function base64ToBlob(base64) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

/* SAVE DRAFT W/ RECEIPTS */
export async function saveDraft(id, data) {
  const db = await initDB();

  const receiptsWithBase64 = await Promise.all(
    (data.receipts || []).map(async (r) => {
      if (r.file instanceof File) {
        const base64 = await fileToBase64(r.file);
        return { ...r, base64, fileName: r.file.name, fileType: r.file.type };
      }
      return r;
    })
  );

  const updatedData = { ...data, receipts: receiptsWithBase64 };

  await db.put(STORE_NAME, { id, ...updatedData });
}

/* LOAD DRAFT */
export async function getDraft(id) {
  const db = await initDB();
  const data = await db.get(STORE_NAME, id);

  if (!data) return null;

  const restoredReceipts = (data.receipts || []).map((r) => {
    if (r.base64 && r.fileName) {
      const blob = base64ToBlob(r.base64);
      const file = new File([blob], r.fileName, {
        type: r.fileType || blob.type,
      });
      return { ...r, file };
    }
    return r;
  });

  return { ...data, receipts: restoredReceipts };
}

/* 🧹 Delete a specific draft */
export async function deleteDraft(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

/* 📜 Get all drafts */
export async function getAllDrafts() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}
