import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "permanently delete files from trash table",
  { minutes: 59 }, // every hour
  internal.files.deleteAllFiles,
);


export default crons;