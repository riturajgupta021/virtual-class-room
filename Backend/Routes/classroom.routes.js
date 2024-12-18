const express = require("express");
const {
  createClassroom,
  getClassrooms,
  getClassroomById,
  addParticipant,
} = require("../Controllers/classRoom.controller");

const router = express.Router();

// Routes
router.post("/", createClassroom); // Create a new classroom
router.get("/", getClassrooms); // Get all classrooms
router.get("/:id", getClassroomById); // Get a specific classroom by ID
router.post("/:id/participants", addParticipant); // Add a participant to a classroom

module.exports = router;
