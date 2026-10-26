const searchInput = document.querySelector("#doc-search");
const navLinks = [...document.querySelectorAll("#doc-nav .nav-link")];
const sections = [...document.querySelectorAll(".docs section[id]")];
const noResults = document.querySelector("#no-results");

function filterDocs(query) {
  const term = query.trim().toLowerCase();
  let visibleCount = 0;

  for (const section of sections) {
    const searchable = `${section.textContent} ${section.dataset.search || ""}`.toLowerCase();
    const matches = !term || searchable.includes(term);
    section.hidden = !matches;
    if (matches) visibleCount++;
  }

  for (const link of navLinks) {
    const target = document.querySelector(link.getAttribute("href"));
    link.hidden = Boolean(term) && (!target || target.hidden);
  }
  noResults.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", () => filterDocs(searchInput.value));

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    filterDocs("");
    searchInput.blur();
  }
});

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const active = `#${entry.target.id}`;
    for (const link of navLinks) {
      link.classList.toggle("active", link.getAttribute("href") === active);
    }
  }
}, { rootMargin: "-12% 0px -72% 0px", threshold: 0 });

sections.forEach((section) => observer.observe(section));
