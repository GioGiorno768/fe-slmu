"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Link as LinkIcon,
  Mail,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Send,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface FormData {
  url: string;
  reason: string;
  email: string;
  details: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ReportAbuseForm() {
  const t = useTranslations("Landing.ReportAbuse.form");
  const [formData, setFormData] = useState<FormData>({
    url: "",
    reason: "",
    email: "",
    details: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url: formData.url,
          reason: formData.reason,
          email: formData.email || undefined,
          details: formData.details || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || t("successMessage"));
        setFormData({ url: "", reason: "", email: "", details: "" });
      } else {
        setStatus("error");
        setMessage(data.message || t("errorMessage"));
      }
    } catch (error) {
      console.error("Report submission error:", error);
      setStatus("error");
      setMessage(t("connectionError"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success/Error Alert */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 mb-6"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm">{message}</p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-6"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm">{message}</p>
        </motion.div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
      >
        {/* Link URL */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {t("urlLabel")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LinkIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full py-3 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bluelanding/30 focus:border-bluelanding transition-all"
              placeholder={t("urlPlaceholder")}
              required
              disabled={status === "loading"}
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {t("reasonLabel")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <ShieldAlert className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full py-3 pl-12 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bluelanding/30 focus:border-bluelanding transition-all appearance-none"
              required
              disabled={status === "loading"}
            >
              <option value="" disabled>
                {t("reasonPlaceholder")}
              </option>
              <option value="phishing">{t("reasons.phishing")}</option>
              <option value="malware">{t("reasons.malware")}</option>
              <option value="spam">{t("reasons.spam")}</option>
              <option value="illegal_content">
                {t("reasons.illegalContent")}
              </option>
              <option value="copyright">{t("reasons.copyright")}</option>
              <option value="other">{t("reasons.other")}</option>
            </select>
            <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {t("emailLabel")}{" "}
            <span className="text-slate-400 font-normal">
              {t("emailOptional")}
            </span>
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-3 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bluelanding/30 focus:border-bluelanding transition-all"
              placeholder={t("emailPlaceholder")}
              disabled={status === "loading"}
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {t("detailsLabel")}{" "}
            <span className="text-slate-400 font-normal">
              {t("detailsOptional")}
            </span>
          </label>
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            <textarea
              id="details"
              name="details"
              rows={4}
              value={formData.details}
              onChange={handleChange}
              className="w-full py-3 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bluelanding/30 focus:border-bluelanding transition-all resize-none"
              placeholder={t("detailsPlaceholder")}
              disabled={status === "loading"}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-bluelanding text-white font-medium py-3.5 px-6 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t("submitButton")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
