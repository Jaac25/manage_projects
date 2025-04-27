"use client";

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
import { Input } from "@/components/ui/input";
import { customToast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase";
import { IUser } from "@/types/user";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface IForm {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { push } = useRouter();

  const form = useForm<IForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const onSubmit = async ({ email, password }: IForm) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      let { data: infousers } = await supabase
        .from("users")
        .select<"*", IUser>("*")
        .eq("email", data.user?.email);
      const infoUser = infousers?.at(0);
      if (!!infoUser) {
        localStorage.setItem("u", JSON.stringify(infoUser));
        customToast({
          text: !error ? "¡Bienvenido!" : error.message,
          variant: "success",
        });
        push("/home");
      } else {
        customToast({
          text: !error ? "Credenciales incorrectas" : error.message,
          variant: "error",
        });
      }
    } catch (error) {
      console.log("Error login", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md bg-white p-4 rounded-md shadow-2xl"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="tucorreo@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="grayola"
          disabled={isSubmitting}
          className="w-full flex flex-row items-center gap-2"
        >
          Iniciar sesión {isSubmitting && <Loader />}
        </Button>
      </form>
    </Form>
  );
}
