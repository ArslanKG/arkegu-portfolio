const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Utility function to calculate read time (average 200 words per minute)
function calculateReadTime(content) {
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Utility function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Test blog posts data
const testPosts = [
  // FEATURED POST (Hero section)
  {
    title: "Yapay Zeka ve Web Geliştirmenin Geleceği",
    excerpt: "2024'te AI destekli geliştirme araçları nasıl yazılım dünyasını değiştiriyor? Modern web geliştirme süreçlerinde yapay zekanın rolü ve gelecekteki etkilerini keşfedelim.",
    content: `# Yapay Zeka ve Web Geliştirmenin Geleceği

Yapay zeka teknologileri, yazılım geliştirme dünyasında devrim niteliğinde değişimler yaratıyor. GitHub Copilot, ChatGPT ve benzeri AI araçları, geliştiricilerin kod yazma şeklini tamamen dönüştürmeye başladı.

## AI Destekli Geliştirme Araçları

### Code Generation (Kod Üretimi)
AI araçları artık sadece kod tamamlama yapmıyor, tam fonksiyonlar ve hatta bütün bileşenler yazabiliyor:

\\\`\\\`\\\`javascript
// AI tarafından üretilen React bileşeni örneği
const UserProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  
  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      await updateUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* AI-generated form component */}
    </div>
  );
};
\\\`\\\`\\\`

### Test Generation (Test Üretimi)
AI, unit testler ve integration testler yazma konusunda da oldukça başarılı.

## Geliştirme Sürecindeki Değişimler

### Daha Hızlı Prototype Geliştirme
AI araçları sayesinde:
- **MVP'ler** daha hızlı hayata geçiyor
- **Boilerplate kod** otomatik üretiliyor  
- **API entegrasyonları** kolaylaşıyor

### Code Review ve Refactoring
AI artık kod kalitesini artırmada da yardımcı:
- Performance optimizasyonları önerme
- Security vulnerability tespiti
- Code smell detection
- Automated refactoring suggestions

## Framework-Specific AI Tools

### React Ecosystem
- **React Copilot**: JSX ve hooks için AI assistance
- **Next.js AI**: SSR/SSG optimizasyonları
- **Tailwind AI**: CSS class önerileri

### Backend Development  
- **API Design**: RESTful endpoint generation
- **Database Schema**: Prisma schema optimization
- **Error Handling**: Exception handling patterns

## Gelecek Trendleri

### 1. No-Code/Low-Code Evolution
AI araçları no-code platformları daha güçlü hale getiriyor:
- Visual programming interfaces
- Natural language to code conversion
- Automated deployment pipelines

### 2. Intelligent DevOps
- **Auto-scaling**: AI-driven resource optimization
- **Monitoring**: Predictive analytics for system health
- **CI/CD**: Self-healing deployment pipelines

### 3. Personalized Development Experience
- **Learning Adaptation**: AI tools that learn from your coding style
- **Context Awareness**: Project-specific suggestions
- **Team Collaboration**: AI-facilitated code reviews

## Challenges ve Considerations

### Code Quality Concerns
- AI-generated code'un maintainability'si
- Over-dependency riski
- Technical debt accumulation

### Security Implications
- AI tools'un security best practices bilgisi
- Generated code'da vulnerability'ler
- Data privacy concerns

### Learning Curve Impact
- Junior developers için AI dependency
- Core programming skills atrophy
- Problem-solving ability degradation

## Best Practices

### 1. AI as Assistant, Not Replacement
AI-generated kodu her zaman review edin:
- Logic accuracy
- Performance implications  
- Security considerations
- Code consistency

### 2. Domain Knowledge Remains Critical
AI tools sadece syntax ve patterns konusunda yardımcı. Business logic ve architecture decisions hala developer'a ait.

## Sonuç

AI, web geliştirme dünyasında çok güçlü bir assistant olarak yerini aldı. Ancak successful AI integration için:

- **Balance** gerekli: AI efficiency ile human creativity
- **Continuous Learning**: AI tools sürekli evolve ediyor
- **Critical Thinking**: AI suggestions'ı her zaman evaluate edin
- **Best Practices**: Code quality standards'ları maintain edin

Gelecek, AI ile human developers arasındaki collaborative relationship'e dayalı olacak. Bu partnership'te success anahtarı, AI'ın gücünü leveraging ederken, core development skills ve critical thinking'i maintain etmek.`,
    tags: ['AI', 'Web Development', 'Future Tech', 'JavaScript', 'React'],
    coverImage: null,
    isFeatured: true,
    published: true,
    publishedAt: new Date('2024-10-28')
  },

  // REGULAR POSTS
  {
    title: "Next.js 14 ile Modern Web Uygulaması Geliştirme",
    excerpt: "Next.js 14'ün getirdiği yenilikler: App Router, Server Components, ve Turbopack ile performans odaklı web uygulamaları nasıl geliştirilir?",
    content: `# Next.js 14 ile Modern Web Uygulaması Geliştirme

Next.js 14, web development dünyasında önemli yenilikler getirdi. Bu yazıda, en önemli features'ları ve best practices'i keşfedeceğiz.

## App Router Revolution

### File-based Routing 2.0
\\\`\\\`\\\`
app/
├── layout.tsx          // Root layout
├── page.tsx           // Home page
├── blog/
│   ├── layout.tsx     // Blog layout
│   ├── page.tsx       // Blog list
│   └── [slug]/
│       └── page.tsx   // Dynamic blog post
└── api/
    └── posts/
        └── route.ts   // API endpoint
\\\`\\\`\\\`

### Server Components by Default
Server Components artık default olarak geliyor, bu da performance'ı önemli ölçüde artırıyor.

## Performance Optimizations

### Turbopack Integration
- **70% faster** cold starts
- **90% faster** incremental builds  
- **Hot Module Replacement** improvements

### Image Optimization
Next.js Image component'i automatic optimization sağlıyor.

## Data Fetching Patterns

### Server-side Data Fetching
Server Components ile direct database access mümkün.

### Client-side with SWR
Client-side data fetching için SWR integration mükemmel çalışıyor.

## Deployment Strategies

### Vercel Integration
- Zero-config deployment
- Automatic HTTPS
- Edge Functions support
- Analytics integration

### Self-hosting Options
- Docker containerization  
- Standalone output
- Custom server configuration

Modern web development artık çok daha accessible ve powerful!`,
    tags: ['Next.js', 'React', 'Web Development', 'JavaScript', 'Performance'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-25')
  },

  {
    title: "İstanbul'da Gizli Kalmış 5 Muhteşem Mekan",
    excerpt: "İstanbul'un kalabalık turistik yerlerinden sıkıldınız mı? Şehrin en güzel gizli hazinelerini keşfetmenin zamanı geldi. Yerel halkın bile bilmediği özel yerler!",
    content: `# İstanbul'da Gizli Kalmış 5 Muhteşem Mekan

İstanbul, milyonlarca turistin ziyaret ettiği bir şehir ama hala keşfedilmeyi bekleyen gizli köşeleri var. Bu yazıda, rehberlerde geçmeyen özel mekanları paylaşıyorum.

## 1. Kuzguncuk'ta Saklı Bahçe Cafe

### Nasıl Gidilir?
Üsküdar iskelesinden 15B otobüsü ile Kuzguncuk'a inin. Köprü altındaki dar sokaktan yürüyün.

### Neden Özel?
- Boğaz manzaralı terrası
- Ev yapımı lezzetler
- Kedilerle dolu bahçe
- Kitap okuma köşeleri

### Tavsiye Edilenler
- **Kahvaltı**: Kuzguncuk special plate (₺85)
- **İçecek**: Ev yapımı limonata (₺25)
- **Tatlı**: Cheesecake with seasonal fruits (₺45)

## 2. Balat'ta Rengarenk Evler Arası Atölye

### Lokasyon
Vodina Caddesi'nden çıkan merdivenli sokakta, 3. kattan açılan terrasta.

### Özellikler
- Seramik ve takı atölyesi
- Workshop'lara katılım mümkün
- Handmade souvenirler
- Sunset viewing point

### Çalışma Saatleri
- **Hafta içi**: 10:00-18:00
- **Hafta sonu**: 09:00-20:00
- **Workshop'lar**: Cumartesi 14:00-17:00

## 3. Emirgan'da Orman İçi Piknik Alanı

### Ulaşım
Emirgan Park'tan yürüyerek 10 dakika, ana yoldan sapan patika.

### Aktiviteler
- **Doğa yürüyüşü**: 2km circular trail
- **Kuş gözlemleme**: Özel observation deck
- **Yoga sessions**: Hafta sonu sabah 08:00
- **Photography tours**: Professional guided

## 4. Kadıköy'de Underground Müzik Mekanı

### Giriş
Bahariye Caddesi'ndeki kitapçının arka kapısından basement'a.

### Programlar
- **Pazartesi**: Acoustic nights
- **Çarşamba**: Jazz sessions  
- **Cuma**: Electronic music
- **Pazar**: Open mic nights

### Atmosfer
- Vintage vinyl collection
- Exposed brick walls
- Cozy seating areas
- Craft cocktails

## 5. Beyoğlu'nda Çatı Katı Sanat Galerisi

### Erişim
Galata Kulesi yakınlarında, eski apartment building'in 6. katı.

### Sergi Alanları
- **Ana salon**: Contemporary art
- **Küçük oda**: Photography exhibitions
- **Terrace**: Sculpture garden
- **Workshop space**: Art classes

Bu gizli mekanlar İstanbul'un authentic ruhunu yansıtıyor. Her birini ziyaret ederken, şehrin local life'ından bir parça taşıyacaksınız eve.`,
    tags: ['İstanbul', 'Seyahat', 'Gizli Mekanlar', 'Yerel Rehber', 'Kültür'],
    coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-20')
  },

  {
    title: "TypeScript ile Type-Safe API Development",
    excerpt: "Backend ve frontend'te type safety sağlamak için TypeScript best practices. End-to-end type safety ile bug-free API geliştirme teknikleri.",
    content: `# TypeScript ile Type-Safe API Development

Modern web development'te type safety, code quality ve developer experience için kritik önem taşıyor. Bu yazıda, TypeScript ile end-to-end type-safe API geliştirme tekniklerini inceleyeceğiz.

## API Contract Definition

### Shared Types
TypeScript ile frontend ve backend arasında type sharing mümkün:

\\\`\\\`\\\`typescript
// types/api.ts - Shared between frontend & backend
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
\\\`\\\`\\\`

## Backend Implementation

### Express with TypeScript
Type-safe Express controllers:

\\\`\\\`\\\`typescript
import { Request, Response } from 'express';
import { CreateUserRequest, User, ApiResponse } from '../types/api';

interface TypedRequest<T> extends Request {
  body: T;
}

export const createUser = async (
  req: TypedRequest<CreateUserRequest>,
  res: Response<ApiResponse<User>>
) => {
  try {
    const { email, name, password } = req.body;
    
    const user = await userService.create({
      email,
      name,
      passwordHash: await bcrypt.hash(password, 10)
    });

    res.status(201).json({
      data: user,
      message: 'User created successfully',
      status: 201
    });
  } catch (error) {
    res.status(500).json({
      data: null as any,
      message: 'Internal server error',
      status: 500
    });
  }
};
\\\`\\\`\\\`

## Frontend API Client

### Type-Safe HTTP Client
Client-side için type-safe API client:

\\\`\\\`\\\`typescript
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
    return response.json();
  }

  async post<TRequest, TResponse>(
    endpoint: string, 
    data: TRequest
  ): Promise<ApiResponse<TResponse>> {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
\\\`\\\`\\\`

### React Query Integration
React Query ile type-safe data fetching:

\\\`\\\`\\\`typescript
import { useQuery, useMutation } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: CreateUserRequest) =>
      apiClient.post<CreateUserRequest, User>('/users', userData),
  });
};
\\\`\\\`\\\`

## Advanced Type Patterns

### Generic API Hooks
Generic patterns ile kod tekrarından kaçınma:

\\\`\\\`\\\`typescript
function useApiQuery<T>(endpoint: string) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => apiClient.get<T>(endpoint),
  });
}

function useApiMutation<TRequest, TResponse>(endpoint: string) {
  return useMutation({
    mutationFn: (data: TRequest) =>
      apiClient.post<TRequest, TResponse>(endpoint, data),
  });
}
\\\`\\\`\\\`

## Validation with Zod

### Schema Definition
Zod ile runtime validation:

\\\`\\\`\\\`typescript
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
\\\`\\\`\\\`

Type-safe API development, uzun vadede development velocity'yi artırırken bug count'unu dramatically azaltıyor!`,
    tags: ['TypeScript', 'API Development', 'Type Safety', 'Backend', 'Frontend'],
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-18')
  },

  {
    title: "Remote Çalışmanın Productivity Sırları",
    excerpt: "3 yıllık remote work experience'dan elde ettiğim productivity hacks. Home office setup'tan time management'a kadar everything you need to know!",
    content: `# Remote Çalışmanın Productivity Sırları

3 yıldır tamamen remote çalışıyorum ve bu süreçte productivity konusunda çok şey öğrendim. Bu yazıda, en etkili bulduğum yöntemleri paylaşacağım.

## Home Office Setup Essentials

### Hardware Investments
**Monitor Setup**: Dual monitor configuration
- Primary: 27" 4K monitor for main work
- Secondary: 24" vertical monitor for code/documentation
- **Cost**: ~₺8,000 total
- **ROI**: Productivity increase %40+

**Ergonomic Workspace**:
- **Chair**: Herman Miller Aeron alternative (₺3,500)
- **Desk**: Height-adjustable standing desk (₺2,800)
- **Keyboard**: Mechanical keyboard (₺1,200)
- **Mouse**: Vertical ergonomic mouse (₺450)

### Lighting & Environment
**Natural Light Optimization**:
- Desk positioning: Side light, not backlight
- Window treatments: Adjustable blinds
- Evening work: Warm LED strips (2700K-3000K)

**Air Quality**:
- Air purifier with HEPA filter
- Plants: Snake plant, Pothos, Peace lily
- Humidity control: 40-60% optimal range

## Time Management Systems

### The Modified Pomodoro Technique
**Classic Pomodoro Problems**:
- Too rigid for complex tasks
- Interruptions break flow state
- 25 minutes often insufficient

**My Modified Version**:
- **Deep Work Blocks**: 90-minute focused sessions
- **Break Pattern**: 15-minute active breaks
- **Context Switching**: Maximum 3 different types of tasks per day

### Time Blocking Strategy
\\\`\\\`\\\`
09:00-10:30  Deep Work Block 1 (Development)
10:30-10:45  Active Break
10:45-12:15  Deep Work Block 2 (Development)
12:15-13:15  Lunch & Walk
13:15-14:00  Communication Block (Emails, Slack)
14:00-15:30  Deep Work Block 3 (Planning/Design)
15:30-15:45  Break
15:45-17:00  Meetings/Collaboration
17:00-17:15  Daily Planning for Tomorrow
\\\`\\\`\\\`

## Digital Productivity Tools

### Task Management
**Primary System**: Notion + Todoist Integration
- **Project Planning**: Notion databases
- **Daily Tasks**: Todoist with natural language
- **Knowledge Base**: Notion wiki structure

### Communication Management
**Slack Optimization**:
- **Notification Schedule**: 9 AM - 6 PM only
- **Channel Strategy**: Mute non-essential channels
- **Status Updates**: Automatic status based on calendar

**Email Batching**:
- **Check Times**: 10 AM, 2 PM, 5 PM only
- **Response Time**: Same day for important, 24h for others
- **Templates**: Pre-written responses for common requests

## Focus & Deep Work Strategies

### Distraction Elimination
**Digital Distractions**:
- **Website Blocker**: Cold Turkey (₺150/year)
- **Phone Management**: Airplane mode during deep work
- **Notification Audit**: Only essential apps allowed

**Environmental Control**:
- **Noise Management**: Noise-canceling headphones
- **Visual Clutter**: Minimalist workspace design
- **Family Boundaries**: Clear "do not disturb" signals

### Flow State Triggers
**Music Strategy**:
- **Coding**: Ambient/instrumental playlists
- **Writing**: Nature sounds or complete silence
- **Creative Work**: Lo-fi hip hop or classical

**Pre-Work Rituals**:
1. **Morning Routine**: Coffee + 5-minute meditation
2. **Workspace Prep**: Clear desk, water bottle, notebook
3. **Intention Setting**: What will I accomplish today?
4. **Energy Check**: Am I ready for deep work?

## Health & Wellbeing Integration

### Physical Activity
**Movement Schedule**:
- **Morning**: 10-minute stretching routine
- **Breaks**: Walk or light exercise
- **Lunch**: 20-minute walk outside
- **Evening**: Gym or yoga session

**Workstation Ergonomics**:
- **20-20-20 Rule**: Every 20 minutes, look at something 20 feet away for 20 seconds
- **Standing Breaks**: 10 minutes every hour
- **Posture Check**: Hourly posture assessment

### Mental Health Maintenance
**Stress Management**:
- **Daily Meditation**: 10 minutes using Headspace
- **Journaling**: Evening reflection practice
- **Boundaries**: Clear start/end work times
- **Social Connection**: Regular video calls with colleagues

## Communication & Collaboration

### Meeting Optimization
**Meeting Hygiene**:
- **Default**: 25 or 50 minutes (not 30/60)
- **Agenda**: Always prepared beforehand  
- **Action Items**: Clear ownership and deadlines
- **Follow-up**: Summary within 2 hours

**Video Call Best Practices**:
- **Camera**: Always on for important meetings
- **Lighting**: Face the light source
- **Background**: Professional or blurred
- **Audio**: Good microphone essential

### Asynchronous Communication
**Documentation Culture**:
- **Decision Records**: Why and how decisions made
- **Process Documentation**: Standard operating procedures
- **Knowledge Sharing**: Regular team knowledge sessions

**Status Updates**:
- **Daily Standups**: Asynchronous via Slack
- **Weekly Reviews**: Personal productivity assessment
- **Monthly Retrospectives**: What worked, what didn't

## Continuous Improvement

### Weekly Review Process
**Friday Afternoon Ritual**:
1. **Task Completion Review**: What was accomplished?
2. **Time Analysis**: Where did time go?
3. **Productivity Assessment**: What worked well?
4. **Next Week Planning**: Priorities and goals
5. **System Adjustments**: Small tweaks to improve

Remote work success'i consistency'de. Bu systematic approaches'ı implement ederek, office'ten daha productive çalışabilirsiniz!`,
    tags: ['Remote Work', 'Productivity', 'Kişisel Gelişim', 'Work-Life Balance', 'Time Management'],
    coverImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-15')
  },

  {
    title: "React 19: Yenilikleri ve Migration Guide",
    excerpt: "React 19'un getirdiği revolutionary features: Actions, use() hook, Server Components improvements. Production'a geçiş için complete migration strategy.",
    content: `# React 19: Yenilikleri ve Migration Guide

React 19, web development paradigmlarını değiştirecek major updates getiriyor. Bu comprehensive guide'da, yenilikleri ve migration strategy'yi detaylıca inceleyeceğiz.

## Major New Features

### React Actions
**Form Handling Revolution**

React 19 ile form handling çok daha basit hale geldi:

\\\`\\\`\\\`tsx
function ContactForm() {
  async function submitForm(formData: FormData) {
    const result = await sendEmail({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    });
    
    if (result.error) {
      throw new Error(result.error);
    }
  }

  return (
    <form action={submitForm}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send Message</button>
    </form>
  );
}
\\\`\\\`\\\`

### use() Hook
**Async Data Fetching Simplified**

\\\`\\\`\\\`tsx
import { use } from 'react';

function UserProfile({ userIdPromise }) {
  const userId = use(userIdPromise);
  const user = use(fetchUser(userId));
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
\\\`\\\`\\\`

### useOptimistic Hook
**Optimistic Updates Made Easy**

\\\`\\\`\\\`tsx
import { useOptimistic } from 'react';

function PostLikes({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (currentLikes, incrementBy) => currentLikes + incrementBy
  );

  async function likePost() {
    addOptimisticLike(1);
    
    try {
      await updatePostLikes(postId);
    } catch (error) {
      // Revert will happen automatically
      toast.error('Failed to like post');
    }
  }

  return (
    <button onClick={likePost}>
      👍 {optimisticLikes}
    </button>
  );
}
\\\`\\\`\\\`

## Migration Strategy

### Phase 1: Preparation (Week 1-2)
**Dependency Audit**
Package.json updates needed:
- React 19.0.0
- React-dom 19.0.0
- TypeScript latest version
- Third-party library compatibility audit

### Phase 2: Core Migration (Week 3-4)
**Step-by-step Process**:

1. Update Dependencies
2. Fix Breaking Changes
3. Update Form Handling

### Phase 3: Feature Adoption (Week 5-8)
**Gradual Feature Integration**:

1. Replace useEffect with use() hook
2. Implement Optimistic Updates
3. Migrate forms to Actions

## Performance Improvements

### Automatic Batching Enhancements
React 19 batches more updates automatically, improving performance significantly.

### Concurrent Features Stability
useTransition ve useDeferredValue improvements.

## Testing Strategy

### Updated Testing Patterns
Testing Actions ve yeni hooks için updated patterns.

### Performance Testing
useTransition behavior testing strategies.

## Production Considerations

### Bundle Size Impact
- React 19 core: ~5% smaller than React 18
- New features add minimal overhead
- Better tree-shaking for unused features

### Browser Support
- Maintains React 18 browser support
- IE 11 officially dropped
- Enhanced modern browser optimizations

React 19, frontend development'i bir sonraki seviyeye taşıyor. Careful migration ve strategic adoption ile, bu powerful features'dan maksimum fayda sağlayabilirsiniz!`,
    tags: ['React', 'JavaScript', 'Web Development', 'Frontend', 'Migration'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-12')
  },

  {
    title: "Kapadokya Balon Turu: Ultimate Travel Guide",
    excerpt: "Kapadokya'da unutulmaz bir balon experience için everything you need to know. Best seasons, booking tips, photography secrets ve hidden gems!",
    content: `# Kapadokya Balon Turu: Ultimate Travel Guide

Kapadokya'da balon turu, bucket list'te mutlaka olması gereken experiences'dan biri. 5 kere gittiğim deneyimimle, en detaylı guide'ı hazırladım.

## Best Time to Visit

### Seasonal Breakdown
**Sonbahar (September-November)**: ⭐⭐⭐⭐⭐
- **Weather**: Perfect flying conditions
- **Crowds**: Moderate, manageable
- **Prices**: Mid-range, reasonable
- **Photography**: Golden autumn colors

**İlkbahar (March-May)**: ⭐⭐⭐⭐
- **Weather**: Good, occasional wind
- **Crowds**: Increasing towards May
- **Prices**: Rising season prices
- **Photography**: Wildflowers blooming

**Yaz (June-August)**: ⭐⭐⭐
- **Weather**: Hot but stable
- **Crowds**: Peak tourist season
- **Prices**: Highest of the year
- **Photography**: Clear skies, harsh light

**Kış (December-February)**: ⭐⭐
- **Weather**: Unpredictable, many cancellations
- **Crowds**: Lowest
- **Prices**: Cheapest deals
- **Photography**: Snow-covered landscape

### Daily Timing Optimization
**Morning Flights (04:30-07:00)**: 
- **Pros**: Magical sunrise, calm winds, best photography light
- **Cons**: Very early wake-up call
- **Recommendation**: Always choose morning if available

**Evening Flights (17:00-19:30)**:
- **Pros**: Sunset views, more relaxed timing
- **Cons**: Higher winds, less reliable weather
- **Recommendation**: Good backup option

## Booking Strategy

### Company Selection Criteria
**Premium Companies (₺600-800)**:
- **Butterfly Balloons**: Best safety record, small baskets (16-20 people)
- **Royal Balloon**: Luxury experience, champagne service
- **Cappadocia Balloons**: Professional photography service

**Mid-Range Options (₺400-600)**:
- **Göreme Balloons**: Good value, reliable service
- **Turkiye Balloons**: Local favorite, authentic experience
- **Anatolian Balloons**: Family-owned, personal touch

**Budget Airlines (₺250-400)**:
- **Atlas Balloons**: Basic but safe
- **Voyager Balloons**: Large baskets (24-28 people)
- **Urgup Balloons**: Local operator

### Booking Timeline
**2-3 Months Ahead**: 
- Best price guarantees
- Choice of premium companies
- Preferred date selection

**1 Month Ahead**:
- Still good options available
- Slightly higher prices
- Some date flexibility needed

**Same Week**:
- Limited availability  
- Highest prices
- Last-minute cancellation deals possible

## Preparation Essentials

### Clothing Guide
**Layer System**:
- Base Layer: Thermal underwear (October-March)
- Mid Layer: Fleece or light sweater  
- Outer Layer: Wind-resistant jacket
- Bottom: Comfortable jeans or hiking pants
- Feet: Closed-toe shoes (mandatory), no sandals
- Head: Beanie or cap (wind protection)

**Photography Gear**:
- **Camera**: DSLR or high-end smartphone
- **Lens**: Wide-angle for landscape shots
- **Accessories**: Extra batteries (cold drains power)
- **Storage**: Multiple memory cards
- **Protection**: Camera strap, secure bag

### Health Considerations
**Motion Sickness**:
- Take medication 1 hour before flight
- Eat light breakfast
- Focus on horizon, not down
- Inform pilot if feeling unwell

**Height Anxiety**:
- Baskets have high walls (waist-level)
- Movement is very gentle
- Pilots are experienced with anxious passengers
- Consider shorter flight duration

## Photography Masterclass

### Camera Settings
**Manual Mode Recommendations**:

Sunrise Shots:
- ISO: 400-800
- Aperture: f/8-f/11  
- Shutter: 1/125s - 1/250s
- Focus: Infinity

Landscape Shots:
- ISO: 100-200
- Aperture: f/8-f/16
- Shutter: 1/60s - 1/125s
- Format: RAW for post-processing

**Composition Tips**:
- **Rule of Thirds**: Horizon on lower third
- **Leading Lines**: Use other balloons as foreground
- **Scale**: Include people for size reference
- **Layers**: Foreground balloons, valley, distant mountains

### Shot List Checklist
**Must-Have Shots**:
- Balloon inflation process
- Inside basket group photo
- Sunrise over Cappadocia valleys
- Other balloons at same level
- Aerial view of fairy chimneys
- Landing celebration
- Certificate ceremony

**Creative Ideas**:
- **Silhouette**: People against sunrise
- **Details**: Basket texture, ropes, instruments
- **Panoramic**: Wide valley views
- **Action**: Balloon inflation, pilot work
- **Emotional**: Reactions, celebrations

## Hidden Gems & Extra Activities

### Lesser-Known Viewpoints
**Uchisar Castle Sunrise** (Free):
- Best balloon watching point
- 360-degree valley views
- Less crowded than Love Valley
- Perfect for non-flying partners

**Çavuşin Village Sunrise**:
- Authentic local experience
- Traditional breakfast with view
- Historical cave churches nearby
- Local guide recommendations

**Pasabag Valley Walk**:
- Fairy chimney close-ups
- Morning light photography
- Monk Valley exploration
- Peaceful atmosphere

### Cultural Experiences
**Post-Flight Activities**:
- **Göreme Open Air Museum**: UNESCO site, Byzantine art
- **Derinkuyu Underground City**: Ancient 8-level city
- **Avanos Pottery Workshop**: Traditional ceramic making
- **Local Winery**: Cappadocian wine tasting

**Authentic Dining**:
- **Seki Restaurant**: Modern Turkish cuisine, cave setting
- **Old Greek House**: Traditional Ottoman mansion
- **Topdeck Cave Restaurant**: Local specialties, authentic atmosphere
- **Ziggy Cafe**: Best coffee, cozy environment

## Practical Information

### Transportation
**Airport Transfers**:
- **Kayseri Airport (60km)**: Shuttle ₺25, taxi ₺200
- **Nevşehir Airport (40km)**: Shuttle ₺20, taxi ₺150
- **Private Transfer**: Book with balloon company

**Local Transportation**:
- **ATV Tours**: ₺150-200 for sunset tours
- **Red/Green Tour**: ₺100-150 full-day guided tours
- **Car Rental**: ₺200-300/day, good for flexibility
- **Walking**: Göreme village walkable, everything nearby

### Accommodation Recommendations
**Luxury Cave Hotels (₺800-1500/night)**:
- **Museum Hotel**: Antique collection, stunning views
- **Argos in Cappadocia**: Restored monastery, ultimate luxury
- **Doors of Cappadocia**: Boutique cave experience

**Mid-Range Options (₺300-600/night)**:
- **Kelebek Special Cave Hotel**: Authentic cave rooms
- **Stone House Cave Hotel**: Family-run, personal service
- **Travellers Cave Hotel**: Great location, good value

**Budget Friendly (₺100-250/night)**:
- **Shoestring Cave House**: Backpacker favorite
- **Fairy Chimney Inn**: Clean, basic cave rooms  
- **Koza Cave Hotel**: Local hospitality, central location

## Weather & Cancellation Policies

### Flight Conditions
**Safe Flying Weather**:
- Wind speed: <10 knots
- Visibility: >5km
- No precipitation
- Cloud ceiling: >1000 feet

**Cancellation Probability by Month**:
- **January-February**: 40-50% cancellation rate
- **March-April**: 20-30% cancellation rate  
- **May-October**: 5-15% cancellation rate
- **November-December**: 25-35% cancellation rate

### Backup Plans
**If Flight Cancelled**:
- **Full refund**: Usually provided same day
- **Reschedule**: Next available slot
- **Alternative activity**: ATV tour, hot springs
- **Extended stay**: Many choose to stay extra day

## Budget Planning

### Cost Breakdown
**Flight Costs**:
- **Budget**: ₺250-400 per person
- **Standard**: ₺400-600 per person
- **Premium**: ₺600-800 per person
- **Private**: ₺1500-3000 per basket (2-4 people)

**Total Trip Budget** (per person, 2 nights):

Accommodation: ₺200-800
Flight: ₺250-800
Meals: ₺150-300
Transportation: ₺100-200
Activities: ₺200-400
Souvenirs: ₺50-200

Total: ₺950-2700

### Money-Saving Tips
- **Off-season travel**: November-February (except New Year)
- **Midweek stays**: Sunday-Thursday cheaper
- **Package deals**: Flight + hotel combinations
- **Group bookings**: 4+ people discounts
- **Local operators**: Often better prices than international sites

## Safety & Regulations

### Safety Standards
**Pilot Qualifications**:
- Commercial balloon pilot license required
- Minimum 500 flight hours experience
- Annual safety certifications mandatory
- English language proficiency tested

**Equipment Standards**:
- **Balloons**: Inspected every 100 flight hours
- **Baskets**: Weight limits strictly enforced
- **Insurance**: Comprehensive coverage mandatory
- **Communication**: Radio contact with ground control

### Passenger Safety
**Pre-Flight Briefing**:
- Landing position demonstration
- Emergency procedures explanation  
- Basket safety rules
- Photography guidelines

**During Flight**:
- Always hold basket handles
- No leaning over basket edge
- Follow pilot instructions immediately
- Report any concerns instantly

Kapadokya balon experience, life-changing moments create eder. Bu guide'ı follow ederek, unforgettable memories garantili!`,
    tags: ['Kapadokya', 'Seyahat', 'Balon Turu', 'Photography', 'Travel Guide'],
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-08')
  },

  {
    title: "Docker ile Microservices: Production Ready Setup",
    excerpt: "Docker containers ile scalable microservices architecture. Container orchestration, service discovery, monitoring ve security best practices.",
    content: `# Docker ile Microservices: Production Ready Setup

Modern software architecture'da microservices pattern'i implement etmek için Docker essential bir tool. Bu yazıda, production-ready Docker microservices setup'ını detaylıca ele alacağız.

## Architecture Overview

### Container-Based Microservices
Docker ile her service isolated container'da çalışır:

- **User Service**: Authentication & user management
- **Product Service**: Product catalog & inventory
- **Order Service**: Order processing & payment
- **Notification Service**: Email & push notifications
- **API Gateway**: Request routing & load balancing

### Service Communication
**Synchronous**: REST APIs via HTTP/HTTPS
**Asynchronous**: Message queues (Redis, RabbitMQ)
**Service Discovery**: Docker Compose networks, Consul

## Docker Configuration

### Multi-Stage Dockerfile
**Node.js Service Example**:

\\\`\\\`\\\`dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
\\\`\\\`\\\`

### Docker Compose Setup
**Multi-Service Orchestration**:

\\\`\\\`\\\`yaml
version: '3.8'

services:
  # API Gateway - Entry point
  api-gateway:
    build: ./gateway
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - user-service
      - product-service
      - order-service
    networks:
      - microservices-network
    restart: unless-stopped

  # User Management Service
  user-service:
    build: ./user-service
    environment:
      - DATABASE_URL=postgresql://user:pass@user-db:5432/users
      - JWT_SECRET=your-jwt-secret
      - REDIS_URL=redis://redis:6379
    depends_on:
      - user-db
      - redis
    networks:
      - microservices-network
    restart: unless-stopped

  # Product Catalog Service
  product-service:
    build: ./product-service
    environment:
      - DATABASE_URL=postgresql://product:pass@product-db:5432/products
      - ELASTICSEARCH_URL=http://elasticsearch:9200
    depends_on:
      - product-db
      - elasticsearch
    networks:
      - microservices-network
    restart: unless-stopped

  # Order Processing Service
  order-service:
    build: ./order-service
    environment:
      - DATABASE_URL=postgresql://order:pass@order-db:5432/orders
      - PAYMENT_API_KEY=your-payment-key
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - order-db
      - rabbitmq
    networks:
      - microservices-network
    restart: unless-stopped

  # Databases
  user-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: users
    volumes:
      - user_data:/var/lib/postgresql/data
    networks:
      - microservices-network

  product-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: product
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: products
    volumes:
      - product_data:/var/lib/postgresql/data
    networks:
      - microservices-network

  order-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: order
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: orders
    volumes:
      - order_data:/var/lib/postgresql/data
    networks:
      - microservices-network

  # Supporting Services
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - microservices-network

  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    ports:
      - "15672:15672"  # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - microservices-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - microservices-network

networks:
  microservices-network:
    driver: bridge

volumes:
  user_data:
  product_data:
  order_data:
  redis_data:
  rabbitmq_data:
  elasticsearch_data:
\\\`\\\`\\\`

## Service Implementation

### API Gateway Configuration
**NGINX-based Gateway**:

\\\`\\\`\\\`nginx
upstream user-service {
    server user-service:3000;
}

upstream product-service {
    server product-service:3000;
}

upstream order-service {
    server order-service:3000;
}

server {
    listen 3000;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
    
    # User service routes
    location /api/users {
        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Product service routes
    location /api/products {
        proxy_pass http://product-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Order service routes
    location /api/orders {
        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\\\`\\\`\\\`

## Container Health Monitoring

### Health Checks
**Dockerfile Health Check**:

\\\`\\\`\\\`dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
\\\`\\\`\\\`

**Application Health Endpoint**:

\\\`\\\`\\\`javascript
// health.js - Service health check
const express = require('express');
const app = express();

app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await database.ping();
    
    // Check external dependencies
    await redis.ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION,
      dependencies: {
        database: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
\\\`\\\`\\\`

## Production Deployment

### Docker Swarm Setup
**Swarm Initialization**:

\\\`\\\`\\\`bash
# Initialize Docker Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml microservices

# Scale services
docker service scale microservices_user-service=3
docker service scale microservices_product-service=2
\\\`\\\`\\\`

### Security Best Practices
**Container Security**:

1. **Non-root User**: Always run containers as non-root
2. **Image Scanning**: Scan for vulnerabilities
3. **Secrets Management**: Use Docker secrets
4. **Network Isolation**: Separate networks for different layers
5. **Resource Limits**: Set memory and CPU limits

**Docker Compose Security**:

\\\`\\\`\\\`yaml
services:
  user-service:
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    
    # Security options
    security_opt:
      - no-new-privileges:true
    
    # Read-only root filesystem
    read_only: true
    
    # Temporary filesystem for writable directories
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
\\\`\\\`\\\`

## Monitoring & Observability

### Prometheus + Grafana Stack
**Monitoring Services**:

\\\`\\\`\\\`yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - microservices-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - microservices-network
\\\`\\\`\\\`

### Application Metrics
**Express.js Metrics Example**:

\\\`\\\`\\\`javascript
// metrics.js - Application metrics
const promClient = require('prom-client');

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestsTotal.inc(labels);
  });
  
  next();
};

module.exports = { metricsMiddleware };
\\\`\\\`\\\`

## CI/CD Pipeline

### GitHub Actions Workflow
**Build and Deploy**:

\\\`\\\`\\\`yaml
name: Microservices CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Registry
      uses: docker/login-action@v2
      with:
        registry: your-registry.com
        username: \${{ secrets.DOCKER_USERNAME }}
        password: \${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push services
      run: |
        docker-compose -f docker-compose.ci.yml build
        docker-compose -f docker-compose.ci.yml push
    
    - name: Run tests
      run: |
        docker-compose -f docker-compose.test.yml up --abort-on-container-exit
    
    - name: Deploy to staging
      if: github.ref == 'refs/heads/main'
      run: |
        docker stack deploy -c docker-compose.prod.yml microservices
\\\`\\\`\\\`

Docker ile microservices architecture, scalability ve maintainability açısından büyük avantajlar sağlıyor. Proper setup ve monitoring ile production-ready system oluşturabilirsiniz!`,
    tags: ['Docker', 'Microservices', 'DevOps', 'Architecture', 'Containers'],
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop',
    isFeatured: false,
    published: true,
    publishedAt: new Date('2024-10-05')
  }
];

async function createTestPosts() {
  try {
    console.log('🚀 Creating test blog posts...');
    
    // Clear existing posts (optional)
    const existingPosts = await prisma.blogPost.findMany();
    if (existingPosts.length > 0) {
      console.log(`Found ${existingPosts.length} existing posts. Deleting them first...`);
      await prisma.blogPost.deleteMany();
      console.log('✅ Cleared existing posts');
    }

    // Create new test posts
    const createdPosts = [];
    
    for (const postData of testPosts) {
      const slug = createSlug(postData.title);
      const readTime = calculateReadTime(postData.content);
      
      const post = await prisma.blogPost.create({
        data: {
          ...postData,
          slug,
          readTime
        }
      });
      
      createdPosts.push(post);
      console.log(`✅ Created post: ${post.title} (${post.isFeatured ? 'FEATURED' : 'REGULAR'})`);
    }

    console.log('\n🎉 Test blog posts created successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`- Total posts: ${createdPosts.length}`);
    console.log(`- Featured posts: ${createdPosts.filter(p => p.isFeatured).length}`);
    console.log(`- Regular posts: ${createdPosts.filter(p => !p.isFeatured).length}`);
    console.log(`- Published posts: ${createdPosts.filter(p => p.published).length}`);
    
    console.log(`\n🏷️  Categories created:`);
    const allTags = [...new Set(createdPosts.flatMap(p => p.tags))];
    allTags.forEach(tag => {
      const count = createdPosts.filter(p => p.tags.includes(tag)).length;
      console.log(`- ${tag}: ${count} posts`);
    });

    console.log(`\n🌐 You can now visit:`);
    console.log(`- Blog page: http://localhost:3000/blog`);
    console.log(`- Admin dashboard: http://localhost:3000/admin/dashboard`);
    console.log(`- Individual posts: http://localhost:3000/blog/[slug]`);

  } catch (error) {
    console.error('❌ Error creating test posts:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestPosts();