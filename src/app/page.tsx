import {
  FiArrowUpRight,
  FiFileText,
  FiGithub,
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
    label: 'GitHub',
    href: 'https://github.com/ArslanKG',
    icon: FiGithub,
    external: true,
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
    <main className="relative min-h-[100svh] overflow-hidden bg-[#080706] text-[#f5ead6]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:27%_center] sm:bg-center"
        style={{ backgroundImage: "url('/images/mummy-lord-background.webp?v=20260822')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/[0.04] via-transparent to-black/20" />
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-10 sm:px-8">
        <nav aria-label="Bağlantılar" className="w-full max-w-[430px] space-y-3.5">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="group flex min-h-[72px] items-center gap-4 rounded-[20px] border border-[#d2a34f]/25 bg-[#0a0806]/58 px-5 shadow-[0_14px_42px_rgba(0,0,0,0.22)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-[#e2b55f]/55 hover:bg-[#0a0806]/72 hover:shadow-[0_18px_48px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d2a34f]/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#d2a34f]/25 bg-[#d2a34f]/[0.07] text-[#d9aa52] transition group-hover:border-[#e2b55f]/45 group-hover:bg-[#d2a34f]/[0.11] group-hover:text-[#efc46f]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="flex-1 text-[15px] font-medium tracking-[-0.01em] text-[#f5ead6]">{link.label}</span>
                <FiArrowUpRight size={18} aria-hidden="true" className="text-[#9f7b3e] transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#efc46f]" />
              </a>
            )
          })}
        </nav>
      </div>
    </main>
  )
}
