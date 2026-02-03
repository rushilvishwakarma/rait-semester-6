import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';
import { HeroBackground } from './hero-background';

const coreSubjects = [
  { title: 'BDA', description: 'Big Data Analytics', href: '/docs/core/BDA', icon: Database },
  { title: 'NLP', description: 'Natural Language Processing', href: '/docs/core/NLP', icon: MessageSquare },
  { title: 'DOE', description: 'Design of Experiments', href: '/docs/core/DOE', icon: Layers },
  { title: 'AML', description: 'Applied Machine Learning', href: '/docs/core/AML', icon: Cpu },
  { title: 'DL', description: 'Deep Learning', href: '/docs/core/DL', icon: Brain },
];

const labSubjects = [
  { title: 'AML Lab', href: '/docs/labs/AML', icon: Cpu },
  { title: 'BDA Lab', href: '/docs/labs/BDA', icon: Database },
  { title: 'DL Lab', href: '/docs/labs/DL', icon: Brain },
  { title: 'MLOps Lab', href: '/docs/labs/MLOps', icon: GitBranch },
  { title: 'NLP Lab', href: '/docs/labs/NLP', icon: MessageSquare },
];

const resources = [
  { title: 'Syllabus', description: 'NEP-23 consolidated', href: '/docs/core/academic-calendars/syllabus', icon: BookOpen },
  { title: 'Academic Calendar', description: 'RAIT schedule', href: '/docs/core/academic-calendars/rait', icon: Calendar },
  { title: 'Timetable', description: 'Class schedule', href: '/docs/core/academic-calendars/class-timetable', icon: GraduationCap },
];

export default function HomePage() {
  return (
    <main className="mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="relative min-h-[350px] overflow-hidden rounded-2xl mb-12">
        <HeroBackground />
        <div className="flex flex-col z-2 px-6 size-full md:p-12 max-md:items-center max-md:text-center py-12">
          <div className="w-full">
          <Image
            src="/logos/brand/logo-in-light-mode.svg"
            alt="Logo"
            width={180}
            height={140}
            className="dark:hidden pb-4"
          />
          <Image
            src="/logos/brand/logo-in-light-mode.svg"
            alt="Logo"
            width={180}
            height={140}
            className="hidden dark:block pb-4"
          />
            <h1 className="text-4xl font-bold mb-3 text-white md:text-5xl">Semester 6</h1>
            <p className="text-white/80 text-lg mb-4">B.Tech CSE (AI & ML) • TE Sem 6</p>
            <p className="text-white/60 max-w-md max-md:mx-auto"> This site is not affiliated with DY Patil University or RAIT.</p>
              <p className="text-white/60 text-sm max-w-md max-md:mx-auto">
              Created by students, for students.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div>
        {/* Core Subjects */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Core Subjects</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {coreSubjects.map((subject) => (
              <Link
                key={subject.title}
                href={subject.href}
                className="group flex items-center gap-4 rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
              >
                <div className="rounded-lg border bg-fd-background p-3">
                  <subject.icon className="size-5 text-fd-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{subject.title}</p>
                  <p className="text-sm text-fd-muted-foreground">{subject.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Labs</h2>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
            {labSubjects.map((lab) => (
              <Link
                key={lab.title}
                href={lab.href}
                className="group flex flex-col items-center rounded-xl border bg-fd-card p-4 text-center transition-colors hover:bg-fd-accent"
              >
                <div className="mb-2 rounded-lg border bg-fd-background p-2.5">
                  <lab.icon className="size-5 text-fd-muted-foreground" />
                </div>
                <p className="text-sm font-medium">{lab.title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {resources.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center gap-4 rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
              >
                <div className="rounded-lg border bg-fd-background p-2.5">
                  <item.icon className="size-5 text-fd-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-fd-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 pb-8 text-center text-sm text-fd-muted-foreground">
        <p>Crafted by Feverdream</p>
        <p className="mt-1 text-xs">Not affiliated with DY Patil University or RAIT</p>
      </footer>
    </main>
  );
}
