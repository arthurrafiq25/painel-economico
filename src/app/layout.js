import "./globals.css";
import { Press_Start_2P } from "next/font/google";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--fonte-pixelada",
});

export const metadata = {
  title: "Painel Brasil",
  description: "Indicadores econômicos por estado",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={pressStart.variable}>
      <body>{children}</body>
    </html>
  );
}