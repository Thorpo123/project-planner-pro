import React, { useCallback, useRef, useState } from "react";
import { useProject } from "./ProjectContext";
import { format, eachDayOfInterval, addDays } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export const TaskTimeline = () => {
  const { projectData, reorderTasks, updateTask } = useProject();
  const [resizing, setResizing] = useState<{
    taskId: string;
    type: "start" | "end";
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Find the earliest start date and latest end date across all tasks
  const startDate = new Date(
    Math.min(
      ...projectData.tasks.map((task) => new Date(task.startDate).getTime())
    )
  );

  const endDate = new Date(
    Math.max(
      ...projectData.tasks.map((task) => new Date(task.endDate).getTime())
    )
  );

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  const handleResizeStart = (taskId: string, type: "start" | "end") => {
    setResizing({ taskId, type });
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing || !timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const task = projectData.tasks.find((t) => t.id === resizing.taskId);
      if (!task) return;

      const dayWidth = timelineRect.width / days.length;
      const offsetX = e.clientX - timelineRect.left;
      const dayIndex = Math.round(offsetX / dayWidth);
      const newDate = addDays(startDate, dayIndex);

      if (resizing.type === "start") {
        const endDate = new Date(task.endDate);
        if (newDate < endDate) {
          updateTask(resizing.taskId, {
            startDate: newDate.toISOString().split("T")[0],
            duration: Math.round(
              (endDate.getTime() - newDate.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      } else {
        const startDate = new Date(task.startDate);
        if (newDate > startDate) {
          updateTask(resizing.taskId, {
            endDate: newDate.toISOString().split("T")[0],
            duration: Math.round(
              (newDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      }
    },
    [resizing, days.length, projectData.tasks, startDate, updateTask]
  );

  const handleResizeEnd = () => {
    setResizing(null);
  };

  // Add and remove event listeners for resize
  React.useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [resizing, handleResizeMove]);

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-in">
      <div className="space-y-6">
        <div className="grid grid-cols-[200px_1fr] gap-4">
          <div />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(30px,1fr))]">
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="text-xs text-gray-500 text-center"
              >
                {format(day, "dd")}
              </div>
            ))}
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {projectData.tasks.map((task, index) => {
                  const taskStart = new Date(task.startDate);
                  const taskEnd = new Date(task.endDate);

                  const startOffset = Math.round(
                    (taskStart.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  const duration = Math.round(
                    (taskEnd.getTime() - taskStart.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="grid grid-cols-[200px_1fr] gap-4 items-center group hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
                        >
                          <div className="space-y-1">
                            <div className="font-medium truncate">
                              <span className="text-gray-500 mr-2">
                                #{index + 1}
                              </span>
                              {task.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {task.assignedTo}
                            </div>
                          </div>
                          <div className="relative h-8" ref={timelineRef}>
                            {/* Background grid lines */}
                            <div className="absolute inset-0 grid grid-cols-[repeat(auto-fit,minmax(30px,1fr))]">
                              {days.map((day) => (
                                <div
                                  key={day.toISOString()}
                                  className="border-l border-gray-200 h-full"
                                />
                              ))}
                            </div>

                            {/* Task bar */}
                            <div
                              className="absolute h-6 top-1 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors duration-200"
                              style={{
                                left: `${(startOffset / days.length) * 100}%`,
                                width: `${((duration + 1) / days.length) * 100}%`,
                              }}
                            >
                              {/* Left resize handle */}
                              <div
                                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/50 rounded-l-full"
                                onMouseDown={() =>
                                  handleResizeStart(task.id, "start")
                                }
                              />

                              {/* Progress bar */}
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{
                                  width: `${task.progress}%`,
                                }}
                              />

                              {/* Right resize handle */}
                              <div
                                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/50 rounded-r-full"
                                onMouseDown={() => handleResizeStart(task.id, "end")}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
