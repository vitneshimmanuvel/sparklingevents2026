import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const bgCityRef = useRef(null);

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch("city.svg");
        const svgText = await response.text();
      

        if (bgCityRef.current) {
          bgCityRef.current.innerHTML = svgText;

          const svgElement = bgCityRef.current.querySelector("svg");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid slice");

          const runAnimation = gsap.timeline({
            scrollTrigger: {
              trigger: bgCityRef.current,
              start: "top top",
              end: "+=1000",
              scrub: 1,
              pin: true,
            },
          });

          runAnimation
            .add([
              gsap.to(svgElement, {
                scale: 1.5,
                duration: 2,
              }),
              gsap.to("#full_city", {
                opacity: 0,
                duration: 2,
              }),
            ])
            .add([
              gsap.to("#building_top", {
                y: -200,
                opacity: 0,
                duration: 2,
              }),
              gsap.to("#wall_side", {
                x: -200,
                opacity: 0,
                duration: 2,
              }),
              gsap.to("#wall_front", {
                x: 200,
                y: 200,
                opacity: 0,
                duration: 2,
              }),
            ])
            .add([
              gsap.to("#interior_wall_side", {
                x: -200,
                opacity: 0,
                duration: 2,
              }),
              gsap.to("#interior_wall_top", {
                y: -200,
                opacity: 0,
                duration: 2,
              }),
              gsap.to("#interior_wall_side_2", {
                opacity: 0,
                duration: 2,
              }),
              gsap.to("#interior_wall_front", {
                opacity: 0,
                duration: 2,
              }),
            ]);
        }
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    loadSVG();
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          <img src="img/logoweb.png" alt="Logo" />
        </div>
        <nav>
          <ul>
            <li className="active">Home</li>
            <li>Contact</li>
            <li>About</li>
          </ul>
        </nav>
      </header>

      <div className="banner">
        <div id="bg_city" ref={bgCityRef}></div>
        <div className="content">
          <div className="item">
            <div>
              <p>LUNDEV CHANNEL</p>
              <p>DEVELOPER & DESIGNER</p>
            </div>
            <div>
              <p>CONTENT CREATOR</p>
              <p>ALL LANGUAGE</p>
            </div>
          </div>
          <div className="item title">
            <p>Hong Kong</p>
            <p>real estate</p>
          </div>
        </div>
      </div>

      <main>
        <div className="friend">
          <div className="me">
            <h1>Lun Dev</h1>
            <h2>Developer & Designer</h2>
            <p>
              Please like and subscribe to the channel to watch many interesting
              videos <br /> about programming and web design.
            </p>
          </div>
          <ul>
            {[...Array(10)].map((_, i) => (
              <li key={i}>
                <img src={`img/${i + 1}.png`} alt={`Friend ${i + 1}`} />
              </li>
            ))}
          </ul>
        </div>

        <div className="lorem">
          <p>
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of <br /> Lorem Ipsum,
            you need to be sure there isn't anything embarrassing hidden in the
            middle of text...
          </p>
          <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It
            has roots in a piece of classical Latin literature from 45 BC...
          </p>
          <p>
            It is a long established fact that a reader will be distracted by the
            readable content of a page when looking at its layout. The point of
            using Lorem Ipsum is that it has a more-or-less normal distribution
            of letters, as opposed to using <br /> 'Content here, content here',
            making it look like readable English...
          </p>
        </div>
      </main>
    </>
  );
}
