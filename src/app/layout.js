import "./globals.css";

export const metadata = {
  title: "Painel Brasil",
  description: "Indicadores econômicos por estado",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}