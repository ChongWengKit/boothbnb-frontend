"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { useCurrency } from "@/components/CurrencyProvider";
import { getAvailableCurrencies } from "@/components/action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const DashboardTopbar = () => {
  const { user, logout } = useUserContext();
  const { currencyCode, handleSetCurrencyCode } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const isMapView = searchParams.get("view") === "map";

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await getAvailableCurrencies();
      setAvailableCurrencies(data);
    };
    fetchCurrencies();
  }, []);

  const filteredCurrencies = availableCurrencies.filter((code) =>
    code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  return (
    <header className={`sticky top-0 z-[100] flex w-full items-center justify-between border-b border-border bg-card p-2 shadow-lg ${isMapView ? "hidden md:flex" : "flex"}`}>
      <Link href="/">
        <div className="text-2xl cursor-pointer text-foreground font-extrabold text-center">BoothBnB</div>
      </Link>

      <nav className="flex items-center gap-4">
        {user?.role === "HOST" && (
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/stripe-connect"
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors border-border bg-background text-foreground`}
            >
              Stripe Status
            </Link>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => {
              setIsCurrencyOpen(!isCurrencyOpen);
              setCurrencySearch("");
            }}
            className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            {currencyCode}
          </button>
          {isCurrencyOpen && (
            <div className="absolute top-full right-0 z-50 mt-2 w-40 rounded-xl border border-border bg-popover p-2 shadow-lg">
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                className="mb-2 w-full rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
              />
              <ul className="max-h-48 overflow-y-auto">
                {filteredCurrencies.map((code) => (
                  <li
                    key={code}
                    className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-accent ${currencyCode === code ? "text-primary" : "text-foreground"}`}
                    onClick={() => {
                      handleSetCurrencyCode(code);
                      setIsCurrencyOpen(false);
                    }}
                  >
                    {code}
                  </li>
                ))}
                {filteredCurrencies.length === 0 && (
                  <li className="px-4 py-2 text-xs text-muted-foreground">No results</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user?.profile_photo ? (
            <Image
              className="w-12 h-12 rounded-full object-cover"
              src={user.profile_photo}
              alt="Profile"
              width={48}
              height={48}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
          )}
          <div className="text-foreground font-semibold select-none">{user?.username || "Guest"}</div>

          {isOpen && (
            <ul className="absolute top-full right-0 z-50 mt-2 w-32 rounded-xl border border-border bg-popover py-2 shadow-lg">
              {user ? (
                <>
                  <li className="cursor-pointer px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent">
                    <Link href={`/account/${user.username}`}>
                      Account
                    </Link>
                  </li>
                  <li
                    className="cursor-pointer px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-muted/10"
                    onClick={() => logout()}
                  >
                    Log out
                  </li>

                </>

              ) : (
                <Link href="/login">
                  <li className="cursor-pointer px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent">
                    Log in
                  </li>
                </Link>
              )}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default DashboardTopbar;