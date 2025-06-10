"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCode, FiCloud, FiDatabase, FiLayers, FiFileText } from 'react-icons/fi'
import {
  SiReact, SiVuedotjs, SiTypescript, SiDotnet,
  SiMicrosoftazure, SiMongodb, SiPostgresql, SiJavascript,
  SiHtml5, SiCss3, SiTailwindcss, SiGit, SiSqlite,
  SiJquery, SiJenkins, SiJira, SiBitbucket, SiCsharp
} from 'react-icons/si'
import CVDownloadDropdown from '@/components/CVDownloadDropdown'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skills = [
    {
      category: 'Frontend',
      icon: FiCode,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      technologies: [
        { name: 'JavaScript', icon: SiJavascript, level: 95 },
        { name: 'jQuery', icon: SiJquery, level: 90 },
        { name: 'TypeScript', icon: SiTypescript, level: 75 },
        { name: 'React', icon: SiReact, level: 70 },
        { name: 'HTML5', icon: SiHtml5, level: 95 },
        { name: 'CSS3', icon: SiCss3, level: 90 },
        { name: 'Vue.js', icon: SiVuedotjs, level: 65 },
      ]
    },
    {
      category: 'Backend',
      icon: FiLayers,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      technologies: [
        { name: '.NET', icon: SiDotnet, level: 85 },
        { name: 'C#', icon: SiCsharp, level: 85 },
        { name: 'RESTful API', icon: FiCode, level: 90 },
        { name: 'Entity Framework', icon: FiDatabase, level: 80 },
      ]
    },
    {
      category: 'Cloud & Database',
      icon: FiCloud,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      technologies: [
        { name: 'SQLite', icon: SiSqlite, level: 85 },
        { name: 'SQL Server', icon: FiDatabase, level: 90 },
        { name: 'MongoDB', icon: SiMongodb, level: 80 },
        { name: 'PostgreSQL', icon: SiPostgresql, level: 80 },
      ]
    },
    {
      category: 'DevOps & Tools',
      icon: FiDatabase,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      technologies: [
        { name: 'Git', icon: SiGit, level: 90 },
        { name: 'Jenkins', icon: SiJenkins, level: 80 },
        { name: 'Jira', icon: SiJira, level: 85 },
        { name: 'Bitbucket', icon: SiBitbucket, level: 85 },
        { name: 'Agile', icon: FiLayers, level: 90 },
        { name: 'SaaS Development', icon: FiCloud, level: 95 },
      ]
    }
  ]

  const stats = [
    { number: '4+', label: 'Yıl Deneyim' },
    { number: '10+', label: 'Tamamlanan Proje' },
    { number: '2', label: 'Ana Uzmanlık Alanı' },
  ]

  return (
    <section id="about" className="py-20 relative overflow-hidden">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Yazılım Geliştirici</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* About Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-300 leading-relaxed">
                Eskişehir'de yaşayan, <strong className="text-blue-400">4+ yıllık</strong> deneyimli
                bir yazılım geliştiricisiyim. Logo Yazılım'da Senior Software Developer olarak
                çalışıyor, <strong className="text-purple-400">Logo İşbaşı</strong> online ön muhasebe
                programının geliştirilmesinde aktif rol alıyorum.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-green-400">.NET Framework</strong> ve modern web
                teknolojilerinde uzmanım. <strong className="text-blue-400">JavaScript, jQuery</strong>
                ile dinamik kullanıcı arayüzleri geliştirme, <strong className="text-cyan-400">PostgreSQL
                ve MongoDB</strong> ile veri yönetimi konularında deneyimliyim.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-orange-400">Jenkins, Jira, Bitbucket</strong> gibi DevOps araçlarıyla
                Agile metodolojiler kullanarak, işletmelerin alış-satış takibi, stok yönetimi,
                cari hesap takibi gibi <strong className="text-cyan-400">ön muhasebe ihtiyaçlarını</strong>
                karşılayan SaaS çözümler geliştiriyorum.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CV Download Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
                className="pt-8 border-t border-gray-700/50"
              >
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <FiFileText className="text-blue-400" />
                  CV İndir
                </h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.1 }}
                >
                  <CVDownloadDropdown variant="primary" className="w-full sm:w-auto" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              {skills.map((skillGroup, groupIndex) => (
                <motion.div
                  key={skillGroup.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 + groupIndex * 0.1 }}
                  className={`p-6 rounded-xl ${skillGroup.bgColor} border border-gray-700/50 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <skillGroup.icon className={`text-2xl ${skillGroup.color}`} />
                    <h3 className="text-xl font-semibold text-white">
                      {skillGroup.category}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {skillGroup.technologies.map((tech, techIndex) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ 
                          delay: 0.8 + groupIndex * 0.1 + techIndex * 0.05 
                        }}
                        className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg"
                      >
                        <tech.icon className={`text-lg ${skillGroup.color}`} />
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">
                            {tech.name}
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={inView ? { width: `${tech.level}%` } : {}}
                              transition={{ 
                                delay: 1 + groupIndex * 0.1 + techIndex * 0.05,
                                duration: 1
                              }}
                              className={`h-1.5 rounded-full bg-gradient-to-r ${
                                skillGroup.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                                skillGroup.color.includes('green') ? 'from-green-400 to-green-600' :
                                skillGroup.color.includes('purple') ? 'from-purple-400 to-purple-600' :
                                'from-orange-400 to-orange-600'
                              }`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About