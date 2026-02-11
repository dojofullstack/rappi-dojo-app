

const Carousel = ({ banner }) => {
    // console.log(banner.banner);
    console.log(banner);
    
  return (
    <div>
      
      <div className="carousel w-full">
  <div id="slide1" className="carousel-item relative w-full">
    <img
      src={banner}
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide4" className="btn btn-circle">❮</a>
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div>

</div>

    </div>
  );
}

export default Carousel;