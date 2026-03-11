export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/((?!api/seed|api/auth|api/register|_next/static|_next/image|favicon.ico).*)"],
};
