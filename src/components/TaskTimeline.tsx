import { useProject } from "./ProjectContext";
import { format, eachDayOfInterval, startOfWeek, differenceInWeeks } from "date-fns";

export const TaskTimeline = () => {
  const { projectData } = useProject();

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
              ) + 1;
            const duration = Math.round(
              (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={task.id}
                className="grid grid-cols-[200px_1fr] gap-4 items-center"
              >
                <div className="font-medium truncate">{task.name}</div>
                <div className="relative h-6">
                  <div
                    className="absolute h-full rounded-full bg-black/10"
                    style={{
                      left: `${(startOffset / days.length) * 100}%`,
                      width: `${(duration / days.length) * 100}%`,
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