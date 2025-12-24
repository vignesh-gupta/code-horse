"use client";

import ProfileForm from "@/modules/settings/components/profile-form";
import RepositoryList from "@/modules/settings/components/repository-list";

const SettingsPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="to-muted-foreground">
          Manage your account setting and connected repositories
        </p>
      </div>

      <ProfileForm />
      <RepositoryList />
    </div>
  );
};

export default SettingsPage;
