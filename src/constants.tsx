import React from 'react';
import { Layout, Server, Smartphone } from 'lucide-react';

// Faqat dizayn uchun kerak bo'lgan statik ikonkalarni qoldiramiz.
// Barcha ma'lumotlar (Postlar, Loyihalar, Skillar) endi Firebase'dan keladi.

export const SERVICES = [
  { icon: <Layout className="w-6 h-6" />, title: "Frontend Development", desc: "Building modern, responsive, and interactive user interfaces." },
  { icon: <Server className="w-6 h-6" />, title: "Backend Development", desc: "Creating fast, secure, and scalable API systems." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile Apps", desc: "Developing cross-platform mobile applications using React Native." },
];
