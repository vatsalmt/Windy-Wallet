"use client";
import { Eyebrow, PageTitle, Grad, Notice, Skeleton, BtnRow, Btn } from "./ui";
import type { AnalyzeResponse, ComparisonResult, FormState, DiscountType } from "@/types";

// ── Skeleton loading state ────────────────────────────
function ResultsSkeleton() {
  return (
    <div className="animate-fade-up">
      {/* Hero skeleton */}
      <div className="rounded-2xl p-10 mb-6" style={{ background: "linear-gradient(135deg,#EFF6FF,#F5F3FF)" }}>
        <Skeleton h="h-4" w="w-32" rounded="rounded-full" />
        <div className="mt-3 mb-2"><Skeleton h="h-16" w="w-48" rounded="rounded-xl" /></div>
        <Skeleton h="h-4" w="w-56" rounded="rounded-lg" />
        <div className="flex gap-2 mt-5">
          {[1,2,3].map(i => <Skeleton key={i} h="h-7" w="w-28" rounded="rounded-full" />)}
        </div>
      </div>
      {/* Summary skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Skeleton h="h-7" w="w-20" rounded="rounded-lg" />
            <Skeleton h="h-3" w="w-24" rounded="rounded" className="mt-2" />
          </div>
        ))}
      </div>
      {/* Card skeletons */}
      {[1,2].map(i => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-card mb-4 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton h="h-8" w="w-8" rounded="rounded-lg" />
              <Skeleton h="h-4" w="w-32" rounded="rounded" />
            </div>
            <Skeleton h="h-6" w="w-24" rounded="rounded-full" />
          </div>
          <div className="px-6 py-5 grid grid-cols-[1fr_36px_1fr] gap-4">
            {[0,1].map(j => (
              <div key={j} className={j === 1 ? "flex items-center justify-center pt-8" : ""}>
                {j === 1
                  ? <Skeleton h="h-7" w="w-7" rounded="rounded-full" />
                  : <>
                    <Skeleton h="h-3" w="w-20" rounded="rounded" />
                    <Skeleton h="h-5" w="w-28" rounded="rounded-lg" className="mt-2" />
                    <Skeleton h="h-7" w="w-16" rounded="rounded-lg" className="mt-2" />
                    <Skeleton h="h-3" w="w-full" rounded="rounded" className="mt-3" />
                    <Skeleton h="h-3" w="w-4/5" rounded="rounded" className="mt-1.5" />
                  </>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
        <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300 border-t-primary animate-spin-slow" />
        Comparing against Loop-area plans and applying discounts…
      </p>
    </div>
  );
}

// ── Impact badge ──────────────────────────────────────
function ImpactBadge({ impact }: { impact: "high"|"medium"|"low" }) {
  const s = {
    high:   "bg-emerald-100 text-emerald-700",
    medium: "bg-blue-50 text-blue-600",
    low:    "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${s[impact]}`}>
      {impact}
    </span>
  );
}

// ── Individual comparison card ────────────────────────
const EMOJI: Record<string, string> = { mobile:"📱", internet:"📡", transit:"🚇", insurance:"🛡️" };
const ICON_BG: Record<string, string> = {
  mobile:"bg-blue-50", internet:"bg-violet-50", transit:"bg-emerald-50", insurance:"bg-purple-50",
};

function CompCard({ r, idx }: { r: ComparisonResult; idx: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-4 animate-slide-up"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center gap-2.5 text-[14px] font-bold text-gray-900">
          <div className={`w-8 h-8 ${ICON_BG[r.category]} rounded-lg flex items-center justify-center text-[17px]`}>
            {EMOJI[r.category]}
          </div>
          {r.label}
        </div>
        <div className="flex items-center gap-2">
          {r.alreadyOptimal
            ? <span className="bg-blue-50 text-primary rounded-full px-3 py-1 text-[11px] font-bold">Already Optimal ✓</span>
            : (
              <>
                <span className="bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-bold">
                  Save ${r.saving.toFixed(2)}/mo
                </span>
                <span className="bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                  ${r.annualSaving.toFixed(0)}/yr
                </span>
              </>
            )
          }
        </div>
      </div>

      {/* ── Already optimal ── */}
      {r.alreadyOptimal ? (
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
            <span className="text-xl flex-shrink-0">✅</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-1">You're already on the best available plan</p>
              <p className="text-xs text-emerald-700 leading-relaxed">{r.optimalReason || r.message}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── Comparison body ── */}
          <div className="px-6 py-5 grid grid-cols-[1fr_32px_1fr] gap-3 items-start">
            {/* Current plan */}
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-300 mb-2">Your Current Plan</p>
              <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">{r.currentProvider}</p>
              <p className="font-display text-[26px] font-extrabold tracking-tight text-gray-400 mb-2.5 leading-none">
                ${r.currentCost.toFixed(2)}
                <span className="text-xs font-medium text-gray-300 ml-1">/mo</span>
              </p>
              {r.currentFeatures?.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400 mb-1 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center pt-10">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-primary flex items-center justify-center text-xs font-bold">→</div>
            </div>

            {/* Recommended */}
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Recommended</p>
              <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">{r.altProvider}</p>
              <p className="font-display text-[26px] font-extrabold tracking-tight text-emerald-600 mb-2.5 leading-none">
                ${r.altCost!.toFixed(2)}
                <span className="text-xs font-medium text-gray-400 ml-1">/mo</span>
              </p>
              {r.altFeatures?.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
              {r.discountApplied && (
                <div className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 rounded-full px-2.5 py-1 text-[10.5px] font-semibold mt-2">
                  🏷 {r.discountPct}% discount applied
                </div>
              )}
            </div>
          </div>

          {/* ── Why this is better ── */}
          {r.savingReasons && r.savingReasons.length > 0 && (
            <div className="mx-6 mb-4 bg-gray-50 rounded-xl px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Why this saves you money</p>
              <div className="space-y-2">
                {r.savingReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ImpactBadge impact={reason.impact} />
                    <p className="text-xs text-gray-600 leading-snug flex-1">{reason.factor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Warning (important caveats) ── */}
      {r.warning && (
        <div className="mx-6 mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
          <span className="text-amber-500 text-sm flex-shrink-0">⚠️</span>
          <p className="text-xs text-amber-800 leading-snug font-medium">{r.warning}</p>
        </div>
      )}

      {/* ── Footnote ── */}
      <div className="px-6 py-2.5 border-t border-gray-100 flex items-center justify-between">
        {r.note
          ? <p className="text-[11px] text-gray-400 flex items-center gap-1.5"><span>ℹ️</span>{r.note}</p>
          : <div />
        }
        <p className="text-[10px] text-gray-300 font-medium flex-shrink-0">{r.dataFreshness}</p>
      </div>
    </div>
  );
}

// ── Main Results page ─────────────────────────────────
const DISC_LABELS: Record<DiscountType, string> = {
  veteran:"Veteran", disability:"Disability", senior:"Senior",
  frontline:"Frontline Worker", lowincome:"Income-Qualified", child:"Family",
};

interface Props {
  result: AnalyzeResponse | null;
  loading: boolean;
  error: string;
  form: FormState;
  onBack: () => void;
  onReset: () => void;
}

export default function StepResults({ result, loading, error, form, onBack, onReset }: Props) {
  if (loading) return <ResultsSkeleton />;

  if (error) {
    return (
      <div className="animate-fade-up">
        <Notice type="error" icon="❌">
          <strong>Analysis failed:</strong> {error}
        </Notice>
        <Notice type="info" icon="💡">
          Make sure your ZIP code is a valid Chicago Loop ZIP (60601–60607, 60611, 60616, 60661) and all cost fields are filled in.
        </Notice>
        <BtnRow>
          <Btn variant="secondary" onClick={onBack}>← Adjust Your Bills</Btn>
        </BtnRow>
      </div>
    );
  }

  if (!result) return null;

  const { totalMonthlySavings, totalAnnualSavings, discountMultiplier, budgetImpactPct, results, generatedAt } = result;
  const optimized = results.filter(r => !r.alreadyOptimal).length;
  const discLabels = form.discounts.map(d => DISC_LABELS[d]).filter(Boolean);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Copy summary to clipboard
  const handleCopy = async () => {
    const lines = [
      `WindyWallet Analysis — ${generatedAt}`,
      `ZIP: ${result.zip}`,
      "",
      `Monthly Savings: $${totalMonthlySavings.toFixed(2)}`,
      `Annual Savings: $${totalAnnualSavings.toFixed(0)}`,
      "",
      ...results.map(r =>
        r.alreadyOptimal
          ? `${r.label}: Already optimized ✓`
          : `${r.label}: $${r.currentCost.toFixed(2)}/mo → ${r.altProvider} at $${r.altCost?.toFixed(2)}/mo (save $${r.saving.toFixed(2)}/mo)`
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {}
  };

  return (
    <div className="animate-fade-up">
      <Eyebrow>Step 4 of 4 — Your Results</Eyebrow>
      <PageTitle>Your savings <Grad>breakdown</Grad></PageTitle>

      {/* ── Hero ── */}
      <div className="rounded-2xl p-10 mb-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)" }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Estimated Monthly Savings</p>
          <p className="font-display leading-none font-extrabold tracking-tight mb-2 animate-fade-up"
            style={{ fontSize: "clamp(52px,8vw,72px)" }}>
            ${totalMonthlySavings.toFixed(2)}
          </p>
          <p className="text-base opacity-70 mb-5">
            ${totalAnnualSavings.toFixed(0)} saved per year
            {budgetImpactPct ? ` · recovers ${budgetImpactPct}% of your monthly budget` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {results.filter(r => r.saving > 0).map(r => (
              <div key={r.category}
                className="bg-white/20 border border-white/25 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold">
                {EMOJI[r.category]} {r.label}: ${ r.saving.toFixed(2)}/mo
              </div>
            ))}
            {optimized === 0 && (
              <div className="bg-white/20 border border-white/25 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold">
                ✓ All plans already optimal
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          ["$" + totalMonthlySavings.toFixed(2), "Monthly Savings", "text-primary"],
          ["$" + totalAnnualSavings.toFixed(0),  "Annual Savings",  "text-emerald-600"],
          [optimized + " / " + results.length,   "Plans Optimized", "text-violet-600"],
        ].map(([v, l, cls]) => (
          <div key={l} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <p className={`font-display text-[22px] font-extrabold tracking-tight ${cls} mb-0.5`}>{v}</p>
            <p className="text-[11px] text-gray-400 font-medium leading-tight">{l}</p>
          </div>
        ))}
      </div>

      {/* ── Discounts applied notice ── */}
      {discountMultiplier > 0 && discLabels.length > 0 && (
        <Notice type="success" icon="🏷️">
          <strong>{discLabels.join(", ")}</strong> discount{discLabels.length > 1 ? "s" : ""} applied —
          {" "}{discountMultiplier}% additional reduction on eligible plans.
        </Notice>
      )}

      {/* ── Data freshness ── */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        All pricing sourced from public provider websites · {generatedAt}
        <span className="mx-1">·</span>
        <a href="https://www.cta.com/fares" target="_blank" rel="noopener noreferrer"
          className="text-primary underline underline-offset-2">CTA fares</a>
        <span className="mx-1">·</span>
        <a href="https://metra.com/fares" target="_blank" rel="noopener noreferrer"
          className="text-primary underline underline-offset-2">Metra fares</a>
      </div>

      {/* ── Comparison cards ── */}
      {results.map((r, i) => <CompCard key={r.category} r={r} idx={i} />)}

      {/* ── Action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Btn variant="secondary" onClick={handlePrint}>🖨️ Print</Btn>
          <Btn variant="secondary" onClick={handleCopy}>📋 Copy Summary</Btn>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" onClick={onBack}>← Adjust Bills</Btn>
          <Btn variant="primary" onClick={onReset}>🌬 New Analysis</Btn>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-[11px] text-gray-300 leading-relaxed mt-6 text-center max-w-lg mx-auto">
        WindyWallet provides estimates based on publicly available pricing. Actual savings may vary.
        Always verify pricing directly with providers before switching. Not affiliated with any carrier, CTA, or insurer.
      </p>
    </div>
  );
}
