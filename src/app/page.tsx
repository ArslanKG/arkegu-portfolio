const links = [
  {
    number: '01',
    label: 'LinkedIn',
    description: 'profesyonel geçmiş ve iletişim',
    href: 'https://www.linkedin.com/in/arslan-kemal-gunduz',
    marker: '↗',
    external: true,
  },
  {
    number: '02',
    label: 'GitHub',
    description: 'açık kaynak projeler ve deneyler',
    href: 'https://github.com/ArslanKG',
    marker: '↗',
    external: true,
  },
  {
    number: '03',
    label: 'Özgeçmiş',
    description: 'pdf · türkçe',
    href: '/pdf/CV_TR.pdf',
    marker: '↓',
    external: true,
  },
  {
    number: '04',
    label: 'E-posta',
    description: 'arslankemalgunduz@gmail.com',
    href: 'mailto:arslankemalgunduz@gmail.com',
    marker: '→',
    external: false,
  },
]

export default function Home() {
  return (
    <main
      className="relative min-h-[100svh] overflow-x-hidden bg-[#f3f2f2] text-[#201f1d]"
      style={{ fontFamily: 'var(--font-classical-body)' }}
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-[position:27%_center] sm:bg-center"
        style={{ backgroundImage: "url('/images/mummy-lord-background.webp?v=20260822-classical')" }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(243,242,242,.68) 0%, rgba(243,242,242,.50) 45%, rgba(243,242,242,.72) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col items-center px-[22px] py-11 sm:px-8">
        <div className="border border-[#201f1d]/15 bg-[#eae9e9] p-2 shadow-[0_3px_10px_rgba(45,43,43,.16)] sm:p-[10px]">
          <div
            aria-label="Arkegu portresi"
            className="h-[104px] w-[104px] border border-[#201f1d]/20 bg-cover sm:h-24 sm:w-24"
            style={{
              backgroundImage: "url('/images/mummy-lord-background.webp?v=20260822-classical')",
              backgroundPosition: '7% 62%',
              backgroundSize: '520%',
            }}
          />
        </div>

        <div className="mt-5 flex items-center gap-[10px] sm:mt-[26px] sm:gap-3">
          <span className="h-px w-[22px] bg-[#b68235] sm:w-7" />
          <span
            className="text-[9.5px] uppercase tracking-[.3em] text-[#a06f24] sm:text-[10px]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Arkegu
          </span>
          <span className="h-px w-[22px] bg-[#b68235] sm:w-7" />
        </div>

        <h1
          className="mt-[14px] text-center text-[40px] font-normal leading-[1.05] tracking-[-.015em] sm:text-[42px] sm:leading-[1.06]"
          style={{ fontFamily: 'var(--font-classical-heading)' }}
        >
          Arslan Kemal Gündüz
        </h1>

        <p
          className="mt-3 text-center text-[11px] tracking-[.04em] text-[#605d5d] sm:mt-[14px] sm:text-[12.5px] sm:tracking-[.06em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          &gt; senior software developer · eskişehir
        </p>

        <nav aria-label="Bağlantılar" className="mt-[30px] flex w-full flex-col gap-3 sm:max-w-[400px] sm:gap-[10px]">
          {links.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className={`group flex min-h-[70px] items-center gap-[14px] rounded-[4px] bg-[#14110e] px-4 py-[13px] text-[#f3ece0] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] sm:min-h-0 ${
                index === 0
                  ? 'border border-[#b68235] shadow-[0_3px_10px_rgba(45,43,43,.16)]'
                  : 'border border-[#b68235]/25 shadow-[0_1px_2px_rgba(45,43,43,.14)] hover:border-[#b68235] hover:shadow-[0_3px_10px_rgba(45,43,43,.16)]'
              }`}
            >
              <span
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[2px] border text-[12.5px] sm:h-9 sm:w-9 sm:text-[14px] ${
                  index === 0
                    ? 'border-[#b68235]/50 bg-[#b68235]/10 text-[#e1ad66]'
                    : 'border-[#b68235]/35 text-[#c28d41] group-hover:border-[#b68235]/55 group-hover:text-[#e1ad66]'
                }`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {link.number}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className="block text-[19px] font-medium leading-none sm:text-[17px]"
                  style={{ fontFamily: 'var(--font-classical-heading)' }}
                >
                  {link.label}
                </span>
                <span
                  className="mt-1 block truncate text-[10.5px] leading-[1.3] text-[#f3ece0]/55 sm:text-[11.5px]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {link.description}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={`text-[14px] transition duration-200 group-hover:-translate-y-px group-hover:translate-x-px sm:text-[15px] ${
                  index === 0 ? 'text-[#e1ad66]' : 'text-[#c28d41] group-hover:text-[#e1ad66]'
                }`}
                style={{ fontFamily: 'var(--font-classical-heading)' }}
              >
                {link.marker}
              </span>
            </a>
          ))}
        </nav>

        <div
          className="mt-[34px] text-[9px] uppercase tracking-[.2em] text-[#7d7979] sm:mt-8 sm:text-[9.5px]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          arkegu.com.tr
        </div>
      </div>
    </main>
  )
}
