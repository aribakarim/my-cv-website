
const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Display website files
app.use(express.static(path.join(__dirname, "../frontend")));

// Test API
app.get("/api", (req, res) => {
  res.json({
    message: "CV Website REST API is working!"
  });
});

// Get profile information
app.get("/api/profile", (req, res) => {
  const profile = db.prepare(
    "SELECT * FROM profile LIMIT 1"
  ).get();

  res.json(profile || {});
});

// Add profile information
app.post("/api/profile", (req, res) => {
  const {
    name, title, email, phone, address, about
  } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const result = db.prepare(`
    INSERT INTO profile
    (name, title, email, phone, address, about)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, title, email, phone, address, about);

  res.status(201).json({
    message: "Profile added successfully!",
    id: result.lastInsertRowid
  });
});

// Update profile
app.put("/api/profile/:id", (req, res) => {
  const { name, title, email, phone, address, about } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const result = db.prepare(`
    UPDATE profile
    SET name = ?, title = ?, email = ?, phone = ?, address = ?, about = ?
    WHERE id = ?
  `).run(name, title, email, phone, address, about, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Profile not found"
    });
  }

  res.json({
    message: "Profile updated successfully!"
  });
});

// Delete profile
app.delete("/api/profile/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM profile WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Profile not found"
    });
  }

  res.json({
    message: "Profile deleted successfully!"
  });
});

// Get education information
app.get("/api/education", (req, res) => {
  const education = db.prepare(
    "SELECT * FROM education"
  ).all();

  res.json(education);
});

// Add education information
app.post("/api/education", (req, res) => {
  const { degree, institution, year, description } = req.body;

  if (!degree || !institution) {
    return res.status(400).json({
      error: "Degree and institution are required"
    });
  }

  const result = db.prepare(`
    INSERT INTO education
    (degree, institution, year, description)
    VALUES (?, ?, ?, ?)
  `).run(degree, institution, year, description);

  res.status(201).json({
    message: "Education added successfully!",
    id: result.lastInsertRowid
  });
});

// Update education
app.put("/api/education/:id", (req, res) => {
  const { degree, institution, year, description } = req.body;

  if (!degree || !institution) {
    return res.status(400).json({
      error: "Degree and institution are required"
    });
  }

  const result = db.prepare(`
    UPDATE education
    SET degree = ?, institution = ?, year = ?, description = ?
    WHERE id = ?
  `).run(degree, institution, year, description, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Education not found"
    });
  }

  res.json({
    message: "Education updated successfully!"
  });
});

// Delete education
app.delete("/api/education/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM education WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Education not found"
    });
  }

  res.json({
    message: "Education deleted successfully!"
  });
});

// Get all skills
app.get("/api/skills", (req, res) => {
  const skills = db.prepare(
    "SELECT * FROM skills"
  ).all();

  res.json(skills);
});

// Add a new skill
app.post("/api/skills", (req, res) => {
  const { skill_name, level } = req.body;

  if (!skill_name) {
    return res.status(400).json({
      error: "Skill name is required"
    });
  }

  const result = db.prepare(`
    INSERT INTO skills (skill_name, level)
    VALUES (?, ?)
  `).run(skill_name, level);

  res.status(201).json({
    message: "Skill added successfully!",
    id: result.lastInsertRowid
  });
});

// Update a skill
app.put("/api/skills/:id", (req, res) => {
  const { skill_name, level } = req.body;
  const { id } = req.params;

  if (!skill_name) {
    return res.status(400).json({
      error: "Skill name is required"
    });
  }

  const result = db.prepare(`
    UPDATE skills
    SET skill_name = ?, level = ?
    WHERE id = ?
  `).run(skill_name, level, id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Skill not found"
    });
  }

  res.json({
    message: "Skill updated successfully!"
  });
});

// Delete a skill
app.delete("/api/skills/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM skills WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Skill not found"
    });
  }

  res.json({
    message: "Skill deleted successfully!"
  });
});

// Get all projects
app.get("/api/projects", (req, res) => {
  const projects = db.prepare(
    "SELECT * FROM projects"
  ).all();

  res.json(projects);
});

// Add a new project
app.post("/api/projects", (req, res) => {
  const { project_name, description, technologies } = req.body;

  if (!project_name) {
    return res.status(400).json({
      error: "Project name is required"
    });
  }

  const result = db.prepare(`
    INSERT INTO projects (project_name, description, technologies)
    VALUES (?, ?, ?)
  `).run(project_name, description, technologies);

  res.status(201).json({
    message: "Project added successfully!",
    id: result.lastInsertRowid
  });
});

// Update a project
app.put("/api/projects/:id", (req, res) => {
  const { project_name, description, technologies } = req.body;

  if (!project_name) {
    return res.status(400).json({
      error: "Project name is required"
    });
  }

  const result = db.prepare(`
    UPDATE projects
    SET project_name = ?, description = ?, technologies = ?
    WHERE id = ?
  `).run(project_name, description, technologies, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Project not found"
    });
  }

  res.json({
    message: "Project updated successfully!"
  });
});

// Delete a project
app.delete("/api/projects/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM projects WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Project not found"
    });
  }

  res.json({
    message: "Project deleted successfully!"
  });
});

// Get all experience
app.get("/api/experience", (req, res) => {
  const experience = db.prepare(
    "SELECT * FROM experience"
  ).all();

  res.json(experience);
});

// Add experience
app.post("/api/experience", (req, res) => {
  const { job_title, organization, duration, description } = req.body;

  if (!job_title || !organization) {
    return res.status(400).json({
      error: "Job title and organization are required"
    });
  }

  const result = db.prepare(`
    INSERT INTO experience
    (job_title, organization, duration, description)
    VALUES (?, ?, ?, ?)
  `).run(job_title, organization, duration, description);

  res.status(201).json({
    message: "Experience added successfully!",
    id: result.lastInsertRowid
  });
});

// Update experience
app.put("/api/experience/:id", (req, res) => {
  const { job_title, organization, duration, description } = req.body;

  if (!job_title || !organization) {
    return res.status(400).json({
      error: "Job title and organization are required"
    });
  }

  const result = db.prepare(`
    UPDATE experience
    SET job_title = ?, organization = ?, duration = ?, description = ?
    WHERE id = ?
  `).run(job_title, organization, duration, description, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Experience not found"
    });
  }

  res.json({
    message: "Experience updated successfully!"
  });
});

// Delete experience
app.delete("/api/experience/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM experience WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Experience not found"
    });
  }

  res.json({
    message: "Experience deleted successfully!"
  });
});

// Save contact message
app.post("/api/contact", (req, res) => {
  const { sender_name, sender_email, message } = req.body;

  if (!sender_name || !sender_email || !message) {
    return res.status(400).json({
      error: "Please complete all contact fields"
    });
  }

  db.prepare(`
    INSERT INTO contact_messages
    (sender_name, sender_email, message)
    VALUES (?, ?, ?)
  `).run(sender_name, sender_email, message);

  res.status(201).json({
    message: "Your message was saved successfully!"
  });
});

// Get all contact messages
app.get("/api/contact", (req, res) => {
  const messages = db.prepare(
    "SELECT * FROM contact_messages ORDER BY created_at DESC"
  ).all();

  res.json(messages);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
