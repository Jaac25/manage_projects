import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customToast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase";
import clsx from "clsx";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { BUCKET } from "../../../constants";
import { IProject } from "@/types/project";
import { USER_TYPES } from "@/types/user";
import Loader from "@/components/Loader";

export const ContentFormProject = ({
  project,
  onClose,
  mutate,
}: {
  project?: IProject;
  onClose: () => void;
  mutate: () => Promise<void>;
}) => {
  const user = useUser();
  const form = useForm<IProject>({
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      files: [],
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty },
  } = form;

  const createProject = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const date = new Date();

    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, description }])
      .select<"*", IProject>();
    if (error) throw error?.message;
    const idProject = data?.at(0)?.id;

    const { error: errorPPU } = await supabase
      .from("projectPerUser")
      .insert([{ date, idProject, idUser: user?.id }])
      .select();
    if (errorPPU) throw errorPPU?.message;
    return idProject;
  };

  const updateProject = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    const { error } = await supabase
      .from("projects")
      .update({ title, description })
      .eq("id", project?.id)
      .select<"*", IProject>();
    if (error) throw error?.message;
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("filesproject")
      .upload(path, file);

    if (error) throw error.message;

    return data;
  };

  const createFileInBd = async ({
    url,
    name,
  }: {
    url: string;
    name: string;
  }) => {
    const { data, error } = await supabase
      .from("files")
      .insert([{ url, name }])
      .select<"*", IFile>();
    if (error) throw error.message;
    return data.at(0)?.id;
  };

  const createFilePerProject = async ({
    idFile,
    idProject,
  }: {
    idFile: number;
    idProject: string;
  }) => {
    const { data, error } = await supabase
      .from("filePerProject")
      .insert([{ idFile, idProject }])
      .select<"*", { id: number }>();
    if (error) throw error.message;
    return data.at(0)?.id;
  };

  const uploadFiles = async ({
    files,
    idProject,
  }: {
    files: IProject["files"];
    idProject: string;
  }) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!("id" in file)) {
        const fileName = `${Date.now()}-${file.name}`;
        const uploadedFile = await uploadFile(file, fileName);
        const idFile = await createFileInBd({
          url: uploadedFile.fullPath,
          name: fileName,
        });
        if (!idFile) throw `Error al subir el archivo: ${file.name}`;
        const filePerProject = await createFilePerProject({
          idFile,
          idProject,
        });
        if (!filePerProject) throw `Error al crear el archivo por proyecto`;
      }
    }
  };
  const onSubmit = async ({ title, description, files }: IProject) => {
    try {
      let text = "";
      if (!!project) {
        await updateProject({ title, description });
        await uploadFiles({ files, idProject: project.id?.toString() ?? "" });
        text = "Proyecto editado exitosamente";
      } else {
        const idProject = await createProject({ title, description });
        if (!idProject) throw "Error al crear el proyecto";
        await uploadFiles({ files, idProject: idProject.toString() });
        text = "Proyecto creado exitosamente";
      }
      await mutate();
      customToast({
        text,
        variant: "success",
      });
      onClose();
    } catch (error) {
      customToast({
        text: `Ocurrió un error: ${error}`,
        variant: "error",
      });
    }
  };

  const canEdit =
    user?.type === USER_TYPES.MANAGER ||
    (user?.type === USER_TYPES.CLIENT && !project);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md bg-white p-4 rounded-md shadow-2xl"
      >
        <FormField
          control={control}
          name="title"
          rules={{ required: "Este campo es requerido" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Proyecto</FormLabel>
              <FormControl>
                <Input
                  disabled={!canEdit}
                  placeholder="Nombre de tu proyecto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          rules={{ required: "Este campo es requerido" }}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  disabled={!canEdit}
                  placeholder="Quiero el diseño de una plataforma ..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!!project?.files.length && (
          <Carousel className="w-4/5 justify-self-center">
            <CarouselContent>
              {project?.files?.map((f, i) => {
                const file = "url" in f ? f : undefined;
                if (!file) return;
                return (
                  <CarouselItem key={`${file.url} ${i}`}>
                    <Image
                      alt={file.name}
                      className="rounded h-full"
                      src={`${BUCKET}/${file.url}`}
                      width={1000}
                      height={1000}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious type="button" />
            <CarouselNext type="button" />
          </Carousel>
        )}

        {canEdit && (
          <FormField
            control={control}
            rules={{
              validate: (files) => {
                if (!files?.length) return "Debes subir al menos un archivo";
              },
            }}
            name="files"
            render={({ field: { onChange, onBlur, ref, name } }) => (
              <FormItem>
                <FormLabel>Archivos</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    disabled={!canEdit}
                    multiple
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      onChange(e.target.files ?? []);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {user?.type !== USER_TYPES.DESIGNER && (
          <Button
            type="submit"
            variant="grayola"
            disabled={isSubmitting || !isDirty}
            className="w-full flex flex-row items-center gap-2"
          >
            {user?.type === USER_TYPES.CLIENT ? "Guardar" : "Actualizar"}
            {isSubmitting && <Loader />}
          </Button>
        )}
      </form>
    </Form>
  );
};
