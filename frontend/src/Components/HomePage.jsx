import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

const HomePage = () => {
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { src: "meet1.jpg", alt: "Illustration 1" },
    { src: "meet2.jpg", alt: "Illustration 2" },
    { src: "meet3.jpg", alt: "Illustration 3" },
  ];

  const paragraphs = [
    {
      heading: "Get a link you can share",
      content:
        "Click New meeting to get a link you can send to people you want to meet with",
    },
    {
      heading: "Plan ahead",
      content:
        "Click new meeting to schedule meetings in Google Calendar and send invites to participants",
    },
    {
      heading: "Your meeting is safe",
      content:
        "No one can join a meeting unless invited or admitted by the host",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  const naviagte = useNavigate();
  const Submitbutton = () => {
    if (!input.trim()) {
      alert("Please enter a valid name.");
      return;
    }
    naviagte(`/room/${input}`);
  };

  return (
    <div>
      <div>
        <header>
        <div className="logo">
          <img src="v-classroom_logo.png" alt="Virtual Classroom Logo" />
          <span>Virtual Classroom</span>
        </div>
        <div className="time">
          {currentTime.toLocaleTimeString()} &bull;{" "}
          {currentTime.toDateString()}
        </div>
        </header>

        <main>
          <div className="content">
            <h1 className="heading">Video calls and meetings for everyone</h1>
            <p>
              Connect, collaborate, and Study from anywhere with Virtual
              ClassRoom
            </p>

            <div className="buttons">
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={Submitbutton}>Join</button>
              </div>
            </div>
          </div>

          <div className="carouselBox">
            <div className="carousel">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className={currentIndex === index ? "active" : ""}
                />
              ))}

              <div className="controls">
                <button
                  className="prev"
                  onClick={handlePrev}
                  aria-label="Previous slide"
                >
                  &#10094;
                </button>
                <button
                  className="next"
                  onClick={handleNext}
                  aria-label="Next slide"
                >
                  &#10095;
                </button>
              </div>
            </div>

            {paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className={
                  currentIndex === index
                    ? "paragraph activeParagraph"
                    : "paragraph"
                }
              >
                <p className="p1">{paragraph.heading}</p>
                <p>{paragraph.content}</p>
              </div>
            ))}

            <div className="blue-button-box">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`blue-button ${
                    currentIndex === index ? "active-blue-button" : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
