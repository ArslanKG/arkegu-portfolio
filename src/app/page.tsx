import { FiBookOpen, FiFileText, FiLinkedin, FiMail } from 'react-icons/fi'

const links = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/arslan-kemal-gunduz',
    icon: FiLinkedin,
    external: true,
  },
  {
    label: 'Kitabım',
    href: null,
    icon: FiBookOpen,
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
  },
]

export default function Home() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#070605] text-[#f2e8d5]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:31%_center] sm:bg-[position:center_center]"
        style={{ backgroundImage: "url('/images/mummy-lord-background.webp')" }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,6,5,0.22)_0%,rgba(7,6,5,0.52)_52%,rgba(7,6,5,0.76)_100%)]"
      />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-8">
        <nav
          aria-label="Bağlantılar"
          className="w-full max-w-[360px] space-y-3 rounded-[28px] border border-[#d3a14a]/20 bg-[#090806]/66 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.56)] backdrop-blur-xl sm:p-5"
        >
          {links.map((link) => {
            const Icon = link.icon
            const sharedClassName =
              'flex min-h-[64px] items-center gap-4 rounded-2xl border border-[#d3a14a]/20 bg-black/28 px-4 text-[#f2e8d5] transition duration-200'

            if (!link.href) {
              return (
                <div
                  key={link.label}
                  aria-disabled="true"
                  className={`${sharedClassName} cursor-default opacity-60`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d3a14a]/18 bg-[#d3a14a]/[0.06] text-[#d3a14a]">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-medium tracking-[-0.01em]">
                    {link.label}
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
                className={`${sharedClassName} hover:-translate-y-0.5 hover:border-[#d3a14a]/45 hover:bg-[#d3a14a]/[0.08] hover:shadow-[0_14px_36px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3a14a]/55`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d3a14a]/18 bg-[#d3a14a]/[0.06] text-[#d3a14a]">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="text-[15px] font-medium tracking-[-0.01em]">
                  {link.label}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </main>
  )
}
