'use client';
// src/components/emploi/auth/AuthSocialRow.tsx
import { SocialButton, LinkedinIcon, GoogleIcon } from './SocialButton';

export default function AuthSocialRow({ label = 'Ou continuer avec' }: { label?: string }) {
  return (
    <>
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
          {label}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="LinkedIn" icon={<LinkedinIcon />} />
        <SocialButton label="Google" icon={<GoogleIcon />} />
      </div>
    </>
  );
}
