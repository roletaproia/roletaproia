export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "/logo.png";

// OAuth removido - usando autenticação Email/Senha
export const getLoginUrl = () => {
  return "/login"; // Redireciona para página de login local
};