import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import "./App.css";


/* =========================================================
   DIGITAL PARTICLES
========================================================= */

function DigitalParticles() {
  const particlesRef = useRef();

    const [positions] = useState(() => {
    const count = 2200;
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 13;
      const z = -Math.random() * 70;

      array[i3] = Math.cos(angle) * radius;
      array[i3 + 1] = Math.sin(angle) * radius;
      array[i3 + 2] = z;
    }

    return array;
  });

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    particlesRef.current.rotation.z += delta * 0.01;
  });

return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.045}
        color="#00ff66"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}


/* =========================================================
   INTERACTIVE DIGITAL MODULE
========================================================= */

function InteractiveStructure({
  position,
  scale = 1,
  label = "ABOUT",
  onClick,
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.position.y =
      position[1] + Math.sin(time * 1.2) * 0.08;

    groupRef.current.rotation.z =
      Math.sin(time * 0.5) * 0.03;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();

        if (onClick) {
          onClick();
        }
      }}
      onPointerOver={(event) => {
        event.stopPropagation();

        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >

      {/* MAIN CUBE */}

      <mesh>
        <boxGeometry args={[1, 1, 1]} />

        <meshBasicMaterial
          color={hovered ? "#00ff99" : "#00ff66"}
          wireframe
          transparent
          opacity={hovered ? 0.7 : 0.45}
        />
      </mesh>


      {/* INNER CUBE */}

      <mesh scale={0.72}>
        <boxGeometry args={[1, 1, 1]} />

        <meshBasicMaterial
          color="#00ff66"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>


      {/* CENTER CORE */}

      <mesh scale={hovered ? 0.22 : 0.15}>
        <boxGeometry args={[1, 1, 1]} />

        <meshBasicMaterial
          color="#00ff66"
          transparent
          opacity={hovered ? 0.9 : 0.6}
        />
      </mesh>


      {/* LABEL */}

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.22}
        color={hovered ? "#ffffff" : "#00ff66"}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? `OPEN // ${label}` : label}
      </Text>


      {/* OUTER RING */}

      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={hovered ? 1.45 : 1.25}
      >
        <ringGeometry args={[0.95, 0.97, 64]} />

        <meshBasicMaterial
          color="#00ff66"
          transparent
          opacity={hovered ? 0.8 : 0.25}
          side={2}
        />
      </mesh>

    </group>
  );
}


/* =========================================================
   BINARY STREAM
========================================================= */

