import { useProject } from "./ProjectContext";
import { format } from "date-fns";

export const ProjectHeader = () => {
  const { projectData, updateProjectData } = useProject();

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h1 
            className="text-3xl font-semibold tracking-tight editable-cell"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateProjectData({ title: e.target.textContent || "" })}
          >
            {projectData.title}
          </h1>
          <p 
            className="text-gray-500 editable-cell"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateProjectData({ company: e.target.textContent || "" })}
          >
            {projectData.company}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Project Lead</span>
            <span 
              className="font-medium editable-cell"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateProjectData({ projectLead: e.target.textContent || "" })}
            >
              {projectData.projectLead}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Start Date</span>
            <input
              type="text"
              value={format(new Date(projectData.startDate), "yyyy-MM-dd")}
              onChange={(e) => updateProjectData({ startDate: e.target.value })}
              className="editable-cell font-medium w-32 text-right"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>
    </div>
  );
};