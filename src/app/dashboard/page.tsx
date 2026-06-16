"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type PracticeLevel = "A2" | "B1" | "B2";

const PRACTICES = [
  {
    level: "A2" as const,
    title: "Vida cotidiana",
    description: "Conversaciones simples sobre rutinas, gustos y planes.",
    intro: "Practica un dialogo corto y recibe feedback al final.",
  },
  {
    level: "B1" as const,
    title: "Situaciones diarias",
    description: "Interacciones reales en viajes, compras y servicios.",
    intro: "Gana fluidez con preguntas y respuestas comunes.",
  },
  {
    level: "B2" as const,
    title: "Entorno profesional",
    description: "Reuniones, presentaciones y correo formal.",
    intro: "Mejora tu ingles para contextos de trabajo.",
  },
];

function DashboardPage() {
  const [selected, setSelected] = useState<PracticeLevel | null>(null);
  const active = PRACTICES.find((item) => item.level === selected);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-text">
      <div className="container mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <p className="text-text-soft text-sm">Tutor de ingles con IA</p>
            <h1 className="text-3xl font-bold text-primary">Academia De Inglés</h1>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-surface text-primary border border-primary px-4 py-2 rounded-md hover:border-primary-dark hover:text-primary-dark transition-colors"
          >
            Logout
          </button>
        </header>

        {!selected && (
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Selecciona una practica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRACTICES.map((item) => (
                <article
                  key={item.level}
                  className="bg-surface border border-border p-6 rounded-md shadow-sm flex flex-col gap-4"
                >
                  <div>
                    <p className="text-text-soft text-sm">{item.level}</p>
                    <h3 className="text-xl font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="text-text-soft mt-2">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setSelected(item.level)}
                    className="bg-primary text-background px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Practicar
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {selected && active && (
          <section className="bg-surface border border-border p-8 rounded-md shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-text-soft text-sm">Nivel {active.level}</p>
                <h2 className="text-2xl font-semibold text-primary">
                  {active.title}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-primary text-sm underline underline-offset-4"
              >
                Volver
              </button>
            </div>

            <p className="text-text-soft mb-6">{active.intro}</p>

            <div className="flex justify-center mb-8">
              <Link
                href={`/test-tutor?level=${active.level}`}
                className="bg-primary text-background px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
              >
                Start conversation
              </Link>
            </div>

            <div className="border border-border rounded-md p-6 bg-background">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary text-background flex items-center justify-center text-sm font-semibold">
                  IA
                </div>
                <div>
                  <p className="text-text-soft text-sm">Tutor IA</p>
                  <p className="text-text">
                    Hello! When you are ready, start by introducing yourself.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-background text-primary border border-border flex items-center justify-center text-sm font-semibold">
                  Yo
                </div>
                <div>
                  <p className="text-text-soft text-sm">Tu respuesta</p>
                  <p className="text-text">
                    Hi, I am learning English and I want to practice today.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
