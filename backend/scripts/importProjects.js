
require("dotenv").config();

const path = require("path");
const { pathToFileURL } = require("url");

const connectDB = require("../src/config/db");
const Project = require("../src/models/projectModel");

const projectFile = path.resolve(
  __dirname,
  "../../src/pages/Projects/projectData.js"
);

function mapProject(project) {
  return {
    title: project.title,
    shortTitle: project.shortTitle || "",
    category: project.category,
    status: project.status,
    description: project.description,
    fullDescription: project.fullDescription,
    mentor: project.mentor || {},
    contributors: project.contributors || [],
    objectives: project.objectives || [],
    technologies: project.technologies || [],
    components: project.components || [],
    outcomes: project.outcomes || [],
  };
}

async function main() {
  try {
    const module = await import(pathToFileURL(projectFile).href);
    const projects = module.default;

    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("No projects found in projectData.js.");
    }

    const mappedProjects = projects.map(mapProject);

    const titles = mappedProjects.map((project) => project.title);

    if (
      titles.some((title) => !title) ||
      new Set(titles).size !== titles.length
    ) {
      throw new Error("Missing or duplicate project titles found.");
    }

    for (const project of mappedProjects) {
      if (
        !project.category ||
        !project.status ||
        !project.description ||
        !project.fullDescription
      ) {
        throw new Error(
          `Required fields are missing for: ${project.title}`
        );
      }
    }

    await connectDB();

    console.log(`\nFound ${mappedProjects.length} projects.\n`);

    const toInsert = [];

    for (const project of mappedProjects) {
      const existing = await Project.findOne({
        title: project.title,
      }).select("_id");

      if (existing) {
        console.log(`SKIP (already exists): ${project.title}`);
      } else {
        console.log(`READY TO INSERT: ${project.title}`);
        toInsert.push(project);
      }
    }

    if (!process.argv.includes("--insert")) {
      console.log("\nPreview complete.");
      console.log(`New projects that would be inserted: ${toInsert.length}`);
      console.log("Nothing was inserted. Run with --insert to proceed.");
      return;
    }

    let inserted = 0;

    for (const project of toInsert) {
      try {
        await Project.create(project);
        inserted++;
        console.log(`INSERTED: ${project.title}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`SKIP (duplicate appeared): ${project.title}`);
        } else {
          throw error;
        }
      }
    }

    console.log(`\nImport finished. Inserted ${inserted} new projects.`);
  } catch (error) {
    console.error("\nImport failed:", error.message);
    process.exitCode = 1;
  } finally {
    await require("mongoose").disconnect();
  }
}

main();
