import { ComponentExample } from "@/components/component-example";
import { requireAuth } from "@/modules/auth/lib/utils";

const HomePage = async () => {
  await requireAuth();
  return <ComponentExample />;
};

export default HomePage;