function BinaryStream({ progress }) {
  const groupRef = useRef();

const [binaryData] = useState(() => {
    const data = [];

    for (let i = 0; i < 380; i++) {
      data.push({
        value: Math.random() > 0.5 ? "0" : "1",
        x: (Math.random() - 0.5) * 26,
        y: (Math.random() - 0.5) * 18,
        z: -10 - Math.random() * 90,
        size: 0.3 + Math.random() * 0.5,
      });
    }

    return data;
  });

  useFrame(() => {
    if (!groupRef.current) return;

    const targetZ = progress * 45;

    groupRef.current.position.z +=
      (targetZ - groupRef.current.position.z) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {binaryData.map((bit, index) => (
        <Text
          key={index}
          position={[
            bit.x,
            bit.y,
            bit.z,
          ]}
          fontSize={bit.size}
          color="#00ff66"
          anchorX="center"
          anchorY="middle"
        >
          {bit.value}
        </Text>
      ))}
    </group>
  );
}


/* =========================================================
   DIGITAL WORLD
========================================================= */

function DigitalWorld({
  progress,
  setActiveSection,
}) {
  const { size } = useThree();
  const isPhone = size.width <= 700;

  return (
    <>

      {/* PARTICLES */}

      <DigitalParticles />


      {/* BINARY */}

      <BinaryStream
        progress={progress}
      />


      {/* ADDITIONAL CLICKABLE STRUCTURE */}

      {/* CENTRAL USER PROFILE NODE */}

      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <InteractiveStructure
          position={isPhone ? [1.5, 0.2, -16] : [0, 0, -20]}
          scale={2}
          label="ABOUT"
          onClick={() => {
            setActiveSection("about");
          }}
        />
      </Float>


      {/* SKILLS NODE */}

      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <InteractiveStructure
          position={isPhone ? [-1.5, 1.1, -28] : [-6, 1, -38]}
          scale={2}
          label="SKILLS"
          
          onClick={() => {
            setActiveSection("skills");
          }}
        />
      </Float>

          {/* EXPERIENCE NODE */}

      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <InteractiveStructure
          position={isPhone ? [1.3, -1.1, -61] : [-4, -3, -78]}
          scale={2}
          label="EXPERIENCE"
          onClick={() => {
            setActiveSection("experience");
          }}
        />
      </Float>

      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <InteractiveStructure
          position={isPhone ? [1.5, -0.9, -39] : [6, -1, -48]}
          scale={2}
          label="Achievements"
          onClick={() => {
            setActiveSection("achievements");
          }}
        />
      </Float>
      {/* PROJECTS NODE */}

      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <InteractiveStructure
          position={isPhone ? [-1.4, 1, -50] : [4, 2, -58]}
          scale={2}
          label="PROJECTS"
          onClick={() => {
            setActiveSection("projects");
          }}
        />
      </Float>

    </>
  );
}

/* =========================================================
   CAMERA CONTROLLER
========================================================= */

function CameraController({
  progress,
}) {
  const { size } = useThree();

  useFrame((state) => {
    const startZ = 5;
    const endZ = size.width <= 700 ? -53 : -70;

    const targetZ =
      startZ +
      (endZ - startZ) * progress;

    state.camera.position.z +=
      (targetZ - state.camera.position.z) * 0.08;

    state.camera.position.x +=
      (0 - state.camera.position.x) * 0.08;
  });

  return null;
}


/* =========================================================
   ABOUT SECTION

   FIX: JSX structure now matches the CSS structure.
   .about-window-content contains TWO direct children:
     1) .about-photo   (38% width, image)
     2) .about-left    (62% width, contains identity + info)
   .about-left contains BOTH .about-identity and .about-info
   stacked vertically, as the CSS expects.
========================================================= */

function AboutSection({
  onClose,
  aboutProgress,
  onWheel,
}) {

  const sectionRef = useRef(null);
  const aboutLeftRef = useRef(null);
  const onWheelRef = useRef(onWheel);
  const aboutProgressRef = useRef(aboutProgress);
  const touchStartY = useRef(null);
  const isPhone = window.matchMedia("(max-width: 700px)").matches;

  useEffect(() => {
    onWheelRef.current = onWheel;
  }, [onWheel]);

  useEffect(() => {
    aboutProgressRef.current = aboutProgress;
  }, [aboutProgress]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 700px)").matches) return;

    const handleDelta = (deltaY) => {
  const contentEl = sectionRef.current?.querySelector(".about-left"); // was ".about-window-content"
  const scrollingDown = deltaY > 0;
  const atMax = aboutProgressRef.current >= 1;
  const contentScrollTop = contentEl ? contentEl.scrollTop : 0;
  const contentAtMax = contentEl
    ? contentScrollTop + contentEl.clientHeight >= contentEl.scrollHeight - 1
    : true;

  if (atMax && scrollingDown && contentEl && !contentAtMax) {
    contentEl.scrollTop += deltaY;
    return;
  }

  if (!scrollingDown && contentScrollTop > 0 && contentEl) {
    contentEl.scrollTop += deltaY;
    return;
  }

  onWheelRef.current(deltaY);
};

    const wheelHandler = (event) => {
      event.preventDefault();
      handleDelta(event.deltaY);
    };

    const touchStartHandler = (event) => {
      touchStartY.current = event.touches[0].clientY;
    };

    const touchMoveHandler = (event) => {
      if (touchStartY.current === null) return;

      event.preventDefault();

      const touchY = event.touches[0].clientY;
      const deltaY = (touchStartY.current - touchY) * 1.5;

      touchStartY.current = touchY;
      handleDelta(deltaY);
    };

    el.addEventListener("wheel", wheelHandler, { passive: false });
    el.addEventListener("touchstart", touchStartHandler, { passive: true });
    el.addEventListener("touchmove", touchMoveHandler, { passive: false });

    return () => {
      el.removeEventListener("wheel", wheelHandler);
      el.removeEventListener("touchstart", touchStartHandler);
      el.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);

  /*
    aboutProgress

    0 → identity visible
    1 → paragraph visible
  */

  const identityOpacity = Math.max(
    0.25,
    1 - aboutProgress * 0.75
  );

  const identityShift =
    -aboutProgress * 12;

  const paragraphOpacity = Math.max(
    0.35,
    Math.min(
      1,
      (aboutProgress - 0.15) * 1.6
    )
  );

  const paragraphShift =
    (1 - paragraphOpacity) * 16;

  return (
    <section
      className="about-window"
      ref={sectionRef}
    >

      {/* =================================================
         HEADER
      ================================================= */}

      <div className="about-window-header">

        <span className="window-id">
          USER_PROFILE // 01
        </span>

        <button
          type="button"
          className="about-close"
          onClick={onClose}
          aria-label="Close about section"
        >
          ×
        </button>

      </div>


      {/* =================================================
         CONTENT
      ================================================= */}

      <div className="about-window-content">

        {/* =================================================
           PHOTO (sibling of .about-left, matches CSS)
        ================================================= */}

        <div className="about-photo">

          <img
            src="/purvi.jpg"
            alt="Purvi Bhatia"
          />

          <div className="about-photo-fade"></div>

          <div className="photo-overlay">

            <span>
              USER_001
            </span>

            <span>
              PROFILE_ACTIVE
            </span>

          </div>

          <div className="photo-scan"></div>

        </div>


        {/* =================================================
           RIGHT SIDE
           Identity + Bio stacked inside .about-left,
           exactly as the CSS flex-column expects.
        ================================================= */}

        <div
          className="about-left"
          ref={aboutLeftRef}
        >

          {/* IDENTITY */}

          <div
            className="about-identity"
            style={{
              opacity: isPhone ? 1 : identityOpacity,
              transform: isPhone
                ? "none"
                : `translateY(${identityShift}px)`,
            }}
          >

            <h2>
              PURVI
              <br />
              BHATIA
            </h2>

            <h3>
              Software Developer &amp; AI/ML Enthusiast 
            </h3>

            <span className="scroll-hint">
              scroll ↓
            </span>

          </div>


          {/* BIO */}

          <div className="about-info">

            <div className="about-line"></div>

            <div
              className="about-paragraphs"
              style={{
                opacity: isPhone ? 1 : paragraphOpacity,
                transform: isPhone
                  ? "none"
                  : `translateY(${paragraphShift}px)`,
              }}
            >

              <p>
                Full-stack developer and AI/ML enthusiast with hands-on experience building real products end-to-end —
                independently handling AI integration and the backend decision layer for an AI communication platform, and
                leading the AI component of a hackathon-winning project at my company. Continually curious about how AI can
                power smarter, more adaptive workflows
              </p>

            </div>


            {/* EDUCATION LOG */}

            <div
              className="about-education"
              style={{
                opacity: isPhone ? 1 : paragraphOpacity,
                transform: isPhone
                  ? "none"
                  : `translateY(${paragraphShift}px)`,
              }}
            >

              <span className="education-label">
                EDUCATION_LOG
              </span>

              <div className="education-item">

                <div className="education-row">

                  <strong>
                    B.Tech, Computer Science &amp; Engineering
                  </strong>

                  <span className="education-date">
                    2023 — 2026
                  </span>

                </div>

                <div className="education-row education-sub">

                  <span>
                    Silver Oak University
                  </span>

                  <span>
                    CGPA 8.7
                  </span>

                </div>

              </div>


              <div className="education-item">

                <div className="education-row">

                  <strong>
                    Diploma, Computer Engineering
                  </strong>

                  <span className="education-date">
                    2020 — 2023
                  </span>

                </div>

                <div className="education-row education-sub">

                  <span>
                    Tolani F.G. Polytechnic, Adipur
                  </span>

                  <span>
                    CGPA 8.6
                  </span>

                </div>

              </div>

            </div>


            {/* SYSTEM DATA */}

            <div className="about-data">

              <div className="data-item">

                <span>
                  STATUS
                </span>

                <strong>
                  ONLINE
                </strong>

              </div>


              <div className="data-item">

                <span>
                  ROLE
                </span>

                <strong>
                  DEVELOPER
                </strong>

              </div>


              <div className="data-item">

                <span>
                  MODE
                </span>

                <strong>
                  BUILDING
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
         FOOTER
      ================================================= */}

      <div className="about-window-footer">

        <span>
          SYSTEM://USER_PROFILE
        </span>
      </div>

    </section>
  );
}

