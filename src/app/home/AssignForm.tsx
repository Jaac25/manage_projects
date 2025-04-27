import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customToast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase";
import { IProject } from "@/types/project";
import { IUser } from "@/types/user";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IFormDesigner {
  designerId: string;
}
export const AssignForm = ({
  project,
  onClose,
  mutate,
}: {
  project?: IProject;
  onClose: () => void;
  mutate: () => Promise<void>;
}) => {
  const form = useForm<IFormDesigner>({
    defaultValues: { designerId: project?.designer?.id?.toString() ?? "" },
  });
  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  const [designers, setDesigners] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const designerId = watch("designerId");

  useEffect(() => {
    async function getDesigners() {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(
          `
            id,
            email,
            firstName,
            lastName,
            type
          `
        )
        .eq("type", 3);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setDesigners((data as unknown as []) || []);
      }
      setLoading(false);
    }
    getDesigners();
  }, []);

  const onSubmit = async ({ designerId }: IFormDesigner) => {
    try {
      let text = "";
      if (!!project?.designer.id) {
        const { error } = await supabase
          .from("designerPerProject")
          .update({ idUser: designerId })
          .eq("id", project.designer.idDesignPerProject)
          .select<"*", IUser>();
        if (error) throw error.message;
        await mutate();
        text = "Diseñador Actualizado exitosamente";
      } else {
        const { error } = await supabase
          .from("designerPerProject")
          .insert([{ idProject: project?.id, idUser: designerId }])
          .select<"*", IUser>();
        if (error) throw error.message;
        text = "Diseñador Asignado Exitosamente";
      }

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

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 grid w-full max-w-md bg-white p-4 rounded-md shadow-2xl"
      >
        <FormField
          control={control}
          rules={{
            required: "Este campo es requerido",
          }}
          name="designerId"
          render={({ field: { onChange, ...field } }) => (
            <FormItem className="">
              <FormLabel>Diseñador: </FormLabel>
              <FormControl>
                {loading ? (
                  <div className="w-full h-9 flex justify-center items-center bg-gray-200 rounded-md animate-pulse">
                    Cargando información...
                  </div>
                ) : (
                  <Select
                    disabled={loading || !designers.length}
                    onValueChange={(value) => onChange(value)}
                    {...field}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el diseñador" />
                    </SelectTrigger>
                    <SelectContent>
                      {designers.map(({ id, firstName, lastName }, i) => (
                        <SelectItem
                          key={`${id} ${i}`}
                          value={id?.toString() ?? ""}
                        >{`${firstName} ${lastName}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="grayola"
          disabled={isSubmitting || !designerId || !isDirty}
          className="w-full flex flex-row items-center gap-2"
        >
          Asignar {isSubmitting && <Loader />}
        </Button>
      </form>
    </Form>
  );
};
