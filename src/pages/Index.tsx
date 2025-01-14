import { ProjectHeader } from "@/components/ProjectHeader";
import { TaskTimeline } from "@/components/TaskTimeline";
import { TaskList } from "@/components/TaskList";
import { TaskCreation } from "@/components/TaskCreation";
import { ProjectProvider } from "@/components/ProjectContext";

const Index = () => {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-8">
          <ProjectHeader />
          <TaskCreation />
          <TaskTimeline />
          <TaskList />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default Index;