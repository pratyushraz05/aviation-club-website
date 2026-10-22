require("dotenv").config();

const path = require("path");
const { pathToFileURL } = require("url");

const connectDB = require("../src/config/db");
const Event = require("../src/models/eventModel");

const eventsFile = path.resolve(
  __dirname,
  "../../src/pages/Events/eventsData.js"
);

const mapEvent = (event) => ({
  eventId: event.id,
  title: event.title,
  date: event.date,
  duration: event.duration || "",
  venue: event.venue || "",
  speakerInfo: event.speakerInfo || "",
  isUpcoming: Boolean(event.isUpcoming),
  image: event.image || "",
  purpose: event.purpose || [],
  description: event.description,
  outcomes: event.outcomes || [],
});

async function main() {
  try {
    // Read the original frontend data without changing that file.
    const module = await import(pathToFileURL(eventsFile).href);
    const events = module.EVENTS_DATA;

    if (!Array.isArray(events) || events.length === 0) {
      throw new Error("No events were found in EVENTS_DATA.");
    }

    const mappedEvents = events.map(mapEvent);
    const ids = mappedEvents.map((event) => event.eventId);

    if (ids.some((id) => !id)) {
      throw new Error("At least one event is missing its id.");
    }

    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate event IDs found in the source data.");
    }

    for (const event of mappedEvents) {
      if (
        !event.title ||
        !event.date ||
        !event.description ||
        !Array.isArray(event.purpose) ||
        !Array.isArray(event.outcomes)
      ) {
        throw new Error(
          `Required data is missing for event: ${event.eventId}`
        );
      }
    }

    await connectDB();

    console.log(`\nFound ${mappedEvents.length} events in the source file.\n`);

    const toInsert = [];

    for (const event of mappedEvents) {
      const existing = await Event.findOne({
        eventId: event.eventId,
      }).select("_id");

      if (existing) {
        console.log(`SKIP (already exists): ${event.eventId}`);
      } else {
        console.log(`READY TO INSERT: ${event.eventId}`);
        toInsert.push(event);
      }
    }

    if (!process.argv.includes("--insert")) {
      console.log(`\nPreview complete.`);
      console.log(`New events that would be inserted: ${toInsert.length}`);
      console.log("Nothing was inserted. Run with --insert to proceed.");
      return;
    }

    if (toInsert.length === 0) {
      console.log("\nNo new events to insert.");
      return;
    }

    let inserted = 0;

    for (const event of toInsert) {
      try {
        await Event.create(event);
        inserted++;
        console.log(`INSERTED: ${event.eventId}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`SKIP (duplicate appeared): ${event.eventId}`);
        } else {
          throw error;
        }
      }
    }

    console.log(`\nImport finished. Inserted ${inserted} new events.`);
  } catch (error) {
    console.error("\nImport failed:", error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  }
}

main();
