import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { UserAuth } from "@/contexts/Auth";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { login } = UserAuth();

  async function handleLogin(data: LoginSchema) {
    try {
      await login(data.email, data.password).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  function handleForgotPassword() {
    navigate("/forgot-password");
  }

  function handleRegister() {
    navigate("/register");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-white mb-10 text-center">
        Audio Studio
      </h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col items-center space-y-5"
      >
        <Input
          type="email"
          {...register("email")}
          className="border-2 border-gray-300 rounded-sm p-2 w-full md:w-96 text-white"
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
          placeholder="Password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <div className="flex flex-wrap space-x-6 w-full justify-between">
          <Button
            type="button"
            onClick={handleRegister}
            className="p-0 text-white"
            variant="link"
          >
            Create an account
          </Button>
          <Button
            type="button"
            onClick={handleForgotPassword}
            className="p-0 text-white"
            variant="link"
          >
            Forgot password?
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full text-lg font-medium p-6"
          variant="secondary"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
