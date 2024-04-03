import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { UserAuth } from "@/contexts/Auth";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();
  const { create } = UserAuth();

  async function handleRegister(data: RegisterSchema) {
    try {
      await create(data.email, data.password).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  return (
    <div className="p-6 max-w-4xl h-screen mx-auto space-y-10 items-center content-center text-center">
      <h1 className="text-5xl font-bold text-white">Register</h1>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col space-y-5 justify-center items-center"
      >
        <Input
          {...register("email")}
          className="border-2 border-gray-300 rounded-sm p-2 w-full md:w-96 text-white"
          autoComplete="off"
          required
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <Input
          type="password"
          {...register("password")}
          className="border-2 border-gray-300 rounded-sm p-2 w-full md:w-96 text-white"
          autoComplete="off"
          required
          placeholder="Senha"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <Button type="submit" className="w-full md:w-96">
          Criar conta
        </Button>
      </form>
    </div>
  );
}
