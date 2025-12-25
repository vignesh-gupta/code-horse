"use client";

import PageHeader from "@/components/page-header";
import ProfileForm from "@/modules/settings/components/profile-form";
import RepositoryList from "@/modules/settings/components/repository-list";

const SettingsPage = () => {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Settings"
        description="Manage your account setting and connected repositories"
      />

      <ProfileForm />
      <RepositoryList />
    </div>
  );
};

export default SettingsPage;
