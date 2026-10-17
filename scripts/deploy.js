const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const fs = require("fs");
const path = require("path");

const config = {
  s3BucketName: "louay-morsi.me",
  folderPath: "../dist" // path relative to this script's location
};

const s3 = new S3Client({});
const distFolderPath = path.join(__dirname, config.folderPath);

// Recursively list every file under a folder.
function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

async function main() {
  if (!fs.existsSync(distFolderPath) || listFiles(distFolderPath).length === 0) {
    console.error(`'${distFolderPath}' is empty or does not exist. Run 'ng build' first.`);
    process.exit(1);
  }

  let failed = 0;
  for (const filePath of listFiles(distFolderPath)) {
    const key = path.relative(distFolderPath, filePath).split(path.sep).join("/");
    const contentType = mime.lookup(key) || "application/octet-stream";
    try {
      await s3.send(new PutObjectCommand({
        Bucket: config.s3BucketName,
        Key: key,
        Body: fs.readFileSync(filePath),
        ContentType: contentType
      }));
      console.log(`Uploaded '${key}' (${contentType})`);
    } catch (err) {
      failed++;
      console.error(`FAILED '${key}': ${err.message}`);
    }
  }

  if (failed > 0) {
    console.error(`${failed} file(s) failed to upload.`);
    process.exit(1);
  }
}

main();
