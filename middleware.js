import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Excludem rutele care nu trebuie redirecționate, cum ar fi resursele statice și fișierele specifice
  if (
    pathname.startsWith("/_next/static") || // Exclude resursele Next.js generate automat
    pathname.startsWith("/favicon.ico") || // Exclude favicon
    pathname.includes(".") || // Exclude orice fișier ce conține o extensie (ex. .css, .js, .png)
    pathname.startsWith("/api") // Exclude orice API endpoint
  ) {
    return NextResponse.next(); // Permite continuarea fără redirecționare
  }

  // Obținem limba salvată în cookies, dacă nu, setăm "fr" ca limbă implicită
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "fr";

  // Dacă calea nu începe cu limba selectată, facem redirecționarea
  if (!pathname.startsWith(`/${locale}`)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Permite continuarea dacă ruta începe cu limba corectă
}

// Configurăm middleware-ul pentru a se aplica la toate rutele
export const config = {
  matcher: ["/:path*"], // Aplicăm middleware-ul la toate rutele
};
