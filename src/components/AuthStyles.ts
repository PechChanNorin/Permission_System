/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AuthStyles Configuration
 * Edit these Tailwind classes to fully change the design, colors, margins,
 * and layout of the Sign-In/Register screen, without touching the core functions.
 */
export const AuthStyles = {
  // Main Container
  wrapper: "min-h-[100vh] bg-slate-100 flex items-center justify-center p-4 py-12",
  card: "max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 min-h-[600px]",

  // Left Branding Panel
  branding: {
    panel: "md:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-10 text-white flex flex-col justify-between relative overflow-hidden",
    glowTop: "absolute top-0 right-0 w-80 h-80 bg-indigo-400 rounded-full blur-3xl transform translate-x-24 -translate-y-12 opacity-30",
    glowBottom: "absolute -bottom-16 -left-16 w-64 h-64 bg-sky-400 rounded-full blur-3xl opacity-20",
    logoContainer: "bg-white/10 border border-white/20 p-2 rounded-2xl w-fit mb-8",
    logoChar: "font-black text-3xl tracking-wider px-3 text-white",
    heading: "text-2xl font-extrabold tracking-tight text-white leading-tight",
    description: "text-indigo-100/90 text-sm mt-3",
    featureList: "space-y-5 text-sm text-indigo-50 my-10",
    featureRow: "flex gap-3 items-start",
    featureCheckIcon: "w-6 h-6 text-sky-300 shrink-0 mt-0.5",
    featureText: "text-indigo-50/90",
    footerText: "text-[11px] text-indigo-300 font-mono font-bold tracking-widest"
  },

  // Right Interaction Panel
  interaction: {
    panel: "md:col-span-7 p-10 md:p-14 flex flex-col justify-center bg-white",
    tabContainer: "flex border-b border-slate-100 pb-2.5 mb-8 gap-3",
    tabButtonActive: "pb-2.5 text-xs font-black uppercase px-4 border-b-2 border-indigo-600 text-indigo-600 cursor-pointer",
    tabButtonInactive: "pb-2.5 text-xs font-black uppercase px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200 cursor-pointer",
    errorBanner: "p-4 bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold rounded-2xl mb-6 flex items-center gap-3",
    formContainer: "space-y-5",
    fieldGroup: "space-y-2",
    label: "block text-slate-600 text-xs font-bold uppercase tracking-wider pl-1",
    input: "w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 shadow-sm transition-all",
    inputMono: "w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-900 font-mono focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 shadow-sm transition-all",
    select: "w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 shadow-sm transition-all cursor-pointer",
    gridTwoCols: "grid grid-cols-2 gap-4",
    submitButton: "w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
  }
};
