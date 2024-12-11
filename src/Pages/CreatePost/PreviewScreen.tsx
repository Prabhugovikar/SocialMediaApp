import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PreviewScreen.css';
import { useTheme } from '../../ThemeContext';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { sendMediaData } from '../../redux/Slice/postSlice';

const MediaPreviewScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, mediaData } = useSelector((state: RootState) => state.media);
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();
    const selectedMedia = state?.selectedMedia || [];
    console.log("selectedMedia", selectedMedia);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [description, setDescription] = useState<string>('');


    const handleSwipe = (e: React.TouchEvent) => {
        const threshold = 80; // Swipe threshold
        let startX: number;

        const handleTouchStart = (event: TouchEvent) => {
            startX = event.touches[0].clientX;
        };

        const handleTouchEnd = (event: TouchEvent) => {
            const endX = event.changedTouches[0].clientX;
            const diff = endX - startX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentImageIndex > 0) {
                    setCurrentImageIndex(currentImageIndex - 1); // Swipe right
                } else if (diff < 0 && currentImageIndex < selectedMedia.length - 1) {
                    setCurrentImageIndex(currentImageIndex + 1); // Swipe left
                }
            }
        };

        e.target.addEventListener("touchstart", handleTouchStart);
        e.target.addEventListener("touchend", handleTouchEnd);

        return () => {
            e.target.removeEventListener("touchstart", handleTouchStart);
            e.target.removeEventListener("touchend", handleTouchEnd);
        };
    };

    const handleSubmit = async () => {
        const UserId = localStorage.getItem("userId");
        const mediaData = {
            images: selectedMedia.filter((media: any) => media.type === 'image').map((image: any) => image.file),
            video: selectedMedia.find((media: any) => media.type === 'video')?.file || null,
            text: description,
            userId: UserId
        };

        try {
            await dispatch(sendMediaData(mediaData)).unwrap();
            // Navigate after successful API call
            navigate('/profile');
        } catch (error) {
            console.error('Error sending media:', error);
        }
    };

    return (
        <div className="preview-screen">
            <div>
                <div className='preview-screen-head'>
                    {isDarkMode ? (
                        <img src={require("../../assets/back.png")} width={20} height={20} />
                    ) : (
                        <img src={require("../../assets/blackArrow.png")} width={25} height={25} />
                    )}
                    <span>New post</span>
                </div>
                <div className='preview-screen-post'>
                    <div className="media-preview-2">
                        {selectedMedia.length > 0 && (
                            <div
                                className="media-preview-container"
                                onTouchStart={handleSwipe}
                                onTouchEnd={handleSwipe}
                            >
                                <div className="media-index-2">
                                    <p>
                                        {`${currentImageIndex + 1} / ${selectedMedia.length}`}
                                    </p>
                                </div>
                                {selectedMedia[currentImageIndex]?.type === 'image' ? (
                                    <img
                                        src={selectedMedia[currentImageIndex]?.url}
                                        alt={`Preview ${currentImageIndex + 1}`}
                                        className="preview-image-2"
                                    />
                                ) : selectedMedia[currentImageIndex]?.type === 'video' ? (
                                    <video
                                        src={selectedMedia[currentImageIndex]?.url}
                                        controls
                                        className="preview-video-2"
                                    />
                                ) : (
                                    <p>No valid media found</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="preview-screen-description">
                    <textarea placeholder='description'
                        className={`textarea-description ${isDarkMode ? 'textaerea-description-dark' : ''}`}
                        type="text"
                        value={description} // Bind the state to the textarea value
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className="create-button-wrapper">
                {loading ? (
                    <div class="loader"></div>
                ) : (
                    <button
                        className={`create-button ${isDarkMode ? 'create-button-dark' : ''}`}
                        onClick={handleSubmit}
                    >
                        Create
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaPreviewScreen;
