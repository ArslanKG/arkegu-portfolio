"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiExternalLink, FiGithub, FiCode, FiEye, FiX } from 'react-icons/fi'
import { SiReact, SiTypescript, SiJavascript, SiCss3, SiHtml5, SiRemix, SiDotnet } from 'react-icons/si'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const projects = [
    {
      id: 1,
      title: 'Arkegu AI',
      subtitle: 'Akıllı Prompt Optimizasyonlu Chat Bot',
      description: 'Akıllı chat bot platformu. Kullanıcının yazdığı prompt\'u otomatik olarak optimize edip yapay zekaya ileterek, geleneksel chat bot\'lardan çok daha kaliteli ve etkili yanıtlar elde etmenizi sağlayan innovative bir AI asistanı.',
      longDescription: 'Arkegu AI, diğer chat bot\'lardan farklı olarak iki aşamalı bir yaklaşım benimser. İlk aşamada, kullanıcının yazdığı prompt\'u gelişmiş algoritmalarla analiz ederek optimize eder. İkinci aşamada, bu optimize edilmiş prompt\'u yapay zekaya göndererek çok daha kaliteli, anlaşılır ve hedef odaklı yanıtlar almanızı sağlar. React, Zustand ve modern web teknolojileri kullanılarak geliştirilmiş bu platform, AI ile etkileşimde yeni bir standart oluşturmaktadır.',
      image: '/images/arkegu-ai.jpg',
      technologies: [
        { name: 'React', icon: SiReact, color: 'text-blue-400' },
        { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400' },
        { name: '.Net', icon: SiDotnet, color: 'text-purple-400' },
        { name: 'Axios', icon: SiJavascript, color: 'text-green-400' },
      ],
      links: {
        live: 'https://arkeguai.vercel.app/',
        github: 'https://github.com/ArslanKG/prompt-optimizer-frontend',
      },
      category: 'Web Application',
      year: '2024',
      status: 'Active',
      features: [
        'Otomatik Prompt Optimizasyonu',
        'İki Aşamalı AI Yanıt Sistemi',
        'Real-time Chat Interface',
        'Gelişmiş Yanıt Kalitesi',
        'Kullanıcı Dostu Arayüz'
      ]
    },
    {
      id: 2,
      title: 'Everything is a Reflection',
      subtitle: '3D Visual Effects Application',
      description: '3D yansıma efekti uygulaması. WebGL2 ve GLSL shaders kullanılarak oluşturulan bu proje, advanced graphics programming ve modern web technologies\'in birleşimi ile etkileyici visual effects sunmaktadır.',
      longDescription: 'Bu proje, modern web tarayıcılarında 3D graphics ve visual effects konusundaki derinlemesine bilgiyi sergileyen bir showcase\'dur. WebGL2 API\'si, custom GLSL shaders ve TypeScript kullanılarak geliştirilmiştir. Remix framework\'ü ile server-side rendering optimizasyonları yapılmış, performant ve görsel olarak etkileyici bir deneyim oluşturulmuştur.',
      image: '/images/reflection-3d.jpg',
      technologies: [
        { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400' },
        { name: 'CSS3', icon: SiCss3, color: 'text-blue-500' },
        { name: 'Remix', icon: SiRemix, color: 'text-white' },
        { name: 'WebGL2', icon: SiJavascript, color: 'text-red-400' },
      ],
      links: {
        live: 'https://codepen.io/atzedent/pen/PovvpvR',
        github: '#',
      },
      category: '3D Graphics',
      year: '2024',
      status: 'Showcase',
      features: [
        '3D Reflection Effects',
        'WebGL2 Implementation',
        'Custom GLSL Shaders',
        'Performance Optimization',
        'Visual Effects Programming'
      ]
    },
    {
      id: 3,
      title: '404 Superman Page',
      subtitle: 'Animated Error Page',
      description: 'Animasyonlu özel hata sayfası. Creative CSS animations ve JavaScript interactions ile kullanıcı experience\'ını geliştiren, eğlenceli ve engaging bir 404 error page implementasyonu.',
      longDescription: 'Bu proje, geleneksel hata sayfalarından farklı olarak kullanıcı deneyimini iyileştirmeyi hedefleyen yaratıcı bir yaklaşımdır. Superman teması ile tasarlanan sayfa, CSS animations, JavaScript interactions ve responsive design principles kullanılarak geliştirilmiştir. Kullanıcıların hata ile karşılaştığında frustration yerine pozitif bir deneyim yaşamasını sağlamaktadır.',
      image: '/images/superman-404.jpg',
      technologies: [
        { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400' },
        { name: 'CSS3', icon: SiCss3, color: 'text-blue-500' },
        { name: 'HTML5', icon: SiHtml5, color: 'text-orange-400' },
      ],
      links: {
        live: 'https://codepen.io/ArslanKG/pen/vYodGOd',
        github: '#',
      },
      category: 'UI/UX Design',
      year: '2024',
      status: 'Showcase',
      features: [
        'Creative Animations',
        'Interactive Elements',
        'Responsive Design',
        'User Experience Focus',
        'Character-based Theme'
      ]
    }
  ]

  const ProjectModal = ({ project }: { project: typeof projects[0] }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedProject(null)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
          
          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-blue-400 font-medium">{project.subtitle}</p>
          
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              {project.category}
            </span>
            <span className="text-gray-400">{project.year}</span>
            <span className={`px-3 py-1 rounded-full border ${
              project.status === 'Active' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6 leading-relaxed">
            {project.longDescription}
          </p>

          {/* Technologies */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Teknolojiler</h4>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <tech.icon className={`text-lg ${tech.color}`} />
                  <span className="text-white text-sm">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Özellikler</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiExternalLink size={16} />
              Canlı Demo
            </a>
            {project.links.github !== '#' && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <FiGithub size={16} />
                GitHub
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
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
              Seçili <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Projeler</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Modern teknolojiler kullanarak geliştirdiğim, yaratıcı ve innovative projelerin bir koleksiyonu
            </motion.p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-10" />
                    
                    {/* Project Image */}
                    <div className="absolute inset-0 w-full h-full">
                      {project.id === 1 ? (
                        // Arkegu AI özel resmi
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
                          <img src="/images/arkegu-logo.png" alt="Arkegu AI Logo" className="w-24 h-24" />
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1">
                            Arkegu AI
                          </div>
                          <div className="text-sm text-gray-300 text-center">
                            Prompt Optimizasyon Platformu
                          </div>
                          <div className="flex gap-2 mt-3">
                            <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">AI</div>
                            <div className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">React</div>
                            <div className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">.Net</div>
                          </div>
                        </div>
                      ) : project.id === 2 ? (
                        // Everything is a Reflection özel resmi
                        <img
                          src="/images/Reflection_Effect.png"
                          alt="Everything is a Reflection"
                          className="w-full h-full object-contain bg-gradient-to-br from-purple-900/20 to-cyan-900/20"
                        />
                      ) : project.id === 3 ? (
                        // 404 Superman Page özel resmi
                        <img
                          src="/images/superman_project.png"
                          alt="404 Superman Page"
                          className="w-full h-full object-contain bg-gradient-to-br from-blue-900/20 to-purple-900/20"
                        />
                      ) : (
                        <img
                          src={`https://via.placeholder.com/400x300/1f2937/60a5fa?text=${encodeURIComponent(project.title)}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                      <div className="flex gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-3 bg-white/10 backdrop-blur-sm rounded-full"
                        >
                          <FiEye className="text-white" size={20} />
                        </motion.div>
                        <motion.a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.1 }}
                          className="p-3 bg-white/10 backdrop-blur-sm rounded-full"
                        >
                          <FiExternalLink className="text-white" size={20} />
                        </motion.a>
                        {project.links.github !== '#' && (
                          <motion.a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            whileHover={{ scale: 1.1 }}
                            className="p-3 bg-white/10 backdrop-blur-sm rounded-full"
                          >
                            <FiGithub className="text-white" size={20} />
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-30">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-purple-400 font-medium">
                          {project.subtitle}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-md text-xs"
                        >
                          <tech.icon className={`text-sm ${tech.color}`} />
                          <span className="text-gray-300">{tech.name}</span>
                        </div>
                      ))}
                      {project.technologies.length > 3 && (
                        <div className="px-2 py-1 bg-gray-700/50 rounded-md text-xs text-gray-400">
                          +{project.technologies.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="text-xs text-gray-500">
                      {project.category}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={projects.find(p => p.id === selectedProject)!} 
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects