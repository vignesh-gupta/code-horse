"use client";

import { signIn } from "@/modules/auth/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthPage, Testimonial } from "./auth-page";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
  },
];

const RegisterUI = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await signIn.social({
        provider: "github",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("[REGISTER_ERR]", error);
      toast.error("Failed to sign up with GitHub. Please try again.");
    }
    setIsLoading(false);
  };

  const handleSwitchToLogin = () => {
    router.push("/login");
  };

  return (
    <AuthPage
      mode="signup"
      heroImageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=2160&q=80"
      testimonials={sampleTestimonials}
      formPosition="left"
      isLoading={isLoading}
      onGitHubSignIn={handleGitHubSignUp}
      onSwitchMode={handleSwitchToLogin}
    />
  );
};

export default RegisterUI;
