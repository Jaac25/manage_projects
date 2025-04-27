"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/Separator";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase";
import { IProject } from "@/types/project";
import { USER_TYPES } from "@/types/user";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BUCKET } from "../../../constants";
import { ProjectModal } from "./ProjectModal";
import Autoplay from "embla-carousel-autoplay";
import clsx from "clsx";

interface IProjectPerUser {
  id: number;
  date: string;
  projects: {
    title: string;
    description: string;
    id: number;
    filePerProject?: {
      id: number;
      files: { id: number; name: string; url: string };
    }[];
    designerPerProject?: {
      id: number;
      users: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        type: number;
      };
    }[];
    deleted: boolean;
  };
  users: { email: string; id: number; type: number };
}

const queryProjects = `
          id,
          date,
          projects (
            id,
            title,
            description,
            deleted,
            filePerProject (
              id,
              files (
                url,
                name
              )
            ),
            designerPerProject (
              id,
              users (
                id,
                firstName,
                lastName,
                email,
                type
              )
            )
          ),
          users (
            id,
            email,
            type
          )
        `;
export default function HomePage() {
  const user = useUser();

  const [projects, setProjects] = useState<IProjectPerUser[] | undefined>([]);
  const [isLoading, setLoading] = useState(false);
  const [project, setProject] = useState<IProject | undefined>();

  const getAllProjects = async () => {
    const { data, error } = await supabase
      .from("projectPerUser")
      .select(queryProjects);
    if (error) console.error("Error fetching projects:", error);
    return data ?? [];
  };

  const getProjectsFromUser = async (idUser?: number) => {
    if (!idUser) return [];
    const { data, error } = await supabase
      .from("projectPerUser")
      .select(queryProjects)
      .eq("idUser", idUser);
    if (error) console.error("Error fetching projects from user:", error);
    return data ?? [];
  };

  const getProjects = useCallback(async () => {
    setLoading(true);
    let projects;
    if (user?.type === USER_TYPES.MANAGER) projects = await getAllProjects();
    if (user?.type === USER_TYPES.CLIENT)
      projects = (
        (await getProjectsFromUser(user.id)) as unknown as IProjectPerUser[]
      ).filter(({ projects: { deleted } }) => !deleted);
    if (user?.type === USER_TYPES.DESIGNER)
      projects = (
        (await getAllProjects()) as unknown as IProjectPerUser[]
      ).filter(
        ({ projects: { designerPerProject, deleted } }) =>
          designerPerProject?.at(0)?.users.id === user?.id && !deleted
      );
    setProjects(projects as unknown as IProjectPerUser[]);
    setLoading(false);
  }, [user, USER_TYPES]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <div className="flex flex-col w-full bg-white h-full p-8">
      <h2 className="font-bold text-center text-4xl">Tus Proyectos</h2>
      <Separator className="my-2" />
      <ProjectModal
        mutate={getProjects}
        setProject={setProject}
        project={project}
      />
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 p-4 overflow-auto">
        {isLoading &&
          Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-300 rounded w-64 h-60"
            />
          ))}
        {projects?.length ? (
          projects.map(({ projects }, i) => (
            <CardProject
              project={projects}
              setProject={setProject}
              key={`${i} ${project?.title}`}
            />
          ))
        ) : (
          <div className="col-span-4 text-center">
            No se han encontrado proyectos
          </div>
        )}
      </div>
    </div>
  );
}

const CardProject = ({
  setProject,
  project: {
    id,
    description,
    filePerProject,
    title,
    designerPerProject,
    deleted,
  },
}: {
  setProject: Dispatch<SetStateAction<IProject | undefined>>;
  project: IProjectPerUser["projects"];
}) => {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }) // Cambia 3000ms si quieres más rápido o lento
  );

  return (
    <Card
      className={clsx(
        "hover:cursor-pointer hover:scale-105",
        deleted && "shadow-md shadow-red-400"
      )}
      onClick={() => {
        const designer = designerPerProject?.at(0)?.users;
        setProject({
          id,
          description,
          title,
          files: filePerProject?.map(({ files }) => files) ?? [],
          designer: {
            id: designer?.id,
            email: designer?.email ?? "",
            firstName: designer?.firstName ?? "",
            lastName: designer?.lastName ?? "",
            type: designer?.type ?? USER_TYPES.DESIGNER,
            idDesignPerProject: designerPerProject?.at(0)?.id.toString() ?? "",
          },
          deleted,
        });
      }}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel plugins={[autoplay.current]}>
          <CarouselContent>
            {filePerProject?.map(({ files: { url, name } }, i) => (
              <CarouselItem key={`${url} ${i}`}>
                <Image
                  alt={name}
                  className="rounded bg-contain h-full"
                  src={`${BUCKET}/${url}`}
                  width={1000}
                  height={1000}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
};
