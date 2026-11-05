const API_BASE = "/api";

const setText = (id, value, fallback = "") => {
  const element = document.getElementById(id);
  if (element) element.textContent = value || fallback;
};

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[character]));

async function getJSON(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function initials(name) {
  return String(name || "Your Name").trim().split(/\s+/).slice(0, 2)
    .map(part => part[0] || "").join("").toUpperCase() || "YN";
}

function renderTimeline(containerId, records, type) {
  const container = document.getElementById(containerId);
  if (!records.length) {
    container.innerHTML = `<p class="empty-state">No ${type} records have been added yet. Add records through the backend API to display them here.</p>`;
    return;
  }

  container.innerHTML = records.map(item => {
    const title = type === "education" ? item.degree : item.job_title;
    const subtitle = type === "education" ? item.institution : item.organization;
    const date = type === "education" ? item.year : item.duration;
    return `
      <article class="timeline-card">
        <div class="timeline-date">${escapeHTML(date || "Date not specified")}</div>
        <div>
          <h3>${escapeHTML(title)}</h3>
          <p class="timeline-subtitle">${escapeHTML(subtitle)}</p>
          ${item.description ? `<p class="timeline-description">${escapeHTML(item.description)}</p>` : ""}
        </div>
      </article>`;
  }).join("");
}

function renderSkills(skills) {
  const container = document.getElementById("skills-list");
  if (!skills.length) {
    container.innerHTML = `<p class="empty-state">No skills have been added yet. Add skills through the backend API to display them here.</p>`;
    return;
  }
  container.innerHTML = skills.map(skill => `
    <article class="skill-card">
      <strong>${escapeHTML(skill.skill_name)}</strong>
      <span>${escapeHTML(skill.level || "Level not specified")}</span>
    </article>`).join("");
}

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  if (!projects.length) {
    container.innerHTML = `<p class="empty-state">No projects have been added yet. Add projects through the backend API to display them here.</p>`;
    return;
  }
  container.innerHTML = projects.map((project, index) => `
    <article class="project-card">
      <span class="project-number">PROJECT ${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeHTML(project.project_name)}</h3>
      <p>${escapeHTML(project.description || "Project description not provided.")}</p>
      ${project.technologies ? `<span class="project-tech">${escapeHTML(project.technologies)}</span>` : ""}
    </article>`).join("");
}

async function loadProfile() {
  const profile = await getJSON("/profile");
  if (!profile || !profile.name) return;

  const name = profile.name;
  const title = profile.title || "Student & Aspiring Developer";
  setText("hero-name", name);
  setText("hero-title", title);
  setText("hero-location", profile.address, "Not specified");
  setText("hero-email", profile.email, "Email not provided");
  setText("card-name", name);
  setText("card-title", title);
  setText("avatar-initials", initials(name));
  setText("about-text", profile.about, "No profile description has been added yet.");
  setText("about-phone", profile.phone, "Not provided");
  setText("about-address", profile.address, "Not provided");

  if (profile.email) {
    const aboutEmail = document.getElementById("about-email");
    const contactEmail = document.getElementById("contact-email");
    aboutEmail.textContent = profile.email;
    aboutEmail.href = `mailto:${profile.email}`;
    contactEmail.textContent = profile.email;
    contactEmail.href = `mailto:${profile.email}`;
  }
}

async function loadWebsiteData() {
  const tasks = [
    loadProfile(),
    getJSON("/education").then(data => renderTimeline("education-list", data, "education")),
    getJSON("/skills").then(renderSkills),
    getJSON("/projects").then(renderProjects),
    getJSON("/experience").then(data => renderTimeline("experience-list", data, "experience"))
  ];
  const results = await Promise.allSettled(tasks);
  const failed = results.some(result => result.status === "rejected");
  if (failed) console.error("Some website data could not be loaded. Check that the backend server is running.");
}

document.getElementById("contact-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("form-status");
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const message = {
    sender_name: formData.get("sender_name").trim(),
    sender_email: formData.get("sender_email").trim(),
    message: formData.get("message").trim()
  };

  status.textContent = "Sending your message...";
  status.classList.remove("error");
  submitButton.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not send your message.");
    status.textContent = result.message || "Your message was sent successfully!";
    form.reset();
  } catch (error) {
    status.textContent = error.message || "Something went wrong. Please try again.";
    status.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("current-year").textContent = new Date().getFullYear();
loadWebsiteData();
