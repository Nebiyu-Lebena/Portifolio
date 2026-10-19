
/* Nebiyu Lebena — 3D Cyber Portfolio */

// Contact email
const CONTACT_EMAIL = "nblb9415@gmail.com";

// Book elements
const papers = [...document.querySelectorAll(".paper")];
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const counter = document.getElementById("page-counter");
const book = document.getElementById("book");

// Current page: 0 = closed at the beginning
let currentPage = 0;

const pageLabels = [
  "PROFILE / 01",
  "ABOUT & SKILLS / 02",
  "SERVICES / 03",
  "PROJECTS / 04",
  "CONTACT / 05"
];

// Check that the main book elements exist
if (!book || !prevButton || !nextButton || !counter) {
  console.error(
    "Portfolio error: check the IDs book, prev-page, next-page and page-counter in index.html."
  );
} else if (papers.length === 0) {
  console.error(
    "Portfolio error: no .paper elements were found in index.html."
  );
} else {
  // Display the correct book state
  function renderBook() {
    papers.forEach((paper, index) => {
      const flipped = index < currentPage;

      paper.classList.toggle("is-flipped", flipped);

      // Keep the sheets stacked in the correct order.
      // Unflipped sheets stay above the book base.
      // Flipped sheets stack behind sheets that have not turned yet.
      if (flipped) {
        paper.style.zIndex = String(index + 1);
      } else {
        paper.style.zIndex = String(papers.length - index + 10);
      }

      paper.setAttribute("aria-hidden", String(flipped));
    });

    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === papers.length;

    counter.textContent =
      currentPage === papers.length
        ? "BOOK COMPLETE"
        : pageLabels[currentPage] || `PAGE ${currentPage + 1}`;

    book.classList.toggle(
      "book-finished",
      currentPage === papers.length
    );
  }

  // Turn to a specific page
  function goToPage(target) {
    const requestedPage = Number(target);

    if (!Number.isFinite(requestedPage)) return;

    currentPage = Math.max(
      0,
      Math.min(papers.length, Math.trunc(requestedPage))
    );

    renderBook();
  }

  // Next button
  nextButton.addEventListener("click", () => {
    goToPage(currentPage + 1);
  });

  // Previous button
  prevButton.addEventListener("click", () => {
    goToPage(currentPage - 1);
  });

  // Buttons that jump to a particular page
  document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", () => {
      goToPage(button.dataset.goto);

      document.querySelector(".book-scene")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  });

  // Touch-screen swipe support
  let touchStartX = null;

  book.addEventListener(
    "touchstart",
    event => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  book.addEventListener(
    "touchend",
    event => {
      if (touchStartX === null) return;

      const touchEndX = event.changedTouches[0].clientX;
      const difference = touchEndX - touchStartX;

      if (Math.abs(difference) > 55) {
        // Swipe left = next page; swipe right = previous page
        goToPage(currentPage + (difference < 0 ? 1 : -1));
      }

      touchStartX = null;
    },
    { passive: true }
  );

  // Keyboard navigation
  document.addEventListener("keydown", event => {
    const tag = event.target?.tagName?.toLowerCase();

    // Do not turn pages while typing in a form
    if (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      event.target?.isContentEditable
    ) {
      return;
    }

    if (event.key === "ArrowRight") {
      goToPage(currentPage + 1);
    } else if (event.key === "ArrowLeft") {
      goToPage(currentPage - 1);
    }
  });

  // Contact form: opens the visitor's email application
  const form = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!CONTACT_EMAIL || CONTACT_EMAIL === "your-email@example.com") {
        if (formNote) {
          formNote.textContent =
            "Setup needed: add your real email address in script.js.";
          formNote.style.color = "#ffca75";
        }
        return;
      }

      const data = new FormData(form);

      const senderName = String(data.get("name") || "").trim();
      const senderEmail = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!senderName || !senderEmail || !message) {
        if (formNote) {
          formNote.textContent = "Please complete all fields.";
        }
        return;
      }

      const subject = encodeURIComponent(
        `Portfolio message from ${senderName}`
      );

      const body = encodeURIComponent(
        `Name: ${senderName}\nEmail: ${senderEmail}\n\n${message}`
      );

      if (formNote) {
        formNote.textContent =
          "Opening your email app. Review the message and press Send there.";
        formNote.style.color = "#00d9ff";
      }

      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  // Automatically update the footer year
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize the book
  renderBook();
}
