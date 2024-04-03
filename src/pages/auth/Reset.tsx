import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { auth } from "@/services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

type ResetSchema = z.infer<typeof resetSchema>;

export function Reset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
  });

  const navigate = useNavigate();

  async function handleReset(data: ResetSchema) {
    try {
      await sendPasswordResetEmail(auth, data.email).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

  return (
    <div className="p-6 max-w-4xl h-screen mx-auto space-y-10 items-center content-center text-center">
      <h1 className="text-5xl font-bold text-white">Forgot Password</h1>
      <form
        onSubmit={handleSubmit(handleReset)}
        className="flex flex-col space-y-5 justify-center items-center"
      >
        <Input
          type="email"
          {...register("email")}
          className="border-2 border-gray-300 rounded-sm p-2 w-full md:w-96 text-white"
          autoComplete="off"
          required
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <Button type="submit" className="w-full md:w-96">
          Send Email
        </Button>
      </form>
    </div>
  );
}
