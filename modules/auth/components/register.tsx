"use client";

import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
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

  const handleGitHubSignUp = async () => {
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("[REGISTER_ERR]", error);
    }
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
      onGitHubSignIn={handleGitHubSignUp}
      onSwitchMode={handleSwitchToLogin}
    />
  );
};

export default RegisterUI;
