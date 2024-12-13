import React, { useState, useRef ,useEffect} from 'react';
import './Mediapicker.css';
import { useTheme } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';


type MediaType = {
    file: File;
    url: string;
    type: 'image' | 'video';
};

const PostScreen: React.FC = () => {
    const [selectedMedia, setSelectedMedia] = useState<MediaType[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
    const handleDrag = (e: React.TouchEvent, itemIndex: number, imageCount: number) => {
        const threshold = 80; // Swipe threshold
        let startX: number;

        const handleTouchStart = (event: TouchEvent) => {
            startX = event.touches[0].clientX;
        };

        const handleTouchEnd = (event: TouchEvent) => {
            const endX = event.changedTouches[0].clientX;
            const diff = endX - startX;

            if (Math.abs(diff) > threshold) {
                setCurrentImageIndex((prev) => {
                    const newIndex = { ...prev };
                    const currentIndex = newIndex[itemIndex] || 0;

                    if (diff > 0 && currentIndex > 0) {
                        newIndex[itemIndex] = currentIndex - 1; // Swipe right
                    } else if (diff < 0 && currentIndex < imageCount - 1) {
                        newIndex[itemIndex] = currentIndex + 1; // Swipe left
                    }

                    return newIndex;
                });
            }
        };

        e.target.addEventListener("touchstart", handleTouchStart);
        e.target.addEventListener("touchend", handleTouchEnd);

        return () => {
            e.target.removeEventListener("touchstart", handleTouchStart);
            e.target.removeEventListener("touchend", handleTouchEnd);
        };
    };
    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (!event.target.files) return;

        const files = Array.from(event.target.files);
        const mediaArray = files.map((file) => {
            // Type assertion to ensure `file` is a File and we can safely access the `type` property
            const mediaType: 'image' | 'video' = (file as File).type.startsWith('image') ? 'image' : 'video';
            return {
                file,
                url: URL.createObjectURL(file as Blob), // Assert file as Blob
                type: mediaType,
            };
        });

        // Allow only one video and multiple images
        const imageFiles = mediaArray.filter((item) => item.type === 'image');
        const videoFiles = mediaArray.filter((item) => item.type === 'video');

        setSelectedMedia([...imageFiles, ...videoFiles.slice(0, 1)]);
        setCurrentImageIndex({ 0: 0 });
    };


    // Open file picker for gallery
    const openGallery = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleNextClick = () => {
        navigate('/PreviewScreen', { state: { selectedMedia } });
    };

    useEffect(() => {
        console.log('CreatePost mounted');
      }, []);
    return (
        <div className="post-container">

            {/* Preview section */}
            <div className={`preview-section ${isDarkMode ? 'createpost-dark' : ''}`}>
                {selectedMedia.length > 0 ? (
                    <>
                        <div className='createpost-back'>
                            <img src={require("../../assets/back.png")} width={20} height={20} onClick={()=>navigate("/Feed")} />
                        </div>
                        <div className="media-index">
                            <p>
                                {`${currentImageIndex[0] + 1} / ${selectedMedia.length}`}
                            </p>
                        </div>
                        <div
                            className="media-preview"
                            onTouchStart={(e) => handleDrag(e, 0, selectedMedia.length)}
                            onTouchEnd={(e) => handleDrag(e, 0, selectedMedia.length)}
                        >
                            {selectedMedia[currentImageIndex[0]]?.type === 'image' ? (
                                <img
                                    src={selectedMedia[currentImageIndex[0]].url}
                                    alt={`Preview ${currentImageIndex[0] + 1}`}
                                    className="preview-image"
                                />
                            ) : (
                                <video
                                    src={selectedMedia[currentImageIndex[0]]?.url}
                                    controls
                                    className="preview-video"
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <p className="placeholder">Select media to preview</p>
                )}
            </div>
            <div className="media-selection">
                <span>Gallery</span>
                <img src={require('../../assets/gallery.png')} width={40} height={40} onClick={openGallery} />
            </div>

            <input
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
            />
            {selectedMedia.length > 0 ? (
                <div className='media-button-wrapper'>
                    <button className='media-nextbutton' onClick={handleNextClick}>Next</button>
                </div>
            ) : null}


        </div>
    );
};

export default PostScreen;
