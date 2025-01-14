import { useProject } from "./ProjectContext";
import { format, eachDayOfInterval, startOfWeek, differenceInWeeks, parseISO, isValid } from "date-fns";

export const TaskTimeline = () => {
  const { projectData } = useProject();

  // Find the earliest start date and latest end date across all tasks
  const startDate = new Date(
    Math.min(
      ...projectData.tasks.map((task) => new Date(task.startDate).getTime())
    )
  );
  const endDate = new Date(
    Math.max(...projectData.tasks.map((task) => new Date(task.endDate).getTime()))
  );

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const firstWeekStart = startOfWeek(startDate);
  const totalWeeks = Math.ceil(differenceInWeeks(endDate, firstWeekStart)) + 1;

  return (
    <div className="glass-card rounded-xl p-6 overflow-x-auto timeline-scroll">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[200px_1fr] gap-4">
          <div className="font-medium">Timeline</div>
          <div>
            {/* Date row */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(30px,1fr))]">
              {days.map((day, index) => (
                <div
                  key={day.toISOString()}
                  className={`text-center text-sm ${
                    index % 7 === 0 ? "font-medium" : "text-gray-500"
                  }`}
                >
                  {format(day, "MMM d")}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {projectData.tasks.map((task) => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            const startOffset =
              Math.round(
                (taskStart.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
            const duration = Math.round(
              (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={task.id}
                className="grid grid-cols-[200px_1fr] gap-4 items-center group"
              >
                <div className="space-y-1">
                  <div className="font-medium truncate">{task.name}</div>
                  <div className="text-xs text-gray-500">{task.assignedTo}</div>
                </div>
                <div className="relative h-8">
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
                    <div
                      className="h-full rounded-full bg-black/20 transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};