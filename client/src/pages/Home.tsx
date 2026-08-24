/**
 * Style reminder — «غرفة عمليات مالية»: editorial Arabic data hierarchy, asymmetric rail,
 * strong petroleum accents, and restrained status colors. Do not dilute it with generic cards.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpenCheck,
  ChevronDown,
  ChevronLeft,
  CircleDollarSign,
  Download,
  FileText,
  Landmark,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

type NavKey = "dashboard" | "portfolios" | "accounts" | "transactions" | "reports";
type Currency = "ILS" | "USD";

type Movement = {
  id: number;
  title: string;
  category: string;
  account: string;
  amount: number;
  kind: "income" | "expense" | "transfer";
  date: string;
  status: "منشورة" | "مسودة";
};

const navigation: { key: NavKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { key: "portfolios", label: "المحافظ", icon: WalletCards },
  { key: "accounts", label: "الحسابات", icon: Landmark },
  { key: "transactions", label: "الحركات", icon: BookOpenCheck },
  { key: "reports", label: "التقارير", icon: BarChart3 },
];

const trendData = [
  { label: "أب", value: 69800 },
  { label: "أيل", value: 72500 },
  { label: "ت1", value: 71600 },
  { label: "ت2", value: 75200 },
  { label: "كان1", value: 78800 },
  { label: "كان2", value: 81500 },
  { label: "ينا", value: 84200 },
];

const seedMovements: Movement[] = [
  { id: 1, title: "راتب شهر يناير", category: "دخل", account: "البنك العربي", amount: 9800, kind: "income", date: "27 يناير 2025", status: "منشورة" },
  { id: 2, title: "تحويل إلى الادخار", category: "تحويل داخلي", account: "حساب الادخار", amount: 1500, kind: "transfer", date: "26 يناير 2025", status: "منشورة" },
  { id: 3, title: "مشتريات المنزل", category: "منزل", account: "Visa Platinum", amount: 460, kind: "expense", date: "25 يناير 2025", status: "منشورة" },
  { id: 4, title: "دفعة تأمين السيارة", category: "تنقّل", account: "البنك العربي", amount: 780, kind: "expense", date: "24 يناير 2025", status: "منشورة" },
  { id: 5, title: "مكافأة عمل", category: "دخل", account: "البنك العربي", amount: 1250, kind: "income", date: "22 يناير 2025", status: "مسودة" },
];

const formatMoney = (value: number, currency: Currency) => {
  const converted = currency === "USD" ? value / 3.65 : value;
  return new Intl.NumberFormat("ar", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "ILS" ? 0 : 2,
  }).format(converted);
};

function NavItem({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string;
  Icon: typeof LayoutDashboard;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-all duration-150 ease-out ${
        active
          ? "bg-[#0F5C5B] text-white shadow-[0_8px_20px_rgba(15,92,91,0.16)]"
          : "text-[#506663] hover:bg-[#E9F0EE] hover:text-[#0F5C5B]"
      }`}
    >
      <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.8} />
      <span className="font-medium">{label}</span>
      {active && <span className="mr-auto size-1.5 rounded-full bg-[#EEC66B]" />}
    </button>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "teal" | "sage" | "amber";
  icon: typeof CircleDollarSign;
}) {
  const tones = {
    teal: "border-[#B7D8D2] bg-[#F1F8F6] text-[#0F5C5B]",
    sage: "border-[#C7D7C2] bg-[#F4F8F1] text-[#52714E]",
    amber: "border-[#ECD8AC] bg-[#FFF9ED] text-[#A66919]",
  };
  return (
    <section className={`relative overflow-hidden rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="absolute inset-y-0 right-0 w-1 bg-current opacity-80" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium opacity-75"><span className="size-1.5 rounded-full bg-current" />{label}</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-[19px] font-extrabold tracking-tight" dir="ltr">
            {value}
          </p>
          <p className="mt-2 text-xs font-medium opacity-75">{hint}</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/75 shadow-sm">
          <Icon className="size-[18px]" strokeWidth={1.9} />
        </span>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: Movement["status"] }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${status === "منشورة" ? "bg-[#EDF6F2] text-[#317460]" : "bg-[#FFF6E2] text-[#A86C17]"}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function MovementIcon({ kind }: { kind: Movement["kind"] }) {
  if (kind === "income") return <ArrowDownLeft className="size-[17px] text-[#2D8A64]" />;
  if (kind === "expense") return <ArrowUpRight className="size-[17px] text-[#B6614B]" />;
  return <ArrowDownLeft className="size-[17px] rotate-90 text-[#3B7D9C]" />;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [currency, setCurrency] = useState<Currency>("ILS");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [movements, setMovements] = useState<Movement[]>(seedMovements);
  const [draft, setDraft] = useState({ title: "", amount: "", kind: "expense" as Movement["kind"] });

  const visibleMovements = useMemo(
    () => movements.filter((movement) => movement.title.includes(query) || movement.category.includes(query) || movement.account.includes(query)),
    [movements, query],
  );

  const totalIncome = movements.filter((item) => item.kind === "income" && item.status === "منشورة").reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = movements.filter((item) => item.kind === "expense" && item.status === "منشورة").reduce((sum, item) => sum + item.amount, 0);

  const addMovement = () => {
    const amount = Number(draft.amount);
    if (!draft.title.trim() || !amount || amount <= 0) {
      toast.error("أدخل وصفاً ومبلغاً موجباً للحركة.");
      return;
    }
    const category = draft.kind === "income" ? "دخل" : draft.kind === "transfer" ? "تحويل داخلي" : "مصروف متنوع";
    setMovements((current) => [
      {
        id: Date.now(),
        title: draft.title,
        category,
        account: draft.kind === "transfer" ? "حساب الادخار" : "البنك العربي",
        amount,
        kind: draft.kind,
        date: "اليوم",
        status: "منشورة",
      },
      ...current,
    ]);
    setDraft({ title: "", amount: "", kind: "expense" });
    setShowDialog(false);
    toast.success("تم ترحيل الحركة وتحديث الرصيد.");
  };

  const exportCsv = () => {
    const rows = [
      ["الوصف", "الفئة", "الحساب", "التاريخ", "الحالة", "المبلغ"],
      ...visibleMovements.map((item) => [item.title, item.category, item.account, item.date, item.status, String(item.amount)]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "حركات-محفظتي.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("تم تجهيز ملف CSV مطابق للحركات الظاهرة.");
  };

  const currentTitle = navigation.find((item) => item.key === activeNav)?.label ?? "نظرة عامة";

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#193331]" dir="rtl">
      <aside className={`fixed inset-y-0 right-0 z-40 flex w-[276px] flex-col border-l border-[#DCE8E3] bg-[#FFFEFB] px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-[#5F7773] hover:bg-[#EFF4F1] lg:hidden" aria-label="إغلاق القائمة">
            <X className="size-5" />
          </button>
          <div className="mr-auto flex items-center gap-2.5">
            <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[#E7F1EE] shadow-[inset_0_0_0_1px_rgba(15,92,91,.12)]"><img src="/manus-storage/mahfazati-brand-mark_cccbeeea.png" alt="رمز محفظتي" className="size-10 object-contain" /><span className="absolute -bottom-1 -left-1 size-2.5 rounded-full border-2 border-[#FFFEFB] bg-[#EEC66B]" /></span>
            <div>
              <div className="font-[family-name:var(--font-display)] text-[19px] font-extrabold leading-none tracking-tight text-[#0F5C5B]">محفظتي</div>
              <div className="mt-1 text-[10px] font-bold tracking-[0.17em] text-[#A66919]">M A H F A Z A T I</div>
            </div>
          </div>
        </div>

        <button className="mt-8 flex items-center justify-between rounded-2xl border border-[#D8E6E1] bg-[#F6FAF8] px-3 py-3 text-right hover:bg-[#EDF5F2]" onClick={() => toast.message("ستتم إدارة أفراد المساحة من شاشة الأشخاص قريباً.") }>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#D9EAE5] text-sm font-black text-[#0F5C5B]">م</span>
            <span>
              <span className="block text-xs font-bold text-[#254642]">مساحة محمود</span>
              <span className="mt-0.5 block text-[11px] text-[#66807A]">فضاء مالي عائلي</span>
            </span>
          </div>
          <ChevronDown className="size-4 text-[#66807A]" />
        </button>

        <nav className="mt-7 space-y-1.5" aria-label="التنقل الرئيسي">
          <p className="px-3 pb-2 text-[10px] font-extrabold tracking-[0.14em] text-[#8A9B96]">مركز المتابعة</p>
          {navigation.map((item) => (
            <NavItem
              key={item.key}
              label={item.label}
              Icon={item.icon}
              active={activeNav === item.key}
              onClick={() => { setActiveNav(item.key); setMobileOpen(false); }}
            />
          ))}
        </nav>

        <div className="mt-7 border-t border-[#E7EEEA] pt-5">
          <p className="px-3 pb-2 text-[10px] font-extrabold tracking-[0.14em] text-[#8A9B96]">إدارة المساحة</p>
          <NavItem label="الأشخاص والأعضاء" Icon={UsersRound} active={false} onClick={() => toast.message("يمكن دعوة أعضاء بصلاحيات محرّر أو قارئ في النسخة المرتبطة بالخادم.")} />
          <NavItem label="الإعدادات" Icon={Settings2} active={false} onClick={() => toast.message("إعدادات العملة وسعر الصرف ستكون قابلة للتحرير من هنا.")} />
        </div>

        <div className="mt-auto rounded-2xl bg-[#103F3E] p-4 text-white">
          <div className="flex items-center gap-2 text-[#EFCB74]"><ShieldCheck className="size-4" /><span className="text-xs font-bold">مساحة خاصة وآمنة</span></div>
          <p className="mt-2 text-xs leading-5 text-[#D3E4E1]">الأرصدة تُحتسب من القيود المنشورة، وليست أرقاماً يدوية.</p>
        </div>
      </aside>

      {mobileOpen && <button aria-label="تغطية القائمة" className="fixed inset-0 z-30 bg-[#18312E]/30 backdrop-blur-[1px] lg:hidden" onClick={() => setMobileOpen(false)} />}

      <main className="min-h-screen lg:mr-[276px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#E1EAE6] bg-[#F8F7F2]/92 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-[#DCE8E3] bg-white p-2 text-[#45635D] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="فتح القائمة"><Menu className="size-5" /></button>
            <div>
              <p className="text-xs font-medium text-[#7A908B]">الأربعاء، 29 يناير 2025</p>
              <h1 className="mt-0.5 text-lg font-extrabold text-[#193331]">{currentTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center rounded-xl border border-[#DCE8E3] bg-white p-1 sm:flex">
              {(["ILS", "USD"] as Currency[]).map((item) => (
                <button key={item} onClick={() => setCurrency(item)} className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${currency === item ? "bg-[#E7F1EE] text-[#0F5C5B]" : "text-[#78908B]"}`}>{item}</button>
              ))}
            </div>
            <button className="relative rounded-xl border border-[#DCE8E3] bg-white p-2.5 text-[#54716A] hover:bg-[#EFF5F2]" onClick={() => toast.message("لا توجد تنبيهات جديدة اليوم.")} aria-label="التنبيهات"><Bell className="size-4" /><span className="absolute left-2 top-2 size-1.5 rounded-full bg-[#C98025]" /></button>
            <button onClick={() => setShowDialog(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0F5C5B] px-3.5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(15,92,91,0.2)] transition hover:bg-[#0B4D4C] active:scale-[0.97] sm:px-4"><Plus className="size-4" /> <span className="hidden sm:inline">تسجيل حركة</span></button>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-7 lg:px-10 lg:py-8">
          {activeNav === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
              <section className="relative overflow-hidden rounded-[24px] bg-[#103F3E] px-5 py-6 text-white shadow-[0_20px_45px_rgba(16,63,62,0.16)] sm:px-7 sm:py-7">
                <img src="/manus-storage/mahfazati-portfolio-wave_c9166a2f.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-right opacity-55 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-l from-[#103F3E]/30 via-[#103F3E]/65 to-[#103F3E]" />
                <div className="relative grid gap-6 lg:grid-cols-[1fr_260px] lg:items-end">
                  <div>
                    <div className="flex items-center gap-2 text-[#EBC56E]"><span className="size-2 animate-pulse rounded-full bg-[#EBC56E]" /><span className="text-xs font-bold">لقطة موحّدة · حتى اليوم</span></div>
                    <p className="mt-4 text-sm font-medium text-[#C4DAD5]">صافي القيمة الحالي</p>
                    <div className="mt-1 flex flex-wrap items-end gap-3"><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" dir="ltr">{formatMoney(84200, currency)}</h2><span className="mb-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-[#BDE2D5]" dir="ltr">+ 4.8%</span></div>
                    <p className="mt-3 text-xs text-[#B7CEC9]">يشمل 4 محافظ و6 حسابات · سعر USD/ILS: <span dir="ltr">3.65</span></p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-[#0B3332]/55 p-4 backdrop-blur-sm">
                    <p className="text-xs text-[#B7CEC9]">أولوية هذا الأسبوع</p>
                    <p className="mt-1.5 text-sm font-bold leading-6">استكمال تصنيف 3 حركات وانتظار دفعة مستحقة.</p>
                    <button onClick={() => setActiveNav("transactions")} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#EBC56E] hover:text-white">استعراض الحركات <ChevronLeft className="size-3.5" /></button>
                  </div>
                </div>
              </section>

              <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="السيولة المتاحة" value={formatMoney(22340, currency)} hint="+ 1,240 خلال 30 يوماً" tone="teal" icon={WalletCards} />
                <MetricCard label="رصيد الادخار" value={formatMoney(35400, currency)} hint="42% من صافي القيمة" tone="sage" icon={Landmark} />
                <MetricCard label="المستحقات لك" value={formatMoney(5290, currency)} hint="دفعتان خلال 14 يوماً" tone="amber" icon={CircleDollarSign} />
                <MetricCard label="التزامات قادمة" value={formatMoney(3180, currency)} hint="حتى نهاية فبراير" tone="amber" icon={FileText} />
              </section>

              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
                <section className="rounded-2xl border border-[#E0EAE6] bg-white p-5 shadow-[0_8px_20px_rgba(32,66,60,0.035)]">
                  <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold">أداء صافي القيمة</p><p className="mt-1 text-xs text-[#78908B]">التقييم بالشيكل · آخر 7 أشهر</p></div><button onClick={() => setActiveNav("reports")} className="rounded-lg border border-[#DCE8E3] px-2.5 py-1.5 text-xs font-bold text-[#0F5C5B] hover:bg-[#EEF5F2]">تفاصيل التقرير</button></div>
                  <div className="mt-5 h-[250px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 12, right: 4, left: -20, bottom: 0 }}>
                        <defs><linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F5C5B" stopOpacity={0.26} /><stop offset="100%" stopColor="#0F5C5B" stopOpacity={0.01} /></linearGradient></defs>
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#829690", fontSize: 11 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#829690", fontSize: 11 }} tickFormatter={(value) => `${Math.round(value / 1000)}K`} />
                        <Tooltip formatter={(value: number) => [formatMoney(value, currency), "صافي القيمة"]} labelStyle={{ direction: "rtl", color: "#193331" }} contentStyle={{ borderRadius: 12, border: "1px solid #DCE8E3", boxShadow: "0 12px 24px rgba(32,66,60,.10)" }} />
                        <Area type="monotone" dataKey="value" stroke="#0F5C5B" strokeWidth={3} fill="url(#portfolioFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <section className="relative overflow-hidden rounded-[18px] border-r-4 border-[#0F5C5B] bg-[#F4F8F1] p-5">
                  <img src="/manus-storage/mahfazati-exchange-flow_5ee4d0df.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.17]" />
                  <div className="relative"><div className="flex items-center justify-between"><div><p className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F5C5B]"><span className="size-1.5 rounded-full bg-[#0F5C5B]" />نبض القرار</p><p className="mt-1 text-sm font-extrabold text-[#2B4D45]">تدفق يناير</p><p className="mt-1 text-xs text-[#6B837C]">الحركات المنشورة فقط</p></div><SlidersHorizontal className="size-4 text-[#658079]" /></div>
                  <div className="mt-6 space-y-5"><div><div className="flex justify-between text-xs font-bold"><span>الدخل</span><span dir="ltr" className="text-[#25725A]">{formatMoney(totalIncome, currency)}</span></div><div className="mt-2 h-2 rounded-full bg-[#DCE9DE]"><div className="h-full w-[78%] rounded-full bg-[#3C8B6D]" /></div></div><div><div className="flex justify-between text-xs font-bold"><span>المصروف</span><span dir="ltr" className="text-[#9B604D]">{formatMoney(totalExpense, currency)}</span></div><div className="mt-2 h-2 rounded-full bg-[#E5E9DD]"><div className="h-full w-[34%] rounded-full bg-[#B97857]" /></div></div></div>
                  <div className="mt-6 border-t border-[#D9E4D7] pt-4"><p className="text-xs text-[#6B837C]">صافي التدفق</p><p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#0F5C5B]" dir="ltr">{formatMoney(totalIncome - totalExpense, currency)}</p><div className="mt-4 border-t border-dashed border-[#D2DED0] pt-3"><p className="text-[11px] font-bold text-[#6B837C]">مستحق قريب</p><p className="mt-1 text-xs font-bold text-[#8A5A17]">دفعة بقيمة 1,800 ₪ خلال 4 أيام</p></div></div></div>
                </section>
              </div>

              <section className="mt-5 overflow-hidden rounded-2xl border border-[#E0EAE6] bg-white shadow-[0_8px_20px_rgba(32,66,60,0.035)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7EFEB] px-5 py-4"><div><h3 className="text-sm font-extrabold">آخر الحركات</h3><p className="mt-1 text-xs text-[#78908B]">سجل قابل للمراجعة من القيود المنشورة</p></div><button onClick={() => setActiveNav("transactions")} className="text-xs font-bold text-[#0F5C5B] hover:underline">كل الحركات</button></div><MovementTable items={movements.slice(0, 4)} currency={currency} compact /></section>
            </div>
          )}

          {activeNav === "transactions" && <TransactionsView currency={currency} query={query} setQuery={setQuery} movements={visibleMovements} onExport={exportCsv} onAdd={() => setShowDialog(true)} />}
          {activeNav === "reports" && <ReportsView currency={currency} onExport={exportCsv} />}
          {(activeNav === "portfolios" || activeNav === "accounts") && <ManagementView type={activeNav} currency={currency} onAdd={() => setShowDialog(true)} />}
        </div>
      </main>

      {showDialog && <TransactionDialog draft={draft} setDraft={setDraft} onClose={() => setShowDialog(false)} onSubmit={addMovement} />}
    </div>
  );
}

function MovementTable({ items, currency, compact = false }: { items: Movement[]; currency: Currency; compact?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-right"><thead className="bg-[#FAFCFB] text-[11px] font-bold text-[#8A9B96]"><tr><th className="px-5 py-3 font-bold">الحركة</th><th className="px-4 py-3 font-bold">الحساب</th><th className="px-4 py-3 font-bold">التاريخ</th>{!compact && <th className="px-4 py-3 font-bold">الحالة</th>}<th className="px-5 py-3 text-left font-bold">المبلغ</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-[#EDF2F0] text-sm hover:bg-[#FBFDFC]"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-xl bg-[#F2F6F4]"><MovementIcon kind={item.kind} /></span><div><p className="font-bold text-[#254642]">{item.title}</p><p className="mt-0.5 text-xs text-[#80938F]">{item.category}</p></div></div></td><td className="px-4 py-3.5 text-xs font-medium text-[#536D67]">{item.account}</td><td className="px-4 py-3.5 text-xs text-[#6E8580]">{item.date}</td>{!compact && <td className="px-4 py-3.5"><StatusPill status={item.status} /></td>}<td className={`px-5 py-3.5 text-left text-sm font-extrabold ${item.kind === "income" ? "text-[#28775E]" : item.kind === "expense" ? "text-[#A55E4B]" : "text-[#367694]"}`} dir="ltr">{item.kind === "income" ? "+" : item.kind === "expense" ? "−" : "↔"} {formatMoney(item.amount, currency)}</td></tr>)}</tbody></table></div>;
}

function TransactionsView({ currency, query, setQuery, movements, onExport, onAdd }: { currency: Currency; query: string; setQuery: (value: string) => void; movements: Movement[]; onExport: () => void; onAdd: () => void }) {
  return <section className="animate-in fade-in slide-in-from-bottom-1 duration-300"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#6F8681]">دفتر الحركات الديناميكي</p><h2 className="mt-1 text-2xl font-extrabold">كل الحركات</h2></div><div className="flex gap-2"><button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl border border-[#D8E5E0] bg-white px-3.5 py-2.5 text-xs font-bold text-[#0F5C5B] hover:bg-[#EFF5F2]"><Download className="size-4" />تصدير CSV</button><button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#0F5C5B] px-3.5 py-2.5 text-xs font-bold text-white"><Plus className="size-4" />حركة جديدة</button></div></div><div className="mt-6 rounded-2xl border border-[#E0EAE6] bg-white"><div className="flex flex-wrap gap-3 border-b border-[#E7EFEB] p-4"><label className="relative min-w-[220px] flex-1"><Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#78908B]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في الوصف أو الحساب..." className="h-10 w-full rounded-xl border border-[#DCE8E3] bg-[#FCFDFC] pr-9 pl-3 text-sm outline-none transition focus:border-[#0F5C5B]" /></label><button className="inline-flex items-center gap-2 rounded-xl border border-[#DCE8E3] px-3 text-xs font-bold text-[#54716A] hover:bg-[#F3F7F5]"><SlidersHorizontal className="size-4" />فلاتر</button></div><MovementTable items={movements} currency={currency} /></div></section>;
}

function ReportsView({ currency, onExport }: { currency: Currency; onExport: () => void }) {
  const cards = [{ label: "إجمالي الدخل", value: 11050, tone: "bg-[#EDF8F3] text-[#2D785E]" }, { label: "إجمالي المصروف", value: 1240, tone: "bg-[#FFF4EF] text-[#A8604C]" }, { label: "صافي التدفق", value: 9810, tone: "bg-[#EAF4F2] text-[#0F5C5B]" }];
  return <section className="animate-in fade-in slide-in-from-bottom-1 duration-300"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-[#6F8681]">يناير 2025 · كل المحافظ</p><h2 className="mt-1 text-2xl font-extrabold">تقرير التدفق النقدي</h2></div><button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl border border-[#D8E5E0] bg-white px-3.5 py-2.5 text-xs font-bold text-[#0F5C5B]"><Download className="size-4" />تصدير التقرير</button></div><div className="mt-6 grid gap-4 md:grid-cols-3">{cards.map((card) => <div key={card.label} className={`rounded-2xl p-5 ${card.tone}`}><p className="text-xs font-bold opacity-75">{card.label}</p><p className="mt-3 text-2xl font-extrabold" dir="ltr">{formatMoney(card.value, currency)}</p><p className="mt-2 text-xs opacity-70">الحركات المنشورة خلال الفترة</p></div>)}</div><div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="overflow-hidden rounded-2xl border border-[#E0EAE6] bg-white"><div className="border-b border-[#E7EFEB] p-5"><h3 className="text-sm font-extrabold">ملخص حسب الفئة</h3></div><div className="space-y-5 p-5">{[["دخل العمل", 76, "#278064"],["المنزل", 34, "#BF7958"],["تنقّل", 21, "#BE9140"],["الادخار", 48, "#3F8099"]].map(([label, width, color]) => <div key={String(label)}><div className="mb-2 flex justify-between text-xs font-bold"><span>{label}</span><span>{width}%</span></div><div className="h-2 rounded-full bg-[#EEF3F1]"><div className="h-full rounded-full" style={{ width: `${width}%`, background: String(color) }} /></div></div>)}</div></div><div className="relative overflow-hidden rounded-2xl bg-[#0F5C5B] p-6 text-white"><img src="/manus-storage/mahfazati-family-vault_570135b9.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen" /><div className="relative"><p className="text-xs font-bold text-[#EFCB74]">تقرير ذكي</p><h3 className="mt-2 text-xl font-extrabold leading-8">الادخار يتقدم بثبات هذا الشهر.</h3><p className="mt-3 text-sm leading-6 text-[#C8DFD9]">أضفت تحويلاً داخلياً بقيمة 1,500 ₪، فارتفعت نسبة الادخار إلى 42% من صافي القيمة.</p><button onClick={() => toast.message("سيكون تقرير الأداء الزمني قابلاً للتخصيص من إعدادات التقارير.")} className="mt-6 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20">تخصيص التقرير</button></div></div></div></section>;
}

function ManagementView({ type, currency, onAdd }: { type: "portfolios" | "accounts"; currency: Currency; onAdd: () => void }) {
  const items = type === "portfolios" ? [{ name: "المحفظة اليومية", desc: "محمود · عملتها الأساسية ILS", value: 22340, color: "#0F5C5B" }, { name: "محفظة الادخار", desc: "محمود · هدف طويل الأجل", value: 35400, color: "#52714E" }, { name: "محفظة الدولار", desc: "العائلة · عملتها الأساسية USD", value: 26460, color: "#B27B2A" }] : [{ name: "البنك العربي", desc: "حساب جارٍ · ILS", value: 12800, color: "#0F5C5B" }, { name: "حساب الادخار", desc: "ادخار · ILS", value: 35400, color: "#52714E" }, { name: "Visa Platinum", desc: "بطاقة ائتمان · ILS", value: -780, color: "#B6614B" }];
  return <section className="animate-in fade-in slide-in-from-bottom-1 duration-300"><div className="flex items-end justify-between"><div><p className="text-sm text-[#6F8681]">تكوين مساحة محمود</p><h2 className="mt-1 text-2xl font-extrabold">{type === "portfolios" ? "المحافظ" : "الحسابات"}</h2></div><button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#0F5C5B] px-3.5 py-2.5 text-xs font-bold text-white"><Plus className="size-4" />إضافة {type === "portfolios" ? "محفظة" : "حساب"}</button></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <article key={item.name} className="relative overflow-hidden rounded-2xl border border-[#E0EAE6] bg-white p-5 shadow-[0_8px_20px_rgba(32,66,60,0.035)]"><span className="absolute inset-y-0 right-0 w-1" style={{ background: item.color }} /><div className="flex items-start justify-between"><span className="rounded-xl p-2.5" style={{ background: `${item.color}16`, color: item.color }}><WalletCards className="size-5" /></span><button className="rounded-lg p-1.5 text-[#8A9B96] hover:bg-[#F0F5F2]"><MoreHorizontal className="size-5" /></button></div><h3 className="mt-6 text-base font-extrabold">{item.name}</h3><p className="mt-1 text-xs text-[#78908B]">{item.desc}</p><div className="mt-6 border-t border-[#EEF2F0] pt-4"><p className="text-xs text-[#78908B]">الرصيد الحالي</p><p className="mt-1 text-xl font-extrabold" dir="ltr">{formatMoney(item.value, currency)}</p></div></article>)}</div></section>;
}

function TransactionDialog({ draft, setDraft, onClose, onSubmit }: { draft: { title: string; amount: string; kind: Movement["kind"] }; setDraft: (value: { title: string; amount: string; kind: Movement["kind"] }) => void; onClose: () => void; onSubmit: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18312E]/35 p-4 backdrop-blur-sm sm:items-center"><div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-[22px] bg-[#FFFEFB] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#78908B]">دفتر الحركات</p><h2 className="mt-1 text-lg font-extrabold">تسجيل حركة جديدة</h2></div><button onClick={onClose} className="rounded-xl p-2 text-[#6E8580] hover:bg-[#EFF4F1]" aria-label="إغلاق"><X className="size-5" /></button></div><div className="mt-5 space-y-4"><label className="block text-xs font-bold text-[#45635D]">نوع الحركة<div className="mt-2 grid grid-cols-3 rounded-xl bg-[#F1F5F3] p-1">{([['income','دخل'],['expense','مصروف'],['transfer','تحويل']] as const).map(([value,label]) => <button key={value} onClick={() => setDraft({ ...draft, kind: value })} className={`rounded-lg px-2 py-2 text-xs font-bold transition ${draft.kind === value ? "bg-white text-[#0F5C5B] shadow-sm" : "text-[#78908B]"}`}>{label}</button>)}</div></label><label className="block text-xs font-bold text-[#45635D]">الوصف<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="مثال: فاتورة الكهرباء" className="mt-2 h-11 w-full rounded-xl border border-[#DCE8E3] bg-white px-3 text-sm font-medium outline-none focus:border-[#0F5C5B]" /></label><label className="block text-xs font-bold text-[#45635D]">المبلغ<input inputMode="decimal" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} placeholder="0" className="mt-2 h-11 w-full rounded-xl border border-[#DCE8E3] bg-white px-3 text-sm font-medium outline-none focus:border-[#0F5C5B]" dir="ltr" /></label></div><div className="mt-6 flex gap-2"><button onClick={onClose} className="flex-1 rounded-xl border border-[#D8E5E0] py-2.5 text-sm font-bold text-[#54716A] hover:bg-[#F3F7F5]">إلغاء</button><button onClick={onSubmit} className="flex-1 rounded-xl bg-[#0F5C5B] py-2.5 text-sm font-bold text-white hover:bg-[#0B4D4C] active:scale-[0.97]">ترحيل الحركة</button></div></div></div>;
}
