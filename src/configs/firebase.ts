import admin from "firebase-admin";

const serviceAccountBase64 = process.env.FIREBASE_ADMIN_BASE64;
if (!serviceAccountBase64) {
  throw new Error("FIREBASE_ADMIN_BASE64 not found in env");
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://my-project-1530122397450.firebasestorage.app", // ganti sesuai project
});

const bucket = admin.storage().bucket();
export { bucket };
