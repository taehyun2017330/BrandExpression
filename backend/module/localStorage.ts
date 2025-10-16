import fs from "fs";
import path from "path";
import moment from "moment";
import dotenv from "dotenv";
dotenv.config();

// Use Railway volume mount path for persistent storage, or local uploads folder
const STORAGE_PATH = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'uploads')
  : path.join(__dirname, '../../uploads');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
  console.log(`Created storage directory: ${STORAGE_PATH}`);
}

// Get the base URL for serving files
const getBaseUrl = () => {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  return process.env.BASE_URL || 'http://localhost:9988';
};

/**
 * Generate a unique file path for upload
 */
export const generateFilePath = ({
  fileName,
  directory,
  removeTime = false,
}: {
  fileName: string;
  directory: string;
  removeTime?: boolean;
}): { filePath: string; publicUrl: string; relativePath: string } => {
  const fileNameNFC = fileName.replace(/\s|\+/g, "_").normalize("NFC");
  const currentTime = moment().locale("en").format("YYYYMMDD_hhmmss_a");

  let relativePath = removeTime
    ? `${directory}/${fileNameNFC}`
    : `${directory}/${currentTime}_${fileNameNFC}`;

  const fullPath = path.join(STORAGE_PATH, relativePath);
  const publicUrl = `${getBaseUrl()}/uploads/${relativePath}`;

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return {
    filePath: fullPath,
    publicUrl,
    relativePath,
  };
};

/**
 * Save file buffer to local storage
 */
export const saveFile = async (
  buffer: Buffer,
  fileName: string,
  directory: string,
  removeTime = false
): Promise<string> => {
  const { filePath, publicUrl } = generateFilePath({ fileName, directory, removeTime });

  await fs.promises.writeFile(filePath, buffer);
  console.log(`File saved: ${publicUrl}`);

  return publicUrl;
};

/**
 * Delete file from local storage
 */
export const deleteFile = async (urlOrPath: string): Promise<boolean> => {
  try {
    let filePath: string;

    // If it's a URL, extract the relative path
    if (urlOrPath.startsWith('http')) {
      const url = new URL(urlOrPath);
      const relativePath = url.pathname.replace('/uploads/', '');
      filePath = path.join(STORAGE_PATH, relativePath);
    } else {
      // It's already a path
      filePath = urlOrPath.startsWith(STORAGE_PATH)
        ? urlOrPath
        : path.join(STORAGE_PATH, urlOrPath);
    }

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
      return true;
    }

    console.warn(`File not found for deletion: ${filePath}`);
    return false;
  } catch (err) {
    console.error('Error deleting file:', err);
    return false;
  }
};

/**
 * Get file buffer from local storage
 */
export const getFile = async (urlOrPath: string): Promise<Buffer | null> => {
  try {
    let filePath: string;

    if (urlOrPath.startsWith('http')) {
      const url = new URL(urlOrPath);
      const relativePath = url.pathname.replace('/uploads/', '');
      filePath = path.join(STORAGE_PATH, relativePath);
    } else {
      filePath = urlOrPath.startsWith(STORAGE_PATH)
        ? urlOrPath
        : path.join(STORAGE_PATH, urlOrPath);
    }

    if (fs.existsSync(filePath)) {
      return await fs.promises.readFile(filePath);
    }

    return null;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
};

export const STORAGE_BASE_PATH = STORAGE_PATH;
