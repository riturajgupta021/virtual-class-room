const Classroom = require("../Models/classRoom.model");

// Create a new classroom
exports.createClassroom = async (req, res, next) => {
  try {
    const { name, description, teacherId } = req.body;

    const classroom = await Classroom.create({
      name,
      description,
      teacher: teacherId,
      participants: [],
    });

    res.status(201).json(classroom);
  } catch (err) {
    next(err);
  }
};

// Get all classrooms
exports.getClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (err) {
    next(err);
  }
};

// Get a specific classroom by ID
exports.getClassroomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    res.status(200).json(classroom);
  } catch (err) {
    next(err);
  }
};

// Add a participant to a classroom
exports.addParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    if (classroom.participants.includes(participantId)) {
      return res.status(400).json({ error: "Participant already in classroom" });
    }

    classroom.participants.push(participantId);
    await classroom.save();

    res.status(200).json(classroom);
  } catch (err) {
    next(err);
  }
};
