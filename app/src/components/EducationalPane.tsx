"use client";

import React from "react";
import contentSections from "@/data/contentSections";
import {
  useScrollSpy,
  useScrollToSectionInContainer,
} from "@/hooks/useScrollSpy";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Lock,
  Calculator,
  Unlock,
  Gift,
  Shield,
  Code,
} from "lucide-react";

const iconMap = { BookOpen, Lock, Calculator, Unlock, Gift, Shield, Code };

export default function EducationalPane() {
  const ids = contentSections.map((s) => s.id);
  const active = useScrollSpy(ids, { rootMargin: "-10% 0px -85% 0px" });
  const scrollTo = useScrollToSectionInContainer();

  return (
    <div className="relative ">
      {/* Desktop floating nav */}

      {/* Mobile horizontal nav */}
      <div className="lg:hidden overflow-x-auto mb-4 max-w-[90vw]">
        <div className="flex space-x-2">
          {contentSections.map((sec) => (
            <button
              key={sec.id}
              className={`flex-shrink-0 px-3 py-1 text-xs rounded-full ${
                active === sec.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => scrollTo(sec.id, "edu-content", 20)}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        id="edu-content"
        className="space-y-12 max-h-[calc(100vh-8rem)] overflow-y-auto smooth-scroll max-w-[90vw] lg:max-w-full"
      >
        {contentSections.map((sec) => {
          const Icon = iconMap[sec.icon];
          return (
            <section key={sec.id} id={sec.id} className="scroll-mt-20 mt-4 ">
              <Card className="border-l-4 border-primary shadow-lg mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {sec.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {sec.content.description}
                  </p>

                  <div>
                    <h4 className="font-medium mb-2">Key Points</h4>
                    <ul className="space-y-2">
                      {sec.content.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Badge variant="secondary">{i + 1}</Badge>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Code Example
                    </h4>
                    <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                      <code>{sec.content.codeExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
    </div>
  );
}
