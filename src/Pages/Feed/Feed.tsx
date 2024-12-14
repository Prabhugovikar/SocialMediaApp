import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../../components/Navbar/navbar'
import './feed.css'
import AnimatedModal from '../../components/AnimatedModal/AnimatedModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedData, likePost,} from '../../redux/Slice/feedSlice';
import { AppDispatch, RootState } from '../../redux/store';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../ThemeContext';



export default function FeedComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const { feedData, loading, error } = useSelector((state: RootState) => state.feed);
  const [loader, setloader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});
  const [currentUser, setCurrentUser] = useState<string>('');
  const videoRefs = useRef<Record<number, HTMLVideoElement>>({});
  const [backgroundColors, setBackgroundColors] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const {isDarkMode} = useTheme();
  const navigate = useNavigate();

  const openModal = (item) => {
    setIsModalVisible(true);
    setSelectedItem(item);
  }
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    dispatch(fetchFeedData());
  }, [dispatch]);


  console.log("feedData", feedData);

  const handleDrag = (itemIndex: number, imageCount: number) => {
    let startX: number;
    const threshold = 50; // Sensitivity for swipe detection

    const handleTouchStart = (event: React.TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
      const endX = event.changedTouches[0].clientX;
      const diff = endX - startX;

      if (Math.abs(diff) > threshold) {
        setCurrentImageIndex((prev) => {
          const newIndex = { ...prev };
          const currentIndex = newIndex[itemIndex] || 0; // Default to 0 if undefined

          if (diff > 0 && currentIndex > 0) {
            // Swipe right (previous image)
            newIndex[itemIndex] = currentIndex - 1;
          } else if (diff < 0 && currentIndex < imageCount - 1) {
            // Swipe left (next image)
            newIndex[itemIndex] = currentIndex + 1;
          }

          return newIndex;
        });
      }
    };

    return { handleTouchStart, handleTouchEnd };
  };


  // Initialize drag handlers after `handleDrag` is defined
  const dragHandlers = feedData?.map((_, index) =>
    handleDrag(index, feedData[index]?.images?.length || 0)
  );




  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          console.log(`Playing: ${video.src}`);
          video.play().catch((err) => console.error("Play error:", err));
        } else {
          console.log(`Pausing: ${video.src}`);
          video.pause();
        }
      });
    };
  
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
  
    // Ensure all video elements are observed
    Object.values(videoRefs.current).forEach((video) => {
      if (video instanceof HTMLVideoElement) {
        console.log("Observing video:", video);
        observer.observe(video);
      }
    });
  
    return () => {
      observer.disconnect();
    };
  }, [feedData]);


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

    img.onerror = () => {
      // Handle image load errors or fallback
      setBackgroundColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = '#FFFAEE'; // Default color for posts without valid images
        return newColors;
      });
    };
  };

  // Optional: Function to handle video file (if videoSrc is provided)
  const getDominantColorFromVideo = (videoSrc, index) => {
    const video = document.createElement('video');
    video.crossOrigin = 'Anonymous'; // Avoid CORS issues
    video.src = videoSrc;
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Get the first frame of the video
      video.currentTime = 0.5; // Half a second to load a frame

      video.onseeked = () => {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data and calculate average color
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
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

    video.onerror = () => {
      // Fallback color if video loading fails
      setBackgroundColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = '#FFFAEE'; // Default color for posts without valid video
        return newColors;
      });
    };
  };


  useEffect(() => {
    if (feedData) {
      feedData.forEach((item, index) => {
        if (item?.images && item?.images.length > 0) {
          getDominantColor(item?.images[0], index); // Use the first image of the post
        } else if (item?.video) {
          getDominantColorFromVideo(item?.video, index); // Handle video file if available
        } else {
          setBackgroundColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index] = '#F7EBFF'; // Default color for posts without images or video
            return newColors;
          });
        }
      });
    }
  }, [feedData]);

  const path = () => {
    navigate('/CreatePost')
  }

  function timeAgo(createdAt: string): string {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const differenceInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    const minutes = 60;
    const hours = 60 * minutes;
    const days = 24 * hours;
    const months = 30 * days;
    const years = 12 * months;

    if (differenceInSeconds < minutes) {
      return differenceInSeconds <= 1 ? 'Just now' : `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < hours) {
      const minutesAgo = Math.floor(differenceInSeconds / minutes);
      return minutesAgo <= 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
    } else if (differenceInSeconds < days) {
      const hoursAgo = Math.floor(differenceInSeconds / hours);
      return hoursAgo <= 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
    } else if (differenceInSeconds < months) {
      const daysAgo = Math.floor(differenceInSeconds / days);
      return daysAgo <= 1 ? '1 day ago' : `${daysAgo} days ago`;
    } else if (differenceInSeconds < years) {
      const monthsAgo = Math.floor(differenceInSeconds / months);
      return monthsAgo <= 1 ? '1 month ago' : `${monthsAgo} months ago`;
    } else {
      const yearsAgo = Math.floor(differenceInSeconds / years);
      return yearsAgo <= 1 ? '1 year ago' : `${yearsAgo} years ago`;
    }
  }

  const shareToSocialMedia = (platform: string) => {
    const postId = selectedItem?._id;
    const url = `http://13.233.96.187/${postId}`;  // Get the first image URL
    const text = selectedItem?.text || '';  // Get the caption text for the post
    console.log("url", url);
    console.log("text", text);


    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'messenger':
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`;
        break;
      case 'discord':
        shareUrl = `https://discord.com/channels/@me?url=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        alert('Instagram does not support direct sharing via links. Please manually upload the image to Instagram.');
        return;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }

    closeModal();  // Close the modal after sharing
  };


 

  const handleLike =async (postId: string,) => {
    const UserId = localStorage.getItem('userId');
    
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "user_id": UserId,
        "post_id": postId
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect
      };
      const response = await fetch(`http://13.233.96.187:3000/likepost`,requestOptions);
      const result = await response.json();
      console.log("liked result",result);
      if(!response.ok) {
        throw new Error('Failed to like post');
      }
      dispatch(likePost({ postId, UserId }));
    } catch (error) {
       console.log('error',error);
    }
  };


  return (
    <div className='feed'>
      <Navbar />
      <div className="feed-text">
        <span>Feeds</span>
      </div>
      <div className="feed-container">
        {feedData?.length === 0 ? (
          <div className="no-feed">No feeds available</div>
        ) : loading ? (
          <div className="posts-grid">
            {/* Render 5 skeletons as placeholders */}
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="feed-post-media">
                  <Skeleton />
                </div>
              ))}
          </div>

        ) : (
          <>
            {feedData?.slice()?.reverse()?.map((item, index) => (
              <div className='feed-post-conatiner' style={{ backgroundColor: isDarkMode ? '#708090' : '#F7EBFF' }} key={index}

              >
                <div className='feed-posts-header'>
                  <div className='feed-post-profile'>
                    <img src={item?.userDetails?.profileimage} className='feed-profile-img' />
                  </div>
                  <div className='feed-post-name'>
                    <span>{item?.userDetails?.username}</span>
                    <span>{timeAgo(item?.createdAt)}</span>
                  </div>
                </div>
                <div className='feed-post-caption'>
                  <span>{item?.text}</span>
                  {/* <span>{item?.hastag}</span> */}
                </div>

                <div className="feed-post-media">
                  {item.images && item.images.length > 0 ? (
                    <div
                      className="image-container"
                      onTouchStart={(e) => dragHandlers[index].handleTouchStart(e)}
                      onTouchEnd={(e) => dragHandlers[index].handleTouchEnd(e)}
                    >
                      <img
                        src={`http://13.233.96.187/backendcode/app/src/image/${item.images[currentImageIndex[index] || 0]}`}
                        className="feed-post-img"
                        alt={`Post image ${currentImageIndex[index] + 1}`}
                      />
                      {item.images.length > 1 && (
                        <div className="image-index">
                          {(currentImageIndex[index] || 0) + 1} / {item.images.length}
                        </div>
                      )}
                    </div>

                  ) : item.video ? (
                    <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    className="feed-post-video"
                    src={`http://13.233.96.187/backendcode/app/src/video/${item.video}`}
                    //  src="http://13.233.96.187/backendcode/app/src/video/1734178819241.mp4"
                    // muted
                    playsInline
                    loop
                  />
                  ) : null}
                </div>

                <div className='feed-post-footer'>
                  <div className='feed-post-likes'>
                    {item?.isLiked ? (
                      <img src={require("../../assets/like.png")} width={16} height={16} onClick={()=>handleLike(item?._id)} />
                    ) : (
                      <img src={require("../../assets/nocolor_like.png")} width={16} height={16} onClick={()=>handleLike(item?._id)} />
                    )}
                    <span>{item?.likes?.length}</span>
                  </div>
                  <div className='feed-post-share' onClick={() => openModal(item)}>
                    <img src={require("../../assets/share.png")} width={16} height={16} />
                    <span>Share</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className='create-post'>
        <img src={require("../../assets/createPost.png")} onClick={() => path()} />
      </div>
      <AnimatedModal isVisible={isModalVisible} onClose={closeModal}>
        <div className='modal-share'>
          <div className='modal-headr'>
            <span>Share Post</span>
            <img src={require("../../assets/close.png")} onClick={closeModal} width={16} height={16} />
          </div>
          <div className='modal-body'>
            <div className='modal-upper-body'>
              <div className='modal-media-container' onClick={() => shareToSocialMedia('twitter')}>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/twitter.png")} width={24} height={24} />
                </div>
                <span>Twitter</span>
              </div>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('facebook')}>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/facebook.png")} width={24} height={24} />
                </div>
                <span>Facebook</span>
              </div>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('reddit')}>
                <div className='modal-icon-container reddit'>
                  <img src={require("../../assets/reddit.png")} width={24} height={24} />
                </div>
                <span>Reddit</span>
              </div>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('discord')}>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/discord.png")} width={24} height={24} />
                </div>
                <span>Discord</span>
              </div>
            </div>
            <div className='modal-upper-body'>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('whatsapp')}>
                <div className='modal-icon-container whatsapp'>
                  <img src={require("../../assets/whatsapp.png")} width={24} height={24} />
                </div>
                <span>WhatsApp</span>
              </div>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('messenger')}>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/messenger.png")} width={24} height={24} />
                </div>
                <span>Messenger</span>
              </div>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('telegram')}>
                <div className='modal-icon-container'>
                  <img src={require("../../assets/telegram.png")} width={24} height={24} />
                </div>
                <span>Telegram</span>
              </div>

              <div className='modal-media-container' onClick={() => shareToSocialMedia('instagram')}>
                <div className='modal-icon-container instgram'>
                  <img src={require("../../assets/instagram.png")} width={24} height={24} />
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


