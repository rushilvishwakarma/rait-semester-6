import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Database,
  Layers,
  GitBranch,
  MessageSquare,
  BookOpen,
  Calendar,
  GraduationCap,
  Cpu,
  Upload,
  FileQuestion,
} from "lucide-react";
import { HeroBackground } from "./hero-background";
import { Badge } from "@/components/ui/badge";
import { CourseProgressor } from "@/components/course-progressor";
import Hover from "@/components/hover";
import Shine from "@/components/shine";

const coreSubjects = [
  {
    title: "AML",
    description: "Advanced Machine Learning",
    href: "/docs/core/AML",
    icon: Cpu,
  },
  {
    title: "DL",
    description: "Deep Learning",
    href: "/docs/core/DL",
    icon: Brain,
  },
  {
    title: "BDA",
    description: "Big Data Analytics",
    href: "/docs/core/BDA",
    icon: Database,
  },
  {
    title: "NLP",
    description: "Natural Language Processing",
    href: "/docs/core/NLP",
    icon: MessageSquare,
  },
  {
    title: "DoE",
    description: "Design of Experiments",
    href: "/docs/core/DOE",
    icon: Layers,
  },
];

const labSubjects = [
  { title: "AML Lab", href: "/docs/labs/AML", icon: Cpu },
  { title: "DL Lab", href: "/docs/labs/DL", icon: Brain },
  { title: "MLOps Lab", href: "/docs/labs/MLOps", icon: GitBranch },
  { title: "BDA Lab", href: "/docs/labs/BDA", icon: Database },
  { title: "NLP Lab", href: "/docs/labs/NLP", icon: MessageSquare },
];

const resources = [
  {
    title: "Syllabus",
    description: "NEP-23 consolidated",
    href: "/docs/core/academic-calendars/syllabus",
    icon: BookOpen,
  },
  {
    title: "Academic Calendar",
    description: "RAIT schedule",
    href: "/docs/core/academic-calendars/rait",
    icon: Calendar,
  },
  {
    title: "Timetable",
    description: "Class schedule",
    href: "/docs/core/academic-calendars/class-timetable",
    icon: GraduationCap,
  },
  {
    title: "Current Semester Question Papers",
    description: "PYQs/Concluded Papers",
    href: "/docs/core/academic-calendars/question-papers",
    icon: FileQuestion,
  },
];

export default function HomePage() {
  return (
    <main className="w-full px-4 py-4">
      {/* Hero Section */}
      <section className="relative min-h-[350px] overflow-hidden rounded-2xl mb-12 flex flex-col border border-white/10 dark:border-black/10">
        <HeroBackground />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-fd-background to-transparent z-1 pointer-events-none" />
        {/* Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-2 px-6 py-12">
          <div className="mix-blend-difference">
            <Image
              src="/logos/brand/logo-in-dark-mode.svg"
              alt="Logo"
              width={280}
              height={140}
              className="dark:hidden pb-4 mx-auto"
            />
            <Image
              src="/logos/brand/logo-in-light-mode.svg"
              alt="Logo"
              width={280}
              height={140}
              className="hidden dark:block pb-4 mx-auto"
            />
          </div>
          <Badge variant="secondary">B.Tech CSE • AI &amp; ML (TE)</Badge>
        </div>
        {/* Footer Disclaimer */}
        <div className="z-2 px-6 pb-4 text-center">
          <span className="text-fd-foreground/60 text-[0.6rem]">
            This platform is not affiliated with DY Patil University or Ramrao
            Adik Institute of Technology (RAIT).
          </span>
        </div>
      </section>

      {/* Content */}
      <div className="px-4">
        {/* Core Subjects */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            <Shine text="Core Subjects" speed={3} color="var(--shiny-color)" shineColor="var(--shiny-shine)" />
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {coreSubjects.map((subject) => (
              <Link key={subject.title} href={subject.href} className="block w-full">
                <Hover className="h-full">
                  <div className="flex items-center gap-4 p-5">
                    <subject.icon className="size-6 text-fd-muted-foreground shrink-0" />
                    <div>
                      <p className="font-semibold">{subject.title}</p>
                      <p className="text-sm text-fd-muted-foreground">
                        {subject.description}
                      </p>
                    </div>
                  </div>
                </Hover>
              </Link>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            <Shine text="Labs" speed={3} color="var(--shiny-color)" shineColor="var(--shiny-shine)" />
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {labSubjects.map((lab) => (
              <Link key={lab.title} href={lab.href} className="block w-full">
                <Hover className="h-full">
                  <div className="flex flex-col gap-2 items-center justify-center p-4 text-center h-full">
                    <lab.icon className="size-6 text-fd-muted-foreground shrink-0" />
                    <p className="text-sm font-medium">{lab.title}</p>
                  </div>
                </Hover>
              </Link>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            <Shine text="Resources" speed={3} color="var(--shiny-color)" shineColor="var(--shiny-shine)" />
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
            {resources.map((item) => (
              <Link key={item.title} href={item.href} className="block w-full">
                <Hover className="h-full">
                  <div className="flex items-center gap-4 p-4 h-full">
                    <item.icon className="size-6 text-fd-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-fd-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Hover>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="https://drive.google.com/drive/folders/18lvCelrTUnlEdAvUNhU2FO4L62dnYcQf?usp=sharing" className="block w-full">
              <Hover className="h-full">
                <div className="flex items-center gap-4 p-5 h-full">
                  <Upload className="size-6 text-fd-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Share and View Useful Resources</p>
                    <p className="text-sm text-fd-muted-foreground">
                      Share question banks, important Notes, and other verified
                      resources
                    </p>
                  </div>
                </div>
              </Hover>
            </a>
            <Hover className="h-full">
              <CourseProgressor />
            </Hover>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 pb-8 px-4 text-center text-sm text-fd-muted-foreground">
        <p>Crafted by <a href="https://www.linkedin.com/in/rushil-vishwakarma/" target="_blank" rel="noreferrer" className="text-fd-primary underline">Rushil Vishwakarma</a></p>
        <p className="mt-2 text-xs opacity-80">
          LMS documents are accessible only by students using their university
          email to prevent unauthorized distribution.
        </p>
        <p className="mt-2 text-xs opacity-70">
          Use at your own risk; the author is not responsible for any errors.
        </p>
      </footer>
    </main>
  );
}
