const isPortfolioLandingPage = window.location.pathname.toLowerCase().endsWith("port.html");

if (!isPortfolioLandingPage) {
  window.location.replace("port.html");
}


function initializeNavbar() {
  const menu = document.querySelector(".menu");
  const navbar = document.querySelector(".navbar");
  const nameBox = document.querySelector(".name");
  const aboutBox = document.querySelector(".aboutbox");
  const skillBox = document.querySelector(".skillbox");
  const projectBox = document.querySelector(".project");
  const resumePage = document.querySelector(".resume-page");
  const contactPage = document.querySelector(".contact-container");
  const menuIcon = document.querySelector(".menu i");

  if (!menu || !navbar || !menuIcon || menu.dataset.initialized) {
    return;
  }

  menu.dataset.initialized = "true";
  menu.addEventListener("click", function () {
    navbar.classList.toggle("active");
    document.querySelectorAll(".name, .aboutbox, .skillbox, .project, .resume-page, .contact-container")
      .forEach(content => content.classList.toggle("navbar-open"));

    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-xmark");
  });

  navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (event) {
      const targetUrl = new URL(link.href, window.location.href);
      const isPortfolioHome = targetUrl.pathname === window.location.pathname &&
        targetUrl.pathname.endsWith("port.html");

      if (isPortfolioHome && targetUrl.hash) {
        const target = document.querySelector(targetUrl.hash);
        if (target && (target.id === "home" || target.children.length > 0)) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", targetUrl.hash);
        }
      }

      navbar.classList.remove("active");
      document.querySelectorAll(".name, .aboutbox, .skillbox, .project, .resume-page, .contact-container")
        .forEach(content => content.classList.remove("navbar-open"));
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    });
  });
}

function loadPortfolioSections() {
  const sections = [
    ["about", "About.html", ".aboutbox"],
    ["skills", "skill.html", ".skillbox"],
    ["projects", "project.html", ".project"],
    ["resume", "Resume.html", ".resume-page"],
    ["contact", "contact.html", ".contact-container"]
  ];

  sections.forEach(([sectionId, page, selector]) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    fetch(page)
      .then(response => response.text())
      .then(data => {
        const doc = new DOMParser().parseFromString(data, "text/html");
        doc.querySelectorAll("style").forEach((style, index) => {
          const styleId = `portfolio-${sectionId}-style-${index}`;
          if (!document.getElementById(styleId)) {
            const pageStyle = document.createElement("style");
            pageStyle.id = styleId;
            pageStyle.textContent = style.textContent;
            document.head.appendChild(pageStyle);
          }
        });
        const content = doc.querySelector(selector);
        if (content) {
          section.replaceChildren(content);
          if (window.location.hash === `#${sectionId}`) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }
      })
      .catch(error => console.error(error));
  });
}

// Fetch the navbar only for pages that use a navbar container.
if (document.getElementById("containeer")) {
  fetch("port.html")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const navbarSection = doc.querySelector('.containeer').outerHTML;
      document.getElementById("containeer").innerHTML = navbarSection;
      initializeNavbar();
    });
} else if (document.getElementById("port")) {
  fetch("port.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("port").innerHTML = data;
      initializeNavbar();
    });
} else {
  initializeNavbar();
}

loadPortfolioSections();

const container = document.querySelector(".Minbox-container");
const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting) {

        counters.forEach(counter => {

            const target = Number(counter.dataset.target);
            let count = 0;

            const update = () => {

                if (count <= target) {

                    counter.innerText =
                        count + (target === 100 ? "%" : "+");

                    count++;

                    setTimeout(update, 60);
                }
            };

            update();
        });

        observer.unobserve(container);
    }

});

if (container) {
  observer.observe(container);
}