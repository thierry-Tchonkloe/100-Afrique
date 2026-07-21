"use client";

import React, { useState } from "react";
import { Mail, Loader2, X, Check, AlertCircle } from "lucide-react";
 import { MissiveMark } from '@/components/icons/CustomIcons';
import api from "@/lib/api";
import { AxiosError } from "axios";

interface ApiErrorResponse { message?: string; }

function useNewsletter() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      await api.post("/newsletter/subscribe", { email, source: "topbar", type: "general" });
      setStatus("success");
      setEmail("");
      setTimeout(() => { setStatus("idle"); setIsOpen(false); }, 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const msg = axiosError.response?.data?.message;
      if (axiosError.response?.status === 400) setErrorMessage(msg || "Email déjà inscrit.");
      else if (axiosError.response?.status === 500) setErrorMessage("Erreur serveur.");
      else if (!axiosError.response) setErrorMessage("Problème de connexion.");
      else setErrorMessage(msg || "Une erreur est survenue.");
      setStatus("error");
      setTimeout(() => { setStatus("idle"); setErrorMessage(""); }, 5000);
    }
  };

  const handleClose = () => { setIsOpen(false); setEmail(""); setStatus("idle"); setErrorMessage(""); };

  return { isOpen, setIsOpen, email, setEmail, status, errorMessage, handleSubmit, handleClose };
}

export default function NewsletterButton() {
  const { isOpen, setIsOpen, email, setEmail, status, errorMessage, handleSubmit, handleClose } = useNewsletter();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all hover:shadow-md active:scale-95"
        style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <MissiveMark size={16} strokeWidth={1.5} />
        Newsletter
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.95)', width: '280px' }}
    >
      {status === "success" ? (
        <div className="flex items-center gap-2 text-sm font-semibold w-full px-1" style={{ color: '#1A5C43' }}>
          <Check size={16} strokeWidth={2.5} />
          <span>Inscription réussie !</span>
        </div>
      ) : status === "error" ? (
        <div className="flex items-center gap-2 text-xs font-medium w-full px-1" style={{ color: '#B85C38' }}>
          <AlertCircle size={14} />
          <span className="flex-1 truncate">{errorMessage}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
          <MissiveMark size={16} className="text-gray-400 shrink-0" strokeWidth={1.5} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email…"
            required
            disabled={status === "loading"}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm placeholder:text-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
            style={{ background: '#1A5C43' }}
          >
            {status === "loading" ? <><Loader2 size={12} className="animate-spin" />Envoi…</> : "OK"}
          </button>
        </form>
      )}

      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 shrink-0"
        aria-label="Fermer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
