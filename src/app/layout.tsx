import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tejpreet Singh | Data Engineer",
  description:
    "Portfolio of Tejpreet Singh — Data Engineer specializing in real-time streaming pipelines, ETL orchestration, and scalable data infrastructure.",
  keywords: [
    "Data Engineer",
    "Tejpreet Singh",
    "Apache Kafka",
    "Apache Spark",
    "ETL",
    "Pipeline",
    "Portfolio",
  ],
  openGraph: {
    title: "Tejpreet Singh | Data Engineer",
    description:
      "Building the infrastructure that turns raw chaos into actionable insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
