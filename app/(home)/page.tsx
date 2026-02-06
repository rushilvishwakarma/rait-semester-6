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
  Upload,
} from 'lucide-react';
import { HeroBackground } from './hero-background';
import { Badge } from '@/components/ui/badge';
import { CourseProgressor } from '@/components/course-progressor';

const coreSubjects = [
  { title: 'BDA', description: 'Big Data Analytics', href: '/docs/core/BDA', icon: Database },
  { title: 'NLP', description: 'Natural Language Processing', href: '/docs/core/NLP', icon: MessageSquare },
  { title: 'DOE', description: 'Design of Experiments', href: '/docs/core/DOE', icon: Layers },
  { title: 'AML', description: 'Advanced Machine Learning', href: '/docs/core/AML', icon: Cpu },
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
    <main className="w-full px-4 py-4">
      {/* Hero Section */}
      <section className="relative min-h-[350px] overflow-hidden rounded-2xl mb-12 flex flex-col border">
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
          <Badge variant="secondary">
            B.Tech CSE • AI & ML (TE)
          </Badge>
        </div>
        {/* Footer Disclaimer */}
        <div className="z-2 px-6 pb-4 text-center">
          <span className="text-fd-foreground/60 text-[0.6rem]">
            This platform is not affiliated with DY Patil University or Ramrao Adik Institute of Technology (RAIT).
          </span>
        </div>
      </section>

      {/* Content */}
      <div className='px-4'>
        {/* Core Subjects */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Core Subjects</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
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

        {/* Tools Section */}
        <section className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://drive.google.com/drive/folders/18lvCelrTUnlEdAvUNhU2FO4L62dnYcQf?usp=sharing"
              className="group flex items-center gap-4 rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
            >
              <div className="rounded-lg border bg-fd-background p-3">
                <Upload className="size-5 text-fd-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Share and View Useful Resources</p>
                <p className="text-sm text-fd-muted-foreground">
                  Share question banks, important Notes, and other verified resources
                </p>
              </div>
            </a>
            <CourseProgressor />
          </div>
        </section>
      </div>



      {/* Footer */}
      <footer className="mt-16 border-t pt-6 pb-8 text-center text-sm text-fd-muted-foreground">
        <p>Crafted by Feverdream</p>
        <p className="mt-1 text-xs">Have useful resources or found an issue? <a href="https://tally.so/r/Bz764A" target="_blank" rel="noopener noreferrer" className="underline">Contact us here</a>.</p>
      </footer>
    </main>
  );
}
