import YouTube, { YouTubeProps } from 'react-youtube'

const YouTubeVideo = ({ videoId }) => {
  // Set up event handlers
  const onReady = (event) => {
    // Access the player instance
    const player = event.target;

    // For example, you can automatically play the video
    // player.playVideo();
  };

  const onError = (error) => {
    console.error('YouTube Player Error:', error);
  };

  const opts = {
    height: '170',
    width: '300',
  }

  return (
    <YouTube
      opts={opts}
      videoId={videoId}
      onReady={onReady}
      onError={onError}
    />
  );
}

export default YouTubeVideo