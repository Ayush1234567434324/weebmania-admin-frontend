import { createSubFolder, getMangaFolderId, handleUploadToDrive } from './googleDriveService';
// only for intro and common
export const uploadImagesToDrive = (images, folderName) => {
  if (!folderName) {
    return Promise.reject('Folder name is required');
  }

    const grand = getMangaFolderId();
    return createSubFolder(grand, folderName).then((folderResponse) => {
      const parentFolderId = folderResponse.result.id;
      const imageUploadPromises = ['intro', 'common'].map((imageType) => {
        if (images[imageType]) {
          return handleUploadToDrive(images[imageType].file, parentFolderId, imageType);
        }
        return undefined; 
      }).filter(Boolean);

      return Promise.all(imageUploadPromises);
    });
  
};
