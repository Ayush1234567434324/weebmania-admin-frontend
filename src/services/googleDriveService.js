import { gapi } from "gapi-script";

// Function to get the 'Manga' folder ID
export const getMangaFolderId = () => {
  return '1gjq1E_hi08sV1bBNYdKMmmF0DDaaT14B';
};





export const createFolder = (folderName) => {
    return gapi.client.drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
    });
  };


  
  export const createSubFolder = (parentFolderId, subFolderName) => {
    return gapi.client.drive.files.create({
      resource: {
        name: subFolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      },
    });
  };

  export const fetchExistingFolders = async (query) => {
    try {
      // Get the Manga folder ID
      const mangaFolderId = getMangaFolderId();
  
      // Ensure that the mangaFolderId exists before proceeding
      if (!mangaFolderId) {
        console.error('Manga folder not found');
        return [];
      }
  
      // Query Google Drive to search for folders inside the Manga folder
      const response = await gapi.client.drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name contains '${query}' and '${mangaFolderId}' in parents`,
        fields: 'files(id, name)', // Fetch id and name of the folders
      });
  
      // Return an array of folder names
      return response.result.files.map(file => file.name);
    } catch (error) {
      console.error('Error fetching folders inside Manga:', error);
      return [];
    }
  };
  
  
  export const handleUploadToDrive = (imageFile, parentFolderId, imageType) => {
    const fileContent = imageFile;
    let fileName = '';
  
    switch (imageType) {
      case 'cover':
        fileName = 'cover.jpg';
        break;
      case 'end':
        fileName = 'end.jpg';
        break;
      case 'intro':
        fileName = 'intro.jpg';
        break;
      case 'common':
        fileName = 'common.jpg';
        break;
      default:
        fileName = imageFile.name;
    }
  
    const metadata = {
      name: fileName,
      mimeType: 'image/jpeg',
      parents: [parentFolderId],
    };
  
    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', fileContent);
  
    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
      body: formData,
    });
  };
  
  export const checkFolderExists = (folderName) => {
    return new Promise((resolve, reject) => {
      const query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`;
  
      gapi.client.drive.files.list({
        q: query,
        fields: 'files(id, name)',
      }).then((response) => {
        // If folder exists, response.files will contain folder details
        const folderExists = response.result.files.length > 0;
        if (folderExists) {
          resolve(response.result.files[0].id); // Return the folder ID if it exists
        } else {
          resolve(null); // Return null if folder does not exist
        }
      }).catch((error) => {
        reject(error);
      });
    });
  };


  export const fetchImagesFromFolder = async (folderName) => {
    const folderId = await getFolderIdByName(folderName);
  
    if (!folderId) {
      throw new Error('Folder not found');
    }
  
    const files = await listFilesInFolder(folderId);
    return files;
  };
  
  const getFolderIdByName = async (folderName) => {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });
  
      const folder = response.result.files[0];
      if (folder) {
        return folder.id;
      } else {
        throw new Error('Folder not found');
      }
    } catch (error) {
      console.error('Error fetching folder ID:', error);
      return null;
    }
  };
  
  const listFilesInFolder = async (folderId) => {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType)',
      });
  
      return response.result.files.filter(file =>
        file.mimeType.startsWith('image/') // Filter only images
      );
    } catch (error) {
      console.error('Error listing files in folder:', error);
      return [];
    }
  };