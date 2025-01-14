import { useProject } from "./ProjectContext";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export const TaskList = () => {
  const { projectData, updateTask, reorderTasks } = useProject();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-in">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {projectData.tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-row p-4 rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                          <div
                            className="editable-cell"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              updateTask(task.id, { name: e.target.textContent || "" })
                            }
                          >
                            {task.name}
                          </div>
                        </div>
                        <div>
                          <div
                            className="editable-cell"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              updateTask(task.id, {
                                assignedTo: e.target.textContent || "",
                              })
                            }
                          >
                            {task.assignedTo}
                          </div>
                        </div>
                        <div>
                          <input
                            type="range"
                            value={task.progress}
                            onChange={(e) =>
                              updateTask(task.id, {
                                progress: parseInt(e.target.value),
                              })
                            }
                            className="w-full"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            value={task.startDate}
                            onChange={(e) =>
                              updateTask(task.id, { startDate: e.target.value })
                            }
                            className="editable-cell w-full"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            value={task.endDate}
                            onChange={(e) =>
                              updateTask(task.id, { endDate: e.target.value })
                            }
                            className="editable-cell w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};