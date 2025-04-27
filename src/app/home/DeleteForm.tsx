import { Button } from "@/components/ui/button";
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
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase";
import { IProject } from "@/types/project";
import { USER_TYPES } from "@/types/user";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  deleteWord: string;
}
export const DeleteForm = ({
  project,
  onClose,
  mutate,
}: {
  project?: IProject;
  onClose: () => void;
  mutate: () => Promise<void>;
}) => {
  const user = useUser();

  const [show, setShow] = useState(false);
  const onSubmit = async ({ deleteWord }: IForm) => {
    try {
      let text = "";
      if (!!project?.id) {
        const { data, error } = await supabase
          .from("projects")
          .update({ deleted: true })
          .eq("id", project.id)
          .select<"*", IProject>();
        if (error) throw error.message;
        await mutate();
        text = "Proyecto borrado exitosamente";
      }
      onClose();
      customToast({
        text,
        variant: "success",
      });
      setShow(false);
    } catch (error) {
      customToast({
        text: `Ocurrió un error: ${error}`,
        variant: "error",
      });
    }
  };

  const form = useForm<IForm>({ defaultValues: { deleteWord: "" } });

  const { control, watch, handleSubmit } = form;
  const deleteWord = watch("deleteWord");

  return (
    <div className="space-y-6 flex justify-center w-full max-w-md bg-white p-4 rounded-md shadow-2xl">
      {user?.type === USER_TYPES.MANAGER && !show && (
        <Button variant="destructive" onClick={() => setShow(true)}>
          Eliminar Proyecto
        </Button>
      )}
      {show && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2"
          >
            <FormField
              control={control}
              name="deleteWord"
              rules={{ required: "Este campo es requerido" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Escribe la palabra
                    <span className="font-bold">Eliminar</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Escribe la palabra eliminar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => setShow(false)}
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button disabled={deleteWord !== "Eliminar"} variant="destructive">
              Confirmar
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
