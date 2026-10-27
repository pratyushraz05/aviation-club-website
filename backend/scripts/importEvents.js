const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});


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

    const toInsert = [];
    const toUpdate = [];

    for (const event of mappedEvents) {
      const existing = await Event.findOne({
        eventId: event.eventId,
      }).select("_id");

      if (existing) {
        toUpdate.push({ ...event, _id: existing._id });
      } else {
        toInsert.push(event);
      }
    }

    console.log(`\nSource events: ${mappedEvents.length}`);
    console.log(`Existing events to update: ${toUpdate.length}`);
    console.log(`New events to insert: ${toInsert.length}`);

    for (const event of toUpdate) {
      console.log(`UPDATE: ${event.eventId}`);
    }

    for (const event of toInsert) {
      console.log(`INSERT: ${event.eventId}`);
    }

    if (!process.argv.includes("--apply")) {
      console.log("\nPreview only. Database was not modified.");
      console.log("Run with --apply to apply these changes.");
      return;
    }

    let updated = 0;
    let inserted = 0;

    for (const event of toUpdate) {
      const { _id, ...fields } = event;

      await Event.updateOne(
        { _id },
        { $set: fields },
        { runValidators: true }
      );

      updated++;
      console.log(`UPDATED: ${event.eventId}`);
    }

    for (const event of toInsert) {
      await Event.create(event);
      inserted++;
      console.log(`INSERTED: ${event.eventId}`);
    }

    console.log(
      `\nImport finished. Updated ${updated}; inserted ${inserted}.`
    );
  } catch (error) {
    console.error("\nImport failed:", error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  }
}

main();
