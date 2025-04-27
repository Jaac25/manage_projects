"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { AssignForm } from "./AssignForm";
import { ContentFormProject } from "./ContentFormProject";
import { IProject } from "@/types/project";
import { useUser } from "@/hooks/useUser";
import { USER_TYPES } from "@/types/user";
import { DeleteForm } from "./DeleteForm";

export const ProjectModal = ({
  project,
  setProject,
  mutate,
}: {
  project?: IProject;
  setProject: (val: undefined) => void;
  mutate: () => Promise<void>;
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal && !!project) setShowModal(true);
  }, [showModal, project]);

  const user = useUser();
  return (
    <>
      {user?.type === USER_TYPES.CLIENT && (
        <Button
          variant="grayola"
          className="self-end"
          onClick={() => setShowModal(true)}
        >
          Crear Proyecto
        </Button>
      )}
      <h2>{project?.title}</h2>
      <Dialog
        open={showModal}
        modal
        onOpenChange={() => {
          setShowModal(false);
          setProject(undefined);
        }}
      >
        <DialogContent className="overflow-y-auto max-h-11/12">
          <DialogHeader>
            <DialogTitle>Gestionar Proyecto</DialogTitle>
            {project?.deleted && (
              <span className="bg-red-400 rounded p-2 text-center text-white font-bold select-none">
                Este proyecto fue borrado
              </span>
            )}
          </DialogHeader>
          <FormProject
            mutate={mutate}
            project={project}
            onClose={() => {
              setShowModal(false);
              setProject(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const FormProject = ({
  onClose,
  project,
  mutate,
}: {
  onClose: () => void;
  project?: IProject;
  mutate: () => Promise<void>;
}) => {
  const user = useUser();
  return (
    <>
      <ContentFormProject mutate={mutate} onClose={onClose} project={project} />
      {user?.type === USER_TYPES.MANAGER && !!project && (
        <>
          <AssignForm mutate={mutate} onClose={onClose} project={project} />
          <DeleteForm mutate={mutate} onClose={onClose} project={project} />
        </>
      )}
    </>
  );
};
