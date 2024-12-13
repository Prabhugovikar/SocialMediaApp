import React, { useState, useRef, useEffect } from 'react'
import './profile.css'
import { useTheme } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchProfileData } from '../../redux/Slice/profileSlice';
import Skeleton from '../../components/Skeleton/Skeleton';
export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, userProfile, loading, error } = useSelector((state: RootState) => state.profile);
  const { isDarkMode } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const navigate = useNavigate();

  const UserName = localStorage.getItem('username');
  const ProfileImage = localStorage.getItem('profileImage');
  console.log("ProfileImage", ProfileImage);
  console.log('userName', UserName);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("userId", userId);
    dispatch(fetchProfileData(userId));
  }, [dispatch]);

  console.log("profiledata", profileData);
  console.log("userProfile", userProfile);



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


  return (
    <div className='profile'>
      <div className='profile-header-container'>
        <div className='profile-header'>
          <img src={require("../../assets/profileBackground.png")} className='profile-banner-img' />
          <div className='backarroe-editprofile'>
            <img src={require("../../assets/white_backarrow.png")} width='16' height='16' onClick={() => navigate('/Feed')} />
          </div>
        </div>
        <div className='profile-header-userprofile'>
          <img src={ProfileImage} className='user-profile' />
        </div>
      </div>
      <div className='edit-profile-button'>
        <button onClick={() => navigate('/editProfile', { state: userProfile })} className={isDarkMode ? 'edit-profile-dark' : 'edit-profile-light'}>Edit Profile</button>
      </div>
      <div className='profile-info'>
        <span>{userProfile?.username || UserName}</span>
        <span>{userProfile?.Bio}</span>
      </div>

      <div className='profile-myposts'>
        <div className='profile-myposts-header'>
          <span>My Posts</span>
        </div>
        <div className='profile-myposts-container'>
          {loading ? (
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
            <div className='posts-grid'>
              {profileData?.map((item, index) => (
                <div className='feed-post-media'>
                  {item?.images && item?.images?.length > 0 ? (
                    <div
                      className="image-container-2"
                      onTouchStart={(e) => handleDrag(e, index, item?.images?.length)}
                    >
                      <img
                        src={`http://13.233.96.187/backendcode/app/src/image/${item?.images[currentImageIndex[index] || 0]}`}
                        className="feed-post-img-2"
                        alt="Post"
                      />
                      {item?.images?.length > 1 && (
                        <div className="image-index-2">
                          {((currentImageIndex[index] || 0) + 1)} / {item?.images.length}
                        </div>
                      )}
                    </div>
                  ) : item.video ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="feed-post-video-2"
                      src={item.video}
                      muted
                      playsInline
                      loop
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='create-post'>
          <img src={require("../../assets/createPost.png")} onClick={() => navigate('/CreatePost')} />
        </div>
      </div>
    </div>
  )
}


