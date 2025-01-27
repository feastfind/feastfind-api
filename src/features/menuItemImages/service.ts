import prisma from '@/lib/db';

export const deleteMenuItemImagesById = async (
  menuItemId: string,
  imageId: string
) => {
  const menuItemImage = await prisma.menuItemImage.findFirst({
    where: {
      id: imageId,
      menuItemId: menuItemId,
    },
  });

  if (!menuItemImage) {
    throw new Error(
      "Menu item not found or you don't have permission to delete it."
    );
  }

  return await prisma.menuItemImage.delete({
    where: {
      id: imageId,
      menuItemId: menuItemId,
    },
  });
};
