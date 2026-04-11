"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import AuthGuard from "@/components/AuthGuard";

interface UserSettings {
  id: string;
  name: string;
  email: string;
  job: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications" | "security">("profile");
  const [settings, setSettings] = useState<UserSettings>({
    id: "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    job: "",
  });
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    job: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query { users { id name email job } }`,
        }),
      });
      const { data } = await res.json();
      const currentUser = data.users.find((u: any) => u.email === session?.user?.email);
      if (currentUser) {
        setSettings(currentUser);
        setFormData((prev) => ({
          ...prev,
          name: currentUser.name,
          email: currentUser.email,
          job: currentUser.job || "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation UpdateUser($id: String!, $name: String!, $job: String) {
            updateUser(id: $id, data: { name: $name, job: $job }) { id name email job }
          }`,
          variables: { id: settings.id, name: formData.name, job: formData.job },
        }),
      });
      const { data, errors } = await res.json();
      if (errors) {
        setSaveMessage("✗ Failed to save profile");
      } else if (data.updateUser) {
        setSettings(data.updateUser);
        setSaveMessage("✓ Profile saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage("✗ Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!formData.currentPassword) {
      setSaveMessage("✗ Please enter your current password");
      return;
    }
    if (!formData.newPassword) {
      setSaveMessage("✗ Please enter a new password");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveMessage("✗ Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      setSaveMessage("✗ Password must be at least 6 characters");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation ChangePassword($id: String!, $currentPassword: String!, $newPassword: String!) {
            changeUserPassword(id: $id, currentPassword: $currentPassword, newPassword: $newPassword) { id name }
          }`,
          variables: { 
            id: settings.id, 
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword 
          },
        }),
      });
      const { data, errors } = await res.json();
      if (errors) {
        setSaveMessage("✗ " + (errors[0]?.message || "Failed to update password"));
      } else if (data.changeUserPassword) {
        setSaveMessage("✓ Password changed successfully!");
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setSaveMessage("✗ Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <LayoutWithSidebar>
          <div className="p-8"><p className="text-gray-400">Loading settings...</p></div>
        </LayoutWithSidebar>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <LayoutWithSidebar>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-white">⚙️ Settings</h1>
            <p className="text-gray-400 mb-8">Manage your account and preferences</p>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-700 overflow-x-auto">
              {(["profile", "preferences", "notifications", "security"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold transition border-b-2 whitespace-nowrap ${
                    activeTab === tab ? "text-blue-400 border-blue-400" : "text-gray-400 border-transparent hover:text-white"
                  }`}
                >
                  {tab === "profile" && "👤 Profile"}
                  {tab === "preferences" && "🎨 Preferences"}
                  {tab === "notifications" && "🔔 Notifications"}
                  {tab === "security" && "🔒 Security"}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-gray-700 border border-gray-600 text-gray-400 px-4 py-3 rounded-lg cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Job Title</label>
                    <input
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleInputChange}
                      placeholder="e.g., Project Manager"
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  {saveMessage && (
                    <p className={`font-semibold ${saveMessage.includes("✓") ? "text-green-400" : "text-red-400"}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Display Preferences</h2>
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">💡 Preferences will be saved automatically in future updates</p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">💡 Notification settings will be saved automatically in future updates</p>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 font-semibold mb-2">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                          className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-2">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your new password"
                          className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your new password"
                          className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <button
                        onClick={handleSavePassword}
                        disabled={isSaving}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                      >
                        {isSaving ? "Updating..." : "Update Password"}
                      </button>
                      {saveMessage && (
                        <p className={`font-semibold ${saveMessage.includes("✓") ? "text-green-400" : "text-red-400"}`}>
                          {saveMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutWithSidebar>
    </AuthGuard>
  );
}
