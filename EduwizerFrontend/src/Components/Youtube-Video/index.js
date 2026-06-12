import "./index.css";

const YoutubeVideo = () => {
 
  return (
    <section >
        <div className="video-responsive">
    <iframe
    // width="100%"
    //     height="360"
    //   width="853"
    //   height="480"
    width="560" height="315"
      src={`https://www.youtube.com/embed/bFyeXHb8HAE`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
    </section>
  );
};

export default YoutubeVideo;
