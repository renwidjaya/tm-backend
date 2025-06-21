import { v4 as uuidv4 } from "uuid";
import { bucket } from "@configs/firebase";

type UploadType = "profil" | "presensi";

export async function uploadToFirebase(
  localPath: string,
  folder: UploadType,
  filename?: string
): Promise<string> {
  const uniqueName = filename || `${uuidv4()}.jpg`;
  const file = bucket.file(`${folder}/${uniqueName}`);

  await bucket.upload(localPath, {
    destination: file,
    public: true,
    metadata: {
      contentType: "image/jpeg",
    },
  });

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${uniqueName}`;
  return publicUrl;
}

export async function deleteFromFirebase(publicUrl: string) {
  try {
    const bucketName = bucket.name;
    const baseUrl = `https://storage.googleapis.com/${bucketName}/`;

    const filePath = publicUrl.replace(baseUrl, ""); // contoh: "profil/abc.jpg"
    const file = bucket.file(filePath);

    await file.delete();
    console.log(`Deleted from Firebase: ${filePath}`);
  } catch (err: any) {
    console.error("Failed to delete from Firebase:", err.message);
  }
}
