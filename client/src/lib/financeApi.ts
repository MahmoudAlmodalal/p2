/**
 * Style reminder — the data layer exists to support a private «غرفة عمليات مالية»:
 * financial data stays server-authoritative, workspace-scoped, and never mocked in the UI.
 */
import { useCallback, useEffect, useState } from "react";

export type FinanceCurrency = "ILS" | "USD";
export type TransactionKind = "income" | "expense" | "transfer";

export type WorkspaceSnapshot = { workspace: { id: number; name: string; default_currency: FinanceCurrency }; net_worth: string; account_count: number };
export type FinanceAccount = { id: number; name: string; type: string; portfolio: number; portfolio_name: string; currency: FinanceCurrency; opening_balance: string; is_archived: boolean; current_balance: string };
export type FinancePortfolio = { id: number; name: string; type: string; person: number; person_name: string; base_currency: FinanceCurrency; is_archived: boolean; current_balance: string };
export type FinanceTransaction = { id: number; kind: TransactionKind; status: "draft" | "posted" | "voided"; occurred_on: string; description: string; category: number | null; category_name: string | null; counterparty: string; amount: string; currency: FinanceCurrency; source_account: number | null; source_account_name: string | null; destination_account: number | null; destination_account_name: string | null; posted_at: string | null; created_at: string };
export type CashFlow = { income: string; expense: string; net_cash_flow: string; currency: FinanceCurrency };
export type NetWorth = { currency: FinanceCurrency; net_worth: string; accounts: Array<{ account_id: number; account: string; portfolio: string; currency: FinanceCurrency; balance: string }> };

type Page<T> = { results: T[] };
type RequestOptions = { method?: "GET" | "POST" | "PATCH"; body?: unknown };

export class FinanceApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const apiBase = (import.meta.env.VITE_FINANCE_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
const djangoBase = apiBase.replace(/\/api\/v1$/, "");

function readCookie(name: string) {
  return document.cookie.split("; ").find((value) => value.startsWith(`${name}=`))?.split("=")[1];
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  if (method !== "GET") {
    await fetch(`${apiBase}/csrf/`, { credentials: "include" });
  }
  const csrfToken = readCookie("csrftoken");
  const response = await fetch(`${apiBase}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(csrfToken ? { "X-CSRFToken": decodeURIComponent(csrfToken) } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = typeof payload?.detail === "string" ? payload.detail : "تعذر الاتصال بخدمة البيانات المالية.";
    throw new FinanceApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

async function list<T>(path: string) {
  return (await request<Page<T>>(path)).results;
}

export function getFinanceLoginUrl() {
  if (import.meta.env.VITE_FINANCE_LOGIN_URL) return import.meta.env.VITE_FINANCE_LOGIN_URL;
  return `${djangoBase}/accounts/login/?next=${encodeURIComponent(window.location.href)}`;
}

export function useFinanceData() {
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot | null>(null);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [portfolios, setPortfolios] = useState<FinancePortfolio[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlow | null>(null);
  const [netWorth, setNetWorth] = useState<NetWorth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FinanceApiError | null>(null);

  const refresh = useCallback(async (currency?: FinanceCurrency) => {
    setLoading(true);
    setError(null);
    try {
      const currentWorkspace = await request<WorkspaceSnapshot>("/workspaces/current/");
      const activeCurrency = currency ?? currentWorkspace.workspace.default_currency;
      const [nextAccounts, nextPortfolios, nextTransactions, nextCashFlow, nextNetWorth] = await Promise.all([
        list<FinanceAccount>("/accounts/?page_size=100"),
        list<FinancePortfolio>("/portfolios/?page_size=100"),
        list<FinanceTransaction>("/transactions/?page_size=100"),
        request<CashFlow>(`/reports/cash-flow/?currency=${activeCurrency}`),
        request<NetWorth>(`/reports/net-worth/?currency=${activeCurrency}`),
      ]);
      setWorkspace(currentWorkspace);
      setAccounts(nextAccounts);
      setPortfolios(nextPortfolios);
      setTransactions(nextTransactions);
      setCashFlow(nextCashFlow);
      setNetWorth(nextNetWorth);
    } catch (nextError) {
      setError(nextError instanceof FinanceApiError ? nextError : new FinanceApiError(0, "تعذر الوصول إلى خادم Django."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const createAndPostTransaction = useCallback(async (payload: { kind: TransactionKind; description: string; amount: string; currency: FinanceCurrency; source_account?: number; destination_account?: number }) => {
    const created = await request<FinanceTransaction>("/transactions/", { method: "POST", body: payload });
    await request<FinanceTransaction>(`/transactions/${created.id}/post/`, { method: "POST" });
    await refresh(payload.currency);
  }, [refresh]);

  return { workspace, accounts, portfolios, transactions, cashFlow, netWorth, loading, error, refresh, createAndPostTransaction };
}
