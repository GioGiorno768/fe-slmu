"use client";

import { useState, useEffect } from "react";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface CreateAdminCardProps {
  onCreate: (data: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }) => Promise<boolean>;
  isCreating: boolean;
}

export default function CreateAdminCard({
  onCreate,
  isCreating,
}: CreateAdminCardProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }

    // Call onCreate
    const success = await onCreate({
      username,
      email,
      password,
      name: username, // Use username as name
    });

    if (success) {
      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border shadow-sm overflow-hidden",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-bluelight to-blue-600 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-[2.4em] font-bold text-white">
              Create New Admin
            </h2>
            <p className="text-blue-100 text-[1.4em] mt-1">
              Add a new administrator to manage the platform
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Error Message */}
        {error && (
          <div
            className={clsx(
              "border rounded-lg p-4 text-[1.4em]",
              isDark
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-red-50 border-red-200 text-red-700"
            )}
          >
            {error}
          </div>
        )}

        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className={clsx(
              "block text-[1.4em] font-semibold mb-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={clsx(
              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight transition-all text-[1.4em]",
              isDark
                ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                : "border-gray-200"
            )}
            placeholder="admin_username"
            disabled={isCreating}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className={clsx(
              "block text-[1.4em] font-semibold mb-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={clsx(
              "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight transition-all text-[1.4em]",
              isDark
                ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                : "border-gray-200"
            )}
            placeholder="admin@shortlink.com"
            disabled={isCreating}
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className={clsx(
              "block text-[1.4em] font-semibold mb-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={clsx(
                "w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight transition-all text-[1.4em]",
                isDark
                  ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                  : "border-gray-200"
              )}
              placeholder="Minimum 8 characters"
              disabled={isCreating}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className={clsx(
              "block text-[1.4em] font-semibold mb-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={clsx(
                "w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight transition-all text-[1.4em]",
                isDark
                  ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                  : "border-gray-200"
              )}
              placeholder="Re-enter password"
              disabled={isCreating}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className={clsx(
            "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-[1.4em]",
            isCreating
              ? "bg-gray-300 cursor-not-allowed"
              : isDark
              ? "bg-bluelight hover:bg-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl"
              : "bg-bluelight hover:bg-bluelight/90 shadow-lg shadow-blue-200 hover:shadow-xl"
          )}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Admin...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Admin
            </>
          )}
        </button>
      </form>
    </div>
  );
}
