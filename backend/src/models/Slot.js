import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    hospital_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 10,
    },
    booked: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
