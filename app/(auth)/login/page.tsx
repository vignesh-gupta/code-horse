import LoginUI from "@/modules/auth/components/login";
import { requireUnAuth } from "@/modules/auth/lib/utils";

const LoginPage = async () => {
  await requireUnAuth();

  return <LoginUI />;
};

export default LoginPage;
