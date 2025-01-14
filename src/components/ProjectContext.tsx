import React, { createContext, useContext, useState } from "react";

interface Task {
  id: string;
  name: string;
  assignedTo: string;
  progress: number;
  startDate: string;
  endDate: string;
  duration: number;
}

interface ProjectData {
  title: string;
  company: string;
  projectLead: string;
  startDate: string;
  tasks: Task[];
}

const initialData: ProjectData = {
  title: "Website Redesign",
  company: "Tech Corp",
  projectLead: "John Smith",
  startDate: "2024-04-01",
  tasks: [
    {
      id: "1",
      name: "Research & Planning",
      assignedTo: "Alice Johnson",
      progress: 75,
      startDate: "2024-04-01",
      endDate: "2024-04-07",
      duration: 7,
    },
    {
      id: "2",
      name: "Design Phase",
      assignedTo: "Bob Wilson",
      progress: 50,
      startDate: "2024-04-08",
      endDate: "2024-04-21",
      duration: 14,
    },
    {
      id: "3",
      name: "Development",
      assignedTo: "Charlie Brown",
      progress: 25,
      startDate: "2024-04-22",
      endDate: "2024-05-12",
      duration: 21,
    },
  ],
};

interface ProjectContextType {
  projectData: ProjectData;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateProjectData: (updates: Partial<ProjectData>) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setProjectData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  };

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setProjectData((prev) => {
      const newTasks = [...prev.tasks];
      const [removed] = newTasks.splice(startIndex, 1);
      newTasks.splice(endIndex, 0, removed);
      return { ...prev, tasks: newTasks };
    });
  };

  return (
    <ProjectContext.Provider value={{ projectData, updateTask, updateProjectData, reorderTasks }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};