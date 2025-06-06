"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiBriefcase, FiCalendar, FiMapPin, FiAward } from 'react-icons/fi'
import { SiDotnet, SiReact, SiVuedotjs, SiMicrosoftazure } from 'react-icons/si'

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const experiences = [
    {
      id: 1,
      title: 'Senior Software Developer',
      company: 'Logo Yazılım',
      period: 'Temmuz 2024 - Devam Ediyor',
      location: 'Eskişehir, Türkiye',
      type: 'Full-time, Remote',
      current: true,
      description: 'SaaS bulut muhasebe modülleri ve ürün mimarisi geliştirme. Mikroservis mimarisi ile ölçeklenebilir çözümler tasarlama ve modern teknolojilerle innovative fintech ürünleri geliştirme.',
      technologies: [SiDotnet, SiMicrosoftazure, SiReact, SiVuedotjs],
      achievements: [
        'Mikroservis mimarisi ile 40% performans artışı',
        'Bulut tabanlı muhasebe modüllerinin geliştirilmesi',
        'Modern web teknolojileri ile kullanıcı deneyimi iyileştirme',
        'Agile metodolojiler ile proje yönetimi'
      ]
    },
    {
      id: 2,
      title: 'Software Development Specialist',
      company: 'Logo Yazılım',
      period: 'Aralık 2021 - Temmuz 2024',
      location: 'İzmir, Türkiye',
      type: 'Full-time, Hybrid',
      current: false,
      description: '.NET ve modern web framework\'leriyle SaaS bulut muhasebe modülleri geliştirme. Ölçeklenebilir ve maintainable kod yazma, code review süreçlerine aktif katılım.',
      technologies: [SiDotnet, SiReact, SiVuedotjs],
      achievements: [
        'SaaS bulut muhasebe modüllerinin geliştirilmesi',
        'Modern web framework\'leri ile frontend geliştirme',
        'Code review süreçlerinde aktif rol alma',
        'Team collaboration ve mentoring'
      ]
    },
    {
      id: 3,
      title: 'Software Development Specialist',
      company: 'Logo Yazılım',
      period: 'Eylül 2021 - Aralık 2021',
      location: 'Eskişehir, Türkiye',
      type: 'Part-time, Remote',
      current: false,
      description: 'Agile metodolojileri ve kod inceleme süreçlerini öğrenme. Modern yazılım geliştirme pratiklerini uygulama ve team dynamics\'i anlama.',
      technologies: [SiDotnet],
      achievements: [
        'Agile metodolojilerini öğrenme ve uygulama',
        'Kod inceleme süreçlerine katılım',
        'Modern geliştirme pratiklerini benimeme',
        'Professional iş ortamında adaptasyon'
      ]
    },
    {
      id: 4,
      title: 'Software Developer - Stajyer',
      company: 'Logo Yazılım',
      period: 'Ağustos 2021',
      location: 'Eskişehir, Türkiye',
      type: 'Internship, Remote',
      current: false,
      description: '.NET teknolojileri ve modern web geliştirme prensiplerini öğrenme. Professional yazılım geliştirme environment\'ında ilk deneyim kazanma.',
      technologies: [SiDotnet],
      achievements: [
        '.NET teknolojilerini öğrenme',
        'Modern web geliştirme prensiplerini anlama',
        'Professional development environment deneyimi',
        'Mentor guidance ile skill development'
      ]
    }
  ]

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Profesyonel <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Deneyim</span>
            </motion.h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 transform md:-translate-x-0.5"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-4 border-gray-900 transform md:-translate-x-2 z-10">
                    {experience.current && (
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 w-full md:w-5/12 ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {experience.title}
                          </h3>
                          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                            <FiBriefcase size={16} />
                            {experience.company}
                            {experience.current && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                Mevcut
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <FiCalendar size={14} />
                          {experience.period}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin size={14} />
                          {experience.location}
                        </div>
                        <div className="sm:col-span-2 text-purple-400">
                          {experience.type}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-gray-400">Teknolojiler:</span>
                        <div className="flex gap-2">
                          {experience.technologies.map((Tech, techIndex) => (
                            <motion.div
                              key={techIndex}
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className="p-2 bg-gray-700/50 rounded-lg"
                            >
                              <Tech className="text-lg text-blue-400" />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiAward className="text-yellow-400" size={16} />
                          <span className="text-sm font-semibold text-white">Başarılar</span>
                        </div>
                        <ul className="space-y-1">
                          {experience.achievements.map((achievement, achIndex) => (
                            <motion.li
                              key={achIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={inView ? { opacity: 1, x: 0 } : {}}
                              transition={{ delay: 0.6 + index * 0.2 + achIndex * 0.1 }}
                              className="text-sm text-gray-300 flex items-start gap-2"
                            >
                              <span className="text-green-400 mt-1.5 block w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                              {achievement}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience