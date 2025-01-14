import { useProject } from "./ProjectContext";
import { format } from "date-fns";

export const ProjectHeader = () => {
  const { projectData } = useProject();

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            {projectData.title}
          </h1>
          <p className="text-gray-500">{projectData.company}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Project Lead</span>
            <span className="font-medium">{projectData.projectLead}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Start Date</span>
            <span className="font-medium">
              {format(new Date(projectData.startDate), "MMMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};