import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchImagesFromFolder } from '../../services/googleDriveService';
import ImageUpload from '../ImageUpload/ImageUpload';
import './Chapter.css';

export default function Chapter({handleImageChange,images}) {
    const [images_, setImages] = useState([]);
    const selectedFolder = useSelector((state) => state.folder.selectedFolder);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const fetchedImages = await fetchImagesFromFolder(selectedFolder);
                setImages(fetchedImages); // Store images in state
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (selectedFolder) {
            fetchImages(); // Trigger fetch when the folder is selected
        }
    }, [selectedFolder]);

    return (
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

<ImageUpload handleImageChange={handleImageChange} images={images} labels={[
        { title: 'Cover', key: 'Cover' },
        { title: 'Back', key: 'Back' },
      ]} />
            </div>
        </div>
    );
}
