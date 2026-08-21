import {
  FiArrowUpRight,
  FiBookOpen,
  FiFileText,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi'

const links = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/arslan-kemal-gunduz',
    icon: FiLinkedin,
    external: true,
  },
  {
    label: 'Kitabım',
    href: '#',
    icon: FiBookOpen,
    external: false,
    comingSoon: true,
  },
  {
    label: 'CV',
    href: '/pdf/CV_TR.pdf',
    icon: FiFileText,
    external: true,
  },
  {
    label: 'Contact',
    href: 'mailto:arslankemalgunduz@gmail.com',
    icon: FiMail,
    external: false,
  },
]

export default function Home() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#080706] text-[#f4ead7]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:36%_center] sm:bg-center"
        style={{ backgroundImage: "url('/images/mummy-lord-background.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,7,6,0.28)_0%,rgba(8,7,6,0.58)_48%,rgba(8,7,6,0.76)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45"
      />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-10 sm:px-8">
        <section className="w-full max-w-[390px] rounded-[30px] border border-[#d6a74f]/20 bg-[#090806]/70 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-6">
          <header className="mb-6 text-center">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.34em] text-[#c89339]">
              arkegu.com.tr
            </p>
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-[#f4ead7]">
              Arslan Kemal Gündüz
            </h1>
          </header>

          <nav aria-label="Bağlantılar" className="space-y-3">
            {links.map((link) => {
              const Icon = link.icon

              if (link.comingSoon) {
                return (
                  <div
                    key={link.label}
                    className="flex min-h-[62px] items-center gap-3 rounded-2xl border border-[#d6a74f]/16 bg-black/25 px-4 text-[#f4ead7]/75"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d6a74f]/15 bg-[#d6a74f]/[0.05] text-[#d6a74f]">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-sm font-medium">{link.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#b78a45]">
                      Yakında
                    </span>
                  </div>
                )
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="group flex min-h-[62px] items-center gap-3 rounded-2xl border border-[#d6a74f]/20 bg-black/30 px-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#d6a74f]/45 hover:bg-[#d6a74f]/[0.08] hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a74f]/60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d6a74f]/20 bg-[#d6a74f]/[0.06] text-[#d6a74f] transition group-hover:bg-[#d6a74f]/[0.11] group-hover:text-[#efc36f]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-[#f4ead7]">
                    {link.label}
                  </span>
                  <FiArrowUpRight
                    size={17}
                    aria-hidden="true"
                    className="text-[#9d7b43] transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#efc36f]"
                  />
                </a>
              )
            })}
          </nav>
        </section>
      </div>
    </main>
  )
}
