import Image from 'next/image'
import {
  FiArrowUpRight,
  FiBookOpen,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi'

const links = [
  {
    label: 'GitHub',
    description: 'Projects, code and experiments',
    href: 'https://github.com/ArslanKG',
    icon: FiGithub,
    external: true,
  },
  {
    label: 'LinkedIn',
    description: 'Experience and professional profile',
    href: 'https://www.linkedin.com/in/arslan-kemal-gunduz',
    icon: FiLinkedin,
    external: true,
  },
  {
    label: 'Blog',
    description: 'Notes, ideas and things I am building',
    href: '/blog',
    icon: FiBookOpen,
    external: false,
  },
  {
    label: 'CV · Türkçe',
    description: 'Özgeçmiş · PDF',
    href: '/pdf/CV_TR.pdf',
    icon: FiFileText,
    external: true,
  },
  {
    label: 'CV · English',
    description: 'Resume · PDF',
    href: '/pdf/CV_EN.pdf',
    icon: FiFileText,
    external: true,
  },
  {
    label: 'Email',
    description: 'Get in touch',
    href: 'mailto:arslankemalgunduz@gmail.com',
    icon: FiMail,
    external: false,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] px-5 py-10 text-zinc-100 sm:px-8 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center sm:min-h-[calc(100vh-7rem)]">
        <section className="w-full">
          <header className="mb-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <Image
                  src="/images/arkegu-logo.png"
                  alt="Arkegu"
                  fill
                  priority
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>

              <div className="min-w-0">
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  arkegu.com.tr
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Arslan Kemal Gündüz
                </h1>
              </div>
            </div>

            <p className="max-w-lg text-sm leading-6 text-zinc-400 sm:text-[15px]">
              Software developer building products, tools and experiments.
            </p>
          </header>

          <nav aria-label="Primary links" className="space-y-2.5">
            {links.map((link) => {
              const Icon = link.icon

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-black/20 text-zinc-400 transition group-hover:text-white">
                    <Icon size={18} aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-zinc-100">
                      {link.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-zinc-500 sm:text-[13px]">
                      {link.description}
                    </span>
                  </span>

                  <FiArrowUpRight
                    size={17}
                    aria-hidden="true"
                    className="shrink-0 text-zinc-600 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-300"
                  />
                </a>
              )
            })}
          </nav>

          <footer className="mt-8 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
            <span>Arkegu</span>
            <span>2026</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
