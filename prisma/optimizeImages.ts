import { SECRET } from '@/config';
import { UploadClient } from '@uploadcare/upload-client';

const UPLOADCARE_API_KEY = SECRET.UPLOADCARE_SECRET;
const client = new UploadClient({ publicKey: UPLOADCARE_API_KEY });

const optimizeImages = async (path: string) => {
  try {
    const content = await Bun.file(path).text();
    const JSONString = content
      .replace(/export\s+const\s+\w+\s*=\s*/, '')
      .trim();

    // TODO: this will work but it's susceptible to code injection
    const dataMenuItems = Function(`return ${JSONString}`)();

    for (let item of dataMenuItems) {
      for (let image of item.images) {
        try {
          const response = await client.uploadFile(image.url);
          image.url = response.cdnUrl;

          console.log(`Updated URL for ${item.slug}: ${response.cdnUrl}`);
        } catch (error) {
          console.error(`Failed to upload image: ${image.url}`, error);
        }
      }
    }

    const updatedContent = `export const dataMenuItems = ${JSON.stringify(
      dataMenuItems,
      null,
      2
    )};`;

    await Bun.write(path, updatedContent);
    console.log('menuItems.ts has been updated successfully.');
  } catch (error) {
    console.error('Error updating menuItems.ts:', error);
  }
};

optimizeImages('prisma/data/menuItems.ts');
