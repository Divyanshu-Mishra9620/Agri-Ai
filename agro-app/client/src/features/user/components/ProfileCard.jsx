import React from 'react';
import useTranslation from '../../../hooks/useTranslation';

export default function ProfileCard({ label, value }) {
  const t = useTranslation();
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t(label)}</label>
      <p className="text-lg text-gray-800 font-medium">{value}</p>
    </div>
  );
}