/* =========================================================
   SKILLS SECTION
========================================================= */

function SkillsSection({ onClose }) {

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  const skillGroups = [
    {
      label: "PROGRAMMING LANGUAGES",
      skills: [
        { name: "Python", level: 72 },
        { name: "JavaScript", level: 65 },
        { name: "Java", level: 95 },
        { name: "C / C++", level: 75 },
      ],
    },
    {
      label: "FRONTEND",
      skills: [
        { name: "React.js", level: 85 },
        { name: "Next.js", level: 65 },
        { name: "HTML5 / CSS3", level: 90 },
      ],
    },
    {
      label: "BACKEND",
      skills: [
        { name: "Python (REST APIs)", level: 65 },
        { name: "Supabase", level: 80 },
        { name: "MySQL", level: 75 },
      ],
    },
    {
      label: "AI & MACHINE LEARNING",
      skills: [
        { name: "AI Integration", level: 85 },
        { name: "Prompt Engineering", level: 88 },
        { name: "OpenClaw", level: 80 },
        {name: "Python Libraries", level: 65},
        
      ],
    },
    {
      label: "IDE",
      skills: [
        { name: "Microsoft Visual Studio (.NET)", level: 60 },
      ],
    },
  ];

  return (
    <section className="about-window skills-window">

      <div className="about-window-header">

        <span className="window-id">
          SKILL_MATRIX // 02
        </span>

        <button
          type="button"
          className="about-close"
          onClick={onClose}
          aria-label="Close skills section"
        >
          ×
        </button>

      </div>


      <div className="skills-window-content">

        <div className="skills-intro">

          <span className="about-code">
            SYS.SKILLS.LOAD()
          </span>

          <h2>
            SKILL
            <br />
            MATRIX
          </h2>

          <p>
            A live readout of core competencies, ranked by proficiency.
          </p>

        </div>


        <div className="skills-groups">

          {skillGroups.map((group, groupIndex) => (

            <div className="skill-group" key={groupIndex}>

              <span className="skill-group-label">
                {group.label}
              </span>

              {group.skills.map((skill, skillIndex) => (

                <div className="skill-item" key={skillIndex}>

                  <div className="skill-item-top">

                    <span className="skill-name">
                      {skill.name}
                    </span>

                    <span className="skill-percent">
                      {animate ? skill.level : 0}%
                    </span>

                  </div>

                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: animate ? `${skill.level}%` : "0%",
                      }}
                    ></div>
                  </div>

                </div>

              ))}

            </div>

          ))}

        </div>

      </div>


      <div className="about-window-footer">

        <span>
          SYSTEM://SKILL_MATRIX
        </span>
      </div>

    </section>
  );
}

