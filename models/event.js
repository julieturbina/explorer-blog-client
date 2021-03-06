const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
  title: String,
  detail: String,
  location: String,
  review: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;


