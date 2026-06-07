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
  wrapper: "min-h-[100vh] bg-slate-50 flex items-center justify-center p-4 py-12",
  card: "max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200/80 min-h-[550px]",

  // Left Branding Panel
  branding: {
    panel: "md:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-8 text-white flex flex-col justify-between relative overflow-hidden",
    glowTop: "absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-3xl transform translate-x-24 -translate-y-12 opacity-40",
    glowBottom: "absolute -bottom-12 -left-12 w-48 h-48 bg-sky-300 rounded-full blur-3xl opacity-20",
    logoContainer: "bg-white/10 border border-white/20 p-2 rounded-xl w-fit mb-6",
    logoChar: "font-black text-2xl tracking-wider px-2 text-white",
    heading: "text-xl font-extrabold tracking-tight text-white",
    description: "text-indigo-200/95 text-xs mt-2",
    featureList: "space-y-4 text-xs text-indigo-100 my-8",
    featureRow: "flex gap-2 items-start",
    featureCheckIcon: "w-5 h-5 text-sky-300 shrink-0 mt-0.5",
    featureText: "text-indigo-100/90",
    footerText: "text-[10px] text-indigo-300/80 font-mono font-semibold"
  },

  // Right Interaction Panel
  interaction: {
    panel: "md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white",
    tabContainer: "flex border-b border-slate-100 pb-2.5 mb-6 gap-3",
    tabButtonActive: "pb-2.5 text-xs font-extrabold uppercase px-4 border-b-2 border-indigo-600 text-indigo-600 cursor-pointer",
    tabButtonInactive: "pb-2.5 text-xs font-extrabold uppercase px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200 cursor-pointer",
    errorBanner: "p-3 bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-medium rounded-xl mb-4 flex items-center gap-2",
    formContainer: "space-y-4",
    fieldGroup: "space-y-1.5",
    label: "block text-slate-500 text-[10px] font-bold uppercase tracking-wider",
    input: "w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
    inputMono: "w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
    select: "w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer",
    gridTwoCols: "grid grid-cols-2 gap-4",
    submitButton: "w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
  }
};
