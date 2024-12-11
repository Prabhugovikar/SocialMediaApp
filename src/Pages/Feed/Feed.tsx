import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../../components/Navbar/navbar'
import './feed.css'
import AnimatedModal from '../../components/AnimatedModal/AnimatedModal';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const [loader, setloader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [backgroundColors, setBackgroundColors] = useState([]);
  const navigate = useNavigate();
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const feedData = [
    {
      Profile: require("../../assets/flowergirl.png"),
      username: "Sakshi Agarwal",
      caption: "Just arrived in New York City! Excited to explore the sights, sounds, and energy of this amazing place.",
      likes: 123,
      timestamp: "2 hours ago",
      img: [
        require("../../assets/orangegirl.png"),
        require("../../assets/girl.png"),
      ],
      hastag: '#NYC #Travel'
    },
    {
      Profile: require("../../assets/flowergirl.png"),
      username: "Nidhi Agarwal",
      caption: "Just arrived in New York City! Excited to explore the sights, sounds, and energy of this amazing place.",
      likes: 123,
      timestamp: "2 day ago",
      img: [
        require("../../assets/flowergirl.png"),
      ],
      hastag: '#NYC #Travel'
    },
    {
      Profile: require("../../assets/flowergirl.png"),
      username: "Arav",
      caption: "Taking a moment to slow down, breathe, and focus on myself. 🌿✨ Self-care isn’t selfish – it’s necessary.",
      likes: 123,
      timestamp: "1 day ago",
      video: require('../../assets/video.mp4'),
      hastag: '💕 #SelfCare #MeTime #Wellness'
    }
  ]

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

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play(); // Start playing when visible
        } else {
          video.pause(); // Pause when not visible
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Trigger when 50% of the video is in view
    });

    // Observe all video elements
    Object.values(videoRefs.current).forEach((video) => {
      if (video instanceof HTMLVideoElement) observer.observe(video);
    });

    return () => {
      observer.disconnect(); // Clean up observer
    };
  }, []);


  const getDominantColor = (imageSrc, index) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Avoid CORS issues
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      // Calculate average color
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];     // Red
        g += imageData[i + 1]; // Green
        b += imageData[i + 2]; // Blue
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.1)`; // Low-opacity color
      setBackgroundColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = rgbaColor;
        return newColors;
      });
    };
  };


  useEffect(() => {
    if (feedData) {
      feedData.forEach((item, index) => {
        if (item.img && item.img.length > 0) {
          getDominantColor(item.img[0], index); // Use the first image of the post
        } else {
          setBackgroundColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index] = '#FFFAEE'; // Default color for posts without images
            return newColors;
          });
        }
      });
    }
  }, [feedData]);

  return (
    <div className='feed'>
      <Navbar />
      <div className="feed-text">
        <span>Feeds</span>
      </div>
      <div className="feed-container">
        {feedData?.length === 0 ? (
          <div className="no-feed">No feeds available</div>
        ) : (
          <>
            {feedData?.map((item, index) => (
              <div className='feed-post-conatiner' style={{ backgroundColor: backgroundColors[index] || '#FFFAEE' }}
              key={index}
              >
                <div className='feed-posts-header'>
                  <div className='feed-post-profile'>
                    <img src={item.Profile} className='feed-profile-img' />
                  </div>
                  <div className='feed-post-name'>
                    <span>{item?.username}</span>
                    <span>{item?.timestamp}</span>
                  </div>
                </div>
                <div className='feed-post-caption'>
                  <span>{item?.caption}</span>
                  <span>{item?.hastag}</span>
                </div>

                <div className='feed-post-media'>
                  {item.img && item.img.length > 0 ? (
                    <div
                      className="image-container"
                      onTouchStart={(e) => handleDrag(e, index, item.img.length)}
                    >
                      <img
                        src={item.img[currentImageIndex[index] || 0]}
                        className="feed-post-img"
                        alt="Post"
                      />
                      {item.img.length > 1 && ( // Show index only if there are more than 1 image
                        <div className="image-index">
                          {((currentImageIndex[index] || 0) + 1)} / {item.img.length}
                        </div>
                      )}
                    </div>
                  ) : item.video ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="feed-post-video"
                      src={item.video}
                      muted
                      playsInline
                      loop
                    />
                  ) : null}
                </div>

                <div className='feed-post-footer'>
                  <div className='feed-post-likes'>
                    <img src={require("../../assets/like.png")} width={16} height={16}/>
                    <span>{item?.likes}</span>
                  </div>
                  <div className='feed-post-share' onClick={openModal}>
                    <img src={require("../../assets/share.png")} width={16} height={16}/>
                    <span>Share</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className='create-post'>
          <img src={require("../../assets/createPost.png")} onClick={()=>navigate('/CreatePost')}/>
        </div>
      <AnimatedModal isVisible={isModalVisible} onClose={closeModal}>
        <div className='modal-share'>
          <div className='modal-headr'>
            <span>Share Post</span>
            <img src={require("../../assets/close.png")} onClick={closeModal} width={16} height={16}/>
          </div>
          <div className='modal-body'>
            <div className='modal-upper-body'>
              <div className='modal-media-container'>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/twitter.png")} width={24} height={24}/>
                </div>
                <span>Twitter</span>
              </div>

              <div className='modal-media-container'>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/facebook.png")} width={24} height={24}/>
                </div>
                <span>Facebook</span>
              </div>

              <div className='modal-media-container'>
                <div className='modal-icon-container reddit'>
                  <img src={require("../../assets/reddit.png")} width={24} height={24}/>
                </div>
                <span>Reddit</span>
              </div>

              <div className='modal-media-container'>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/discord.png")} width={24} height={24}/>
                </div>
                <span>Discord</span>
              </div>
            </div>
            <div className='modal-upper-body'>

            <div className='modal-media-container'>
                <div className='modal-icon-container whatsapp'>
                  <img src={require("../../assets/whatsapp.png")} width={24} height={24}/>
                </div>
                <span>WhatsApp</span>
              </div>

              <div className='modal-media-container'>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/messenger.png")} width={24} height={24}/>
                </div>
                <span>Messenger</span>
              </div>

              <div className='modal-media-container'>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/telegram.png")} width={24} height={24}/>
                </div>
                <span>Telegram</span>
              </div>

              <div className='modal-media-container'>
                <div className='modal-icon-container instgram'>
                  <img src={require("../../assets/instagram.png")} width={24} height={24}/>
                </div>
                <span>Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedModal>
    </div>
  )
}


