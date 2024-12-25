import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchImagesFromFolder, getFolderIdByName, listFolders } from '../../services/googleDriveService';
import ImageUpload from '../ImageUpload/ImageUpload';
import { createChapterFolder } from "../../services/googleDriveService";
import './Chapter.css';

export default function Chapter({ handleImageChange, images }) {
    const [images_, setImages] = useState([]);
    const [parent, setparent] = useState('');
    const selectedFolder = useSelector((state) => state.folder.selectedFolder);
    const [chapter, setchapter] = useState([]);
    const [chapterCount, setChapterCount] = useState(0);

    const handleAddChapter = async () => {
        const parent_id = await getFolderIdByName(selectedFolder);
        const folderList = await listFolders(parent_id);

        const newChapterName = `Chapter ${folderList.length + 1}`;
        try {
            await createChapterFolder(newChapterName, parent); // Create folder in Google Drive
            setChapterCount(chapterCount + 1); // Increment chapter count locally

        } catch (error) {
            console.error("Error creating chapter folder:", error);
        }
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const fetchedImages = await fetchImagesFromFolder(selectedFolder);
                const parent_id = await getFolderIdByName(selectedFolder);
                const folderList = await listFolders(parent_id);
                // Replace with specific parent folder ID if needed
                setchapter(folderList);
                setImages(fetchedImages); // Store images in state
                setparent(parent_id);


            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (selectedFolder) {
            fetchImages(); // Trigger fetch when the folder is selected
        }
    }, [selectedFolder, chapterCount]);

    return (
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '100%' }}>
            <div className="chapter-container">
                <h1 className="chapter-container__heading">Chapter Upload</h1>
                <p className="chapter-container__folder-info">Selected Folder: {selectedFolder}</p>

                <div className="chapter-container__gallery">
                    {images_.length > 0 ? (
                        images_.map((image) => (
                            <div key={image.id} className="chapter-container__image-item">
                                <img
                                    src={`https://weebmania-admin.vercel.app/api/getImageFromId/${image.id}`} // Using the /image/:fileId route
                                    alt={image.name}
                                    className="chapter-container__image"
                                />
                                <p className="chapter-container__image-name">{image.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="chapter-container__no-images-message">No images found in this folder.</p>
                    )}
                </div>
            </div>

            {chapter.map((folder) => (<div className="chapter-container" key={folder.id}>
                <h1 className="chapter-container__heading">{folder.name}</h1>
                <div className="chapter-container__gallery">
                    <ImageUpload handleImageChange={handleImageChange} images={images} labels={[
                        { title: 'Cover', key: 'Cover' },
                        { title: 'Back', key: 'Back' },
                    ]} />
                </div>

            </div>))}
            <button
                className="chapter-container__add-button"
                onClick={handleAddChapter}
            >
                +
            </button>
        </div>
    );
}
