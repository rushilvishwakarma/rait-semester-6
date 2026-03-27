'use client';

import * as React from 'react';
import { CircleHelp } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { QuestionDot } from '@/components/question-dot';

export function QuestionDotLegend() {
  const [open, setOpen] = React.useState(false);

  const openLegend = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <span
        role="button"
        tabIndex={0}
        className="inline-flex items-center justify-center"
        aria-label="Color Legend"
        onClick={openLegend}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openLegend(e);
        }}
      >
        <CircleHelp className="size-[1.2rem]" />
      </span>
      <DrawerContent className="max-h-[92vh]">
        <div className="w-full overflow-y-auto px-4 pb-5 pt-2 sm:px-6">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              Question Markers
            </DrawerTitle>
            <DrawerDescription className="text-left max-w-2xl">
              These tags indicate where a question has appeared in previous examinations or is available in other banks.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-xl border border-fd-border/60 bg-fd-muted/20 p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">Exams</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <QuestionDot color="green" text="IA1" />
                  <span className="text-sm font-medium">Internal Assessment 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <QuestionDot color="blue" text="MSE" />
                  <span className="text-sm font-medium">Mid Semester Exam</span>
                </div>
                <div className="flex items-center gap-2">
                  <QuestionDot color="orange" text="IA2" />
                  <span className="text-sm font-medium">Internal Assessment 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <QuestionDot color="red" text="ESE" />
                  <span className="text-sm font-medium">End Semester Exam</span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-fd-border/60 bg-fd-muted/20 p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">References</h3>
              <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <QuestionDot color="yellow" text="IA1-QB" />
                    <span className="text-sm font-medium text-fd-muted-foreground">Original Question Bank (IA1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuestionDot color="cyan" text="MSE-QB" />
                    <span className="text-sm font-medium text-fd-muted-foreground">Original Question Bank (MSE)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuestionDot color="purple" text="IA2-QB" />
                    <span className="text-sm font-medium text-fd-muted-foreground">Original Question Bank (IA2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuestionDot color="pink" text="ESE-QB" />
                    <span className="text-sm font-medium text-fd-muted-foreground">Original Question Bank (ESE)</span>
                  </div>
              </div>
            </section>
          </div>

          <div className="mt-4 rounded-lg border border-fd-border/60 bg-fd-muted/30 px-4 py-3">
            <p className="text-center text-[11px] italic text-fd-muted-foreground/85">
              * Badges appear on large screens, colored dots on mobile.
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
