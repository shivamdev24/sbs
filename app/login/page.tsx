// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// type FormData = {
//   email: string;
//   password: string;
// };

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);

//     // simulate API call
//     await new Promise((res) => setTimeout(res, 1500));

//     console.log("Login Data:", data);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 ">
//       <Card className="w-full max-w-md shadow-xl rounded-2xl ">
//         <CardHeader className="space-y-2 text-center">
//           <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
//           <CardDescription>
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <CardContent className="space-y-6">
//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\S+@\S+\.\S+$/,
//                     message: "Enter a valid email",
//                   },
//                 })}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password">Password</Label>
//                 <button
//                   type="button"
//                   className="text-sm text-muted-foreground hover:underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <div className="relative mb-6">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Minimum 6 characters",
//                     },
//                   })}
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {errors.password && (
//                 <p className="text-sm text-red-500">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//           </CardContent>

//           <CardFooter className="flex flex-col gap-3">
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <Loader2 className="animate-spin" size={16} />
//                   Logging in...
//                 </span>
//               ) : (
//                 "Login"
//               )}
//             </Button>

//             {/* <Button type="button" variant="outline" className="w-full">
//               Continue with Google
//             </Button> */}

//             <p className="text-sm text-muted-foreground text-center">
//               Don’t have an account?{" "}
//               <span className="underline cursor-pointer">Sign up</span>
//             </p>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }




import { CommandIcon } from "lucide-react";

import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

import LoginImage from "@/app/img/sbs-login.jpg";

export default function LoginPage() {
  



  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="relative hidden bg-muted lg:block col-span-2">
        <Image
          src={LoginImage}
          width={1000}
          height={1000}

          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CommandIcon className="size-4" />
            </div>
            Salon Booking Sys.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center col-span-1">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
