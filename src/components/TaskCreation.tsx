import { useState } from "react";
import { useProject } from "./ProjectContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { format } from "date-fns";

export const TaskCreation = () => {
  const { createTask } = useProject();
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName && duration && startDate) {
      createTask(taskName, parseInt(duration), startDate);
      setTaskName("");
      setDuration("");
      setStartDate("");
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <h2 className="text-lg font-medium mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="md:col-span-2"
        />
        <Input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Button type="submit" className="md:col-span-4">
          Add Task
        </Button>
      </form>
    </div>
  );
};