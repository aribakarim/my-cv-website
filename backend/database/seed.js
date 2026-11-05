const db = require("./db");

db.prepare(`
  INSERT INTO profile (name, title, email, phone, address, about)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  "Ariba Karim",
  "Aspiring Web Developer",
  "aribakarim09@gmail.com",
  "01706944154",
  "Dhaka, Bangladesh",
  "A hardworking individual looking for an opportunity to learn, gain experience, and build a strong career foundation.Quick to learn, open to new experiences, and committed to giving full effort in every task. Interested in developing new skills, gain practical experience and contribute adequately to a team."
);

db.prepare(`
  INSERT INTO education (degree, institution, year, description)
  VALUES (?, ?, ?, ?)
`).run("Computer Science and Engineering", "Independent University, Bangladesh", "2023 - Present", "");

db.prepare(`
  INSERT INTO skills (skill_name, level)
  VALUES (?, ?)
`).run("Python", "Advanced");

db.prepare(`
  INSERT INTO projects (project_name, description, technologies)
  VALUES (?, ?, ?)
`).run("Mental Health Monitoring System", "Tracks mood and mental state.", "SQL, Node.js, html");

db.prepare(`
  INSERT INTO experience (job_title, organization, duration, description)
  VALUES (?, ?, ?, ?)
`).run("Teaching Assistant", "Independent University, Bangladesh", "April 2026 - Present", "Supported administrative and classroom taks to ensure smooth daily operations.");

console.log("Done!");