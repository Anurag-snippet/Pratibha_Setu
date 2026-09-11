const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      required: [true, 'Question type is required'],
      enum: {
        values: ['multiple_choice', 'rating'],
        message: '{VALUE} is not a valid question type',
      },
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    correctAnswerIndex: {
      type: Number,
      default: null,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
    skillName: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      default: 'Core Ayush Knowledge',
    },
  },
  {
    timestamps: true,
  }
);

assessmentQuestionSchema.index({ skillId: 1 });

module.exports = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);