/* =========================================================
   ACHIEVEMENTS SECTION
========================================================= */

function AchievementsSection({ onClose }) {

  const achievements = [
    {
      tag: "WINNER",
      title: "Internal Company Hackathon",
      org: "Appsrow Solution",
      description:
        "Won the company hackathon for a repurposing AI tool connected to a Figma-to-Webflow pipeline — built the AI component using Jina.ai, Python, Supabase, and React.",
    },
    {
      tag: "SELECTED",
      title: "Dewang Mehta IT Award",
      org: "Project Recognition",
      description:
        "Project selected for the Dewang Mehta IT Award, for innovation in IT-driven work.",
    },
  ];

  return (
    <section className="about-window achievements-window">

      <div className="about-window-header">

        <span className="window-id">
          ACHIEVEMENT_LOG // 03
        </span>

        <button
          type="button"
          className="about-close"
          onClick={onClose}
          aria-label="Close achievements section"
        >
          ×
        </button>

      </div>


      <div className="achievements-window-content">

        <div className="achievements-intro">

          <span className="about-code">
            SYS.ACHIEVEMENTS.LOAD()
          </span>

          <h2>
            ACHIEVEMENTS
          </h2>

          <p>
            Milestones earned along the way — recognitions for building and shipping things that mattered.
          </p>

        </div>


        <div className="achievements-list">

          {achievements.map((item, index) => (

            <div className="achievement-item" key={index}>

              <div className="achievement-marker"></div>

              <div className="achievement-body">

                <span className="achievement-tag">
                  {item.tag}
                </span>

                <h3 className="achievement-title">
                  {item.title}
                </h3>

                <span className="achievement-org">
                  {item.org}
                </span>

                <p className="achievement-desc">
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>


      <div className="about-window-footer">

        <span>
          SYSTEM://ACHIEVEMENT_LOG
        </span>
      </div>

    </section>
  );
}

/* =========================================================
   PROJECTS SECTION
========================================================= */

function ProjectsSection({ onClose }) {

  const projects = [
     {
      tag: "AI PLATFORM",
      title: "Repurposing AI Tool",
      bullets: [
        "Repurpose AI turns one piece of source content (URL, PDF, or pasted text) into platform-ready posts for Twitter/X, LinkedIn, Instagram, Newsletter, YouTube, and Blog — powered by GPT-4o, Jina AI, and optional Supabase storage."
      ],
      link: null, // e.g. "https://talos.yourdomain.com"
    },
    {
      tag: "AI PLATFORM",
      title: "Talos — AI Communication Intelligence Platform",
      bullets: [
        "Built an AI-powered communication platform integrating WhatsApp, Slack, and Microsoft Teams.",
        "Developed backend automation using Python and Supabase.",
        "Designed intelligent routing workflows to reduce manual communication.",
      ],
      link: null, // e.g. "https://talos.yourdomain.com"
    },
    {
      
      tag: "AI HYBRID CHAT",
      title: "Human Chatbot — AI Hybrid Chat Platform",
      bullets: [
        "Developed a platform enabling conversations with both AI assistants and human experts.",
        "Implemented AI-powered responses, authentication, and expert routing.",
      ],
      link: null,
    },
    {
      tag: "DESKTOP APP",
      title: "DK Store Management — .NET Desktop Application",
      bullets: [
        "Developed a Windows-based inventory and billing system with CRUD operations.",
      ],
      link: null,
    },
    {
      tag: "WEB APP",
      title: "Web Station — Responsive Web Application",
      bullets: [
        "Built a responsive web application using HTML, CSS, and JavaScript.",
      ],
      link: null,
    },
  ];
  return (
    <section className="about-window projects-window">

      <div className="about-window-header">

        <span className="window-id">
          PROJECT_ARCHIVE // 04
        </span>

        <button
          type="button"
          className="about-close"
          onClick={onClose}
          aria-label="Close projects section"
        >
          ×
        </button>

      </div>


      <div className="projects-window-content">

        <div className="projects-intro">

          <span className="about-code">
            SYS.PROJECTS.LOAD()
          </span>

          <h2>
            PROJECT
            <br />
            ARCHIVE
          </h2>

          <p>
            Things I've built, from desktop applications to AI platforms.
          </p>

        </div>


        <div className="projects-list">

          {projects.map((project, index) => (

            <div className="project-card" key={index}>

              <div className="project-card-top">

                <span className="project-tag">
                  {project.tag}
                </span>

                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    VISIT LIVE →
                  </a>
                ) : (
                  <span className="project-link project-link-disabled">
                  </span>
                )}

              </div>

              <h3 className="project-title">{project.title}</h3>

              <ul className="project-bullets">
                {project.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>

            </div>

          ))}

        </div>

      </div>


      <div className="about-window-footer">

        <span>
          SYSTEM://PROJECT_ARCHIVE
        </span>
      </div>

    </section>
  );
}

/* =========================================================
   CONTACT SECTION
========================================================= */

function ContactSection({ onClose }) {

  const channels = [
    {
      label: "EMAIL",
      value: "purvi.nb01@gmail.com",
      href: "mailto:purvi.nb01@gmail.com",
    },
    {
      label: "PHONE",
      value: "+91 81283 85702",
      href: "tel:+918128385702",
    },
    {
      label: "LOCATION",
      value: "Gandhidham, Kutch",
      href: null,
    },
    {
      label: "GITHUB",
      value: "github.com/PurviBhati",
      href: "https://github.com/PurviBhati",
    },
    {
      label: "LINKEDIN",
      value: "linkedin.com/in/purvibhatia",
      href: "https://www.linkedin.com/in/purvibhatia",
    },
  ];

  return (
    <section className="about-window contact-window">

      <div className="about-window-header">

        <span className="window-id">
          CONTACT_LINK // 05
        </span>

        <button
          type="button"
          className="about-close"
          onClick={onClose}
          aria-label="Close contact section"
        >
          ×
        </button>

      </div>


      <div className="contact-window-content">

        <div className="contact-intro">

          <span className="about-code">
            SYS.CONTACT.OPEN()
          </span>

          <h2>
            LET'S
            <br />
            CONNECT
          </h2>

          <p>
            Open to opportunities, collaborations, and interesting problems. Reach out through any channel below.
          </p>

        </div>


        <div className="contact-list">

          {channels.map((channel, index) => (

            <div className="contact-item" key={index}>

              <span className="contact-label">
                {channel.label}
              </span>

              {channel.href ? (
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="contact-value contact-value-link"
                >
                  {channel.value}
                </a>
              ) : (
                <span className="contact-value">
                  {channel.value}
                </span>
              )}

            </div>

          ))}

        </div>

      </div>


      <div className="about-window-footer">

        <span>
          SYSTEM://CONTACT_LINK
        </span>
      </div>

    </section>
  );
}

/* =========================================================
   EXPERIENCE SECTION
========================================================= */

function ExperienceSection({ onClose }) {

  const roles = [
    {
      title: "Technical Support & Client Operations Executive",
      org: "Appsrow Solution",
      period: "Feb 2026 — Jun 2026",
      bullets: [
        "Built an AI-powered communication intelligence platform that automatically forwards client requests/approvals from",
        "WhatsApp and Slack to the appropriate team groups/chats—built using Supabase, Teams bot, Slack bot, WhatsApp session integration, React/Next.js, and Python.",
"Promoted to Full Stack Developer Intern in recognition of this project, taking on end-to-end ownership of the AI integration and backend decision layer.", 
"Won an internal company hackathon for a project combining a repurposing AI tool with a Figma-to-Webflow connection; made the repurposing AI component, using Jina.ai, Python, Supabase, and React.", 
"Worked on real client projects, gaining hands-on production experience",
      ],
    },
  ];

  return (
    <section className="about-window experience-window">

      <div className="about-window-header">

        <span className="window-id">
          WORK_LOG // 06
        </span>

        <button
          type="button"
          className="about-close"
          onClick={onClose}
          aria-label="Close experience section"
        >
          ×
        </button>

      </div>


      <div className="experience-window-content">

        <div className="experience-intro">

          <span className="about-code">
            SYS.EXPERIENCE.LOAD()
          </span>

          <h2>
            WORK
            <br />
            LOG
          </h2>

          <p>
            A record of roles held and what was built along the way.
          </p>

        </div>


        <div className="experience-list">

          {roles.map((role, index) => (

            <div className="experience-item" key={index}>

              <div className="experience-marker"></div>

              <div className="experience-body">

                <div className="experience-top">

                  <h3 className="experience-title">
                    {role.title}
                  </h3>

                  <span className="experience-period">
                    {role.period}
                  </span>

                </div>

                <span className="experience-org">
                  {role.org}
                </span>

                <ul className="experience-bullets">

                  {role.bullets.map((bullet, bulletIndex) => (

                    <li key={bulletIndex}>
                      {bullet}
                    </li>

                  ))}

                </ul>

              </div>

            </div>

          ))}

        </div>

      </div>


      <div className="about-window-footer">

        <span>
          SYSTEM://WORK_LOG
        </span>
      </div>

    </section>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {

  /* =======================================================
     STATES
  ======================================================= */

  const [entered, setEntered] =
    useState(false);

  const [entering, setEntering] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [activeSection, setActiveSection] =
    useState(null);

  const [hasScrolled, setHasScrolled] =
    useState(false);

  const [aboutProgress, setAboutProgress] =
    useState(0);


  /* =======================================================
     ENTER SYSTEM
  ======================================================= */

  const enterSystem = () => {

    setEntering(true);

    setTimeout(() => {

      setEntered(true);
      setEntering(false);

    }, 2500);
  };


  /* =======================================================
     ABOUT SCROLL
  ======================================================= */

  const handleAboutWheel = (deltaY) => {

    setAboutProgress((previous) => {

      const next =
        previous +
        deltaY * 0.0025;

      return Math.max(
        0,
        Math.min(1, next)
      );
    });
  };


  /* =======================================================
     MAIN WORLD SCROLL
  ======================================================= */

    useEffect(() => {

    if (!entered) return;

    let touchStartY = 0;

    const handleWheel = (event) => {

      if (activeSection) {
        return;
      }

      if (!hasScrolled) {
        setHasScrolled(true);
      }

      setProgress((previous) => {

        const next =
          previous +
          event.deltaY * 0.008;

        return Math.max(0, Math.min(1, next));
      });

    };

    const handleTouchStart = (event) => {

      touchStartY = event.touches[0].clientY;

    };

    const handleTouchMove = (event) => {

      if (activeSection) {
        return;
      }

      if (!hasScrolled) {
        setHasScrolled(true);
      }

      const touchY = event.touches[0].clientY;
      const deltaY = (touchStartY - touchY) * 1.5;

      touchStartY = touchY;

      setProgress((previous) => {

        const next =
          previous +
          deltaY * 0.008;

        return Math.max(0, Math.min(1, next));
      });

    };


    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });


    return () => {

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);

    };

  }, [
    entered,
    hasScrolled,
    activeSection,
  ]);


  /* =======================================================
     RESET ABOUT
  ======================================================= */

  const closeAbout = () => {

    setAboutProgress(0);

    setActiveSection(null);

  };


  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="portfolio">


      {/* =================================================
         3D BACKGROUND
      ================================================= */}

      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
        }}
      >

        <color
          attach="background"
          args={["#010302"]}
        />

        <DigitalWorld
          progress={progress}
          setActiveSection={
            setActiveSection
          }
        />

        <CameraController
          progress={progress}
        />

      </Canvas>


      {/* =================================================
         HUD
      ================================================= */}

      <div
        className={`
          hud
          ${entering ? "system-entering" : ""}
          ${entered ? "system-entered" : ""}
        `}
      >

        {/* TOP LEFT */}

        <div className="system-name">
          PURVI.EXE
        </div>

        {/* TOP RIGHT — CONTACT BUTTON */}

        {entered && !activeSection && (

          <button
            type="button"
            className="contact-trigger"
            onClick={() => setActiveSection("contact")}
          >
            <span className="contact-trigger-dot"></span>
            CONTACT
          </button>

        )}

        {/* =================================================
           INITIAL HERO
        ================================================= */}

        {!entered && (

          <section className="hero">

            <div className="hero-label">
              DIGITAL PORTFOLIO
            </div>


            <h1>
              PURVI
              <br />
              BHATIA
            </h1>


            <h3>
              Software Developer
            </h3>


            <p>
            Building real products end-to-end, with a focus on AI integration with backend decision layers.
            </p>


            <button
              type="button"
              onClick={enterSystem}
            >
              Enter System
            </button>

          </section>

        )}


        {/* =================================================
           AFTER ENTERING
        ================================================= */}

        {entered && !activeSection && (

          <div className="enter-screen">

            {!hasScrolled && (

              <div className="scroll-message">

                <span>
                  SYSTEM ACCESS GRANTED
                </span>

                <strong>
                  SCROLL TO ENTER
                </strong>

                <small>
                  ↓
                </small>

              </div>

            )}

          </div>

        )}


        {/* =================================================
           ABOUT SECTION
        ================================================= */}

        {activeSection === "about" && (

          <AboutSection
            aboutProgress={
              aboutProgress
            }
            onWheel={
              handleAboutWheel
            }
            onClose={
              closeAbout
            }
          />

        )}
        {activeSection === "skills" && (

          <SkillsSection
            onClose={closeAbout}
          />

        )}
        {activeSection === "experience" && (

          <ExperienceSection
            onClose={closeAbout}
          />

        )}
        {activeSection === "achievements" && (

          <AchievementsSection
            onClose={closeAbout}
          />

        )}
        {activeSection === "projects" && (

          <ProjectsSection
            onClose={closeAbout}
          />

        )}
        {activeSection === "contact" && (

          <ContactSection
            onClose={closeAbout}
          />

        )}
      </div>

    </main>
  );
}


export default App;