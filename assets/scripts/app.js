(function () {
  "use strict";

  var root = document.documentElement;
  var THEMES = ["light", "aero", "dark"];
  var THEME_COLORS = {
    light: "#f7f8fb",
    aero: "#6ed5f4",
    dark: "#0b0f14"
  };

  var themeButtons = Array.prototype.slice.call(
    document.querySelectorAll("[data-theme-value]")
  );
  var themeColorMeta = document.getElementById("themeColor");

  function applyTheme(theme) {
    if (THEMES.indexOf(theme) === -1) {
      theme = "light";
    }

    root.setAttribute("data-theme", theme);

    themeButtons.forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("data-theme-value") === theme)
      );
    });

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", THEME_COLORS[theme]);
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (error) { }
  }

  var initialTheme = root.getAttribute("data-theme") || "light";
  try {
    var savedTheme = localStorage.getItem("theme");
    if (THEMES.indexOf(savedTheme) !== -1) {
      initialTheme = savedTheme;
    }
  } catch (error) { }
  applyTheme(initialTheme);

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(button.getAttribute("data-theme-value"));
    });
  });

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
    if (window.innerWidth > 1024) {
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
    availabilityText.textContent = isAvailable
      ? "Available for calls"
      : "Not available for calls";
  }

  updateAvailability();
  setInterval(updateAvailability, 15 * 60 * 1000);

  var header = document.getElementById("siteHeader");

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    Array.prototype.forEach.call(revealItems, function (item) {
      observer.observe(item);
    });
  }
})();
