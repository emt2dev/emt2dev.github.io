(function () {
  "use strict";

  var root = document.documentElement;
  var menuToggle = document.getElementById("menuToggle");
  var drawer = document.getElementById("mobileDrawer");
  var backdrop = document.getElementById("drawerBackdrop");
  var drawerClose = document.getElementById("drawerClose");

  function setDrawer(open) {
    if (!drawer || !menuToggle || !backdrop) {
      return;
    }

    var wasOpen = drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("drawer-open", open);

    if (open) {
      var firstLink = drawer.querySelector(".drawer-nav a") || drawer.querySelector("a, button");
      if (firstLink) {
        firstLink.focus();
      }
    } else if (wasOpen && drawer.contains(document.activeElement)) {
      menuToggle.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", function () {
      setDrawer(false);
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setDrawer(false);
    });
  }

  if (drawer) {
    Array.prototype.forEach.call(drawer.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        setDrawer(false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setDrawer(false);
      return;
    }

    if (event.key !== "Tab" || !drawer || !drawer.classList.contains("is-open")) {
      return;
    }

    var focusable = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 940) {
      setDrawer(false);
    }
  });

  var availability = document.getElementById("availability");
  var availabilityText = document.getElementById("availabilityText");

  function updateAvailability() {
    if (!availability || !availabilityText) {
      return;
    }

    var hour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        hour12: false
      }).format(new Date())
    );

    var isAvailable = hour >= 8 && hour < 18;
    availability.classList.toggle("is-off", !isAvailable);
    availabilityText.textContent = isAvailable ? "Available for calls" : "Not available for calls";
  }

  updateAvailability();
  setInterval(updateAvailability, 15 * 60 * 1000);

  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");

  function updateScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    if (progress) {
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }
  }

  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (!reduceMotion && "IntersectionObserver" in window) {
    root.classList.add("reveal-enabled");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    Array.prototype.forEach.call(revealItems, function (item) {
      observer.observe(item);
    });
  }
})();
