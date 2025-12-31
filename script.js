// ============================================
// Vertical Page Indicator - Dikey Sayfa Göstergesi
// ============================================

const verticalIndicator = document.getElementById('verticalIndicator');
const indicatorDots = document.getElementById('indicatorDots');
const progressLine = document.getElementById('progressLine');

// Sayfa başlıkları ve ID'leri
const pageData = [
    { id: 'home', title: 'Ana Sayfa' },
    { id: 'team', title: 'Ekibimiz' },
    { id: '3m-analysis', title: '3M Analizi' },
    { id: 'ebo', title: 'EBO Analizi' },
    { id: 'process-comparison', title: 'Süreç Karşılaştırması' },
    { id: 'power-interest', title: 'Güç/İlgi Matrisi' },
    { id: 'raci', title: 'RACI Matrisi' },
    { id: 'persona', title: 'Persona ve Empati Haritası' },
    { id: 'hmw', title: 'How Might We' },
    { id: 'requirements-pyramid', title: 'Gereksinim Piramidi' },
    { id: 'solution-requirements', title: 'Çözüm Gereksinimleri' },
    { id: 'kano', title: 'Kano Modeli' },
    { id: 'user-stories', title: 'Kullanıcı Hikayeleri' },
    { id: 'invest', title: 'INVEST Analizi' },
    { id: 'uml', title: 'UML Use Case Diyagramı' },
    { id: 'wireframe', title: 'MVP Wireframe Tasarımı' },
    { id: 'storyboard', title: 'Storyboard Hikayeleştirme' },
    { id: 'story-mapping', title: 'User Story Mapping' },
    { id: 'conclusion', title: 'Kapanış' }
];

// Dikey gösterge noktalarını oluştur
function createIndicatorDots() {
    if (!indicatorDots) return;
    
    indicatorDots.innerHTML = '';
    
    pageData.forEach((page, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        dot.setAttribute('data-section', page.id);
        dot.setAttribute('data-index', index);
        
        const tooltip = document.createElement('div');
        tooltip.className = 'indicator-dot-tooltip';
        tooltip.textContent = page.title;
        dot.appendChild(tooltip);
        
        // Tıklama ile scroll
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const section = document.getElementById(page.id);
            if (section) {
                // Section'ın offsetTop değerini al
                let offsetTop = section.offsetTop;
                
                // Eğer section bir parent container içindeyse, parent'ın offsetTop'unu da ekle
                let parent = section.offsetParent;
                while (parent && parent !== document.body) {
                    offsetTop += parent.offsetTop;
                    parent = parent.offsetParent;
                }
                
                // Offset için 20px boşluk bırak
                const targetScroll = Math.max(0, offsetTop - 20);
                
                // Sayfa sonundaki section'lar için maksimum scroll değerini kontrol et
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const finalScroll = Math.min(targetScroll, maxScroll);
                
                window.scrollTo({
                    top: finalScroll,
                    behavior: 'smooth'
                });
            } else {
                // Section bulunamadıysa uyarı (debug için)
                console.warn(`Section with id "${page.id}" not found`);
            }
        });
        
        indicatorDots.appendChild(dot);
    });
    
    // Indicator track yüksekliğini ayarla
    updateIndicatorTrackHeight();
}

// Indicator track yüksekliğini dinamik olarak ayarla
function updateIndicatorTrackHeight() {
    const indicatorTrack = document.querySelector('.indicator-track');
    if (!indicatorTrack) return;
    
    // Nokta sayısına göre minimum yükseklik hesapla
    const dotCount = pageData.length;
    const minHeight = Math.max(400, dotCount * 40); // Her nokta için ~40px
    
    // Viewport yüksekliğine göre maksimum yükseklik
    const maxHeight = window.innerHeight * 0.8; // Viewport'un %80'i
    
    // Final yükseklik
    const finalHeight = Math.min(minHeight, maxHeight);
    
    indicatorTrack.style.height = finalHeight + 'px';
    indicatorTrack.style.minHeight = finalHeight + 'px';
}

// Sayfa göstergesini güncelle
function updateVerticalIndicator() {
    const scrollPosition = window.pageYOffset || window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    let currentSectionId = 'home';
    let currentIndex = 0;
    
    // Sayfa sonuna yaklaşıldığında kontrol (daha geniş bir eşik)
    const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;
    
    // pageData'daki her sayfa için kontrol et
    for (let index = 0; index < pageData.length; index++) {
        const page = pageData[index];
        const section = document.getElementById(page.id);
        if (!section) continue;
        
        // Section'ın gerçek pozisyonunu hesapla
        const rect = section.getBoundingClientRect();
        const sectionTop = scrollPosition + rect.top;
        const sectionHeight = rect.height;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Son sayfa için özel kontrol
        const isLastPage = index === pageData.length - 1;
        
        if (isLastPage && isNearBottom) {
            // Son sayfadayız
            currentSectionId = page.id;
            currentIndex = index;
            break; // Son sayfadayız, döngüden çık
        } else if (scrollPosition + windowHeight / 2 >= sectionTop && scrollPosition + windowHeight / 2 < sectionBottom) {
            // Viewport'un ortası section içindeyse
            currentSectionId = page.id;
            currentIndex = index;
            // Devam et, daha sonraki section'ları da kontrol et (en son eşleşen kazanır)
        } else if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom) {
            // Normal sayfa kontrolü (offset ile)
            currentSectionId = page.id;
            currentIndex = index;
        }
    }
    
    // Aktif noktayı güncelle - pageData index'ine göre
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Progress line'ı güncelle - son sayfalarda da doğru çalışması için
    if (progressLine && documentHeight > windowHeight) {
        const totalScrollable = documentHeight - windowHeight;
        let progress = 0;
        
        if (totalScrollable > 0) {
            progress = (scrollPosition / totalScrollable) * 100;
        }
        
        // Sayfa sonuna yaklaşıldığında %100'e ulaşmasını sağla
        if (scrollPosition + windowHeight >= documentHeight - 10) {
            progress = 100;
        }
        
        progressLine.style.height = Math.min(Math.max(progress, 0), 100) + '%';
    }
}

// Sayfa yüklendiğinde noktaları oluştur
document.addEventListener('DOMContentLoaded', () => {
    createIndicatorDots();
    updateVerticalIndicator();
    
    // Pencere boyutu değiştiğinde indicator track yüksekliğini güncelle
    window.addEventListener('resize', () => {
        updateIndicatorTrackHeight();
        updateVerticalIndicator();
    });
});

// Scroll event'ini throttle ile optimize et
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateVerticalIndicator();
            ticking = false;
        });
        ticking = true;
    }
});

// İlk yüklemede güncelle
updateVerticalIndicator();

// ============================================
// Process Toggle (As-Is / To-Be)
// ============================================

const asIsBtn = document.getElementById('asIsBtn');
const toBeBtn = document.getElementById('toBeBtn');
const asIsView = document.getElementById('asIsView');
const toBeView = document.getElementById('toBeView');

if (asIsBtn && toBeBtn && asIsView && toBeView) {
    asIsBtn.addEventListener('click', () => {
        asIsBtn.classList.add('active');
        toBeBtn.classList.remove('active');
        asIsView.classList.add('active');
        toBeView.classList.remove('active');
    });

    toBeBtn.addEventListener('click', () => {
        toBeBtn.classList.add('active');
        asIsBtn.classList.remove('active');
        toBeView.classList.add('active');
        asIsView.classList.remove('active');
    });
}

// ============================================
// Lightbox Modal - DEVRE DIŞI
// ============================================
// Lightbox özelliği kaldırıldı - görseller tıklanabilir değil

// ============================================
// Scroll Animasyonları
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Animasyon için elementleri seç
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.content-card, .analysis-item, .solution-card, .requirement-item, ' +
        '.use-case-item, .benefit-card, .team-member, .m-analysis-card, ' +
        '.ebo-card, .process-step, .matrix-cell, .persona-card, .hmw-card, ' +
        '.pyramid-level, .req-item, .kano-category, .user-story-card, ' +
        '.invest-item, .storyboard-frame, .finding-card'
    );
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// ============================================
// Smooth Scroll
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 20;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Performans Optimizasyonu
// ============================================

// Throttle fonksiyonu
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Sayfa Yüklendiğinde
// ============================================

window.addEventListener('load', () => {
    // Sayfa yüklendikten sonra animasyonları başlat
    document.body.style.opacity = '1';
    
    // Hero section'a odaklan
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            hero.style.opacity = '1';
        }, 100);
    }
});

// ============================================
// RACI Table Hover Efekti
// ============================================

document.querySelectorAll('.raci-table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = 'var(--bg-tertiary)';
    });
    row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = 'transparent';
    });
});

// ============================================
// Storyboard Frame Hover
// ============================================

document.querySelectorAll('.storyboard-frame').forEach(frame => {
    frame.addEventListener('mouseenter', () => {
        frame.style.transform = 'translateY(-5px) scale(1.02)';
    });
    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// User Story Card Hover
// ============================================

document.querySelectorAll('.user-story-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderLeftWidth = '6px';
    });
    card.addEventListener('mouseleave', () => {
        card.style.borderLeftWidth = '4px';
    });
});

// ============================================
// Matrix Cell Hover
// ============================================

document.querySelectorAll('.matrix-cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        cell.style.transform = 'scale(1.05)';
        cell.style.transition = 'transform 0.3s ease';
    });
    cell.addEventListener('mouseleave', () => {
        cell.style.transform = 'scale(1)';
    });
});

// ============================================
// Kano Category Hover
// ============================================

document.querySelectorAll('.kano-category').forEach(category => {
    category.addEventListener('mouseenter', () => {
        category.style.boxShadow = 'var(--shadow-lg)';
    });
    category.addEventListener('mouseleave', () => {
        category.style.boxShadow = 'none';
    });
});

// ============================================
// INVEST Item Hover
// ============================================

document.querySelectorAll('.invest-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const letter = item.querySelector('.invest-letter');
        if (letter) {
            letter.style.transform = 'rotate(360deg) scale(1.1)';
            letter.style.transition = 'transform 0.5s ease';
        }
    });
    item.addEventListener('mouseleave', () => {
        const letter = item.querySelector('.invest-letter');
        if (letter) {
            letter.style.transform = 'rotate(0deg) scale(1)';
        }
    });
});

// ============================================
// Wireframe Box Hover
// ============================================

document.querySelectorAll('.wireframe-box').forEach(box => {
    box.addEventListener('mouseenter', () => {
        box.style.borderStyle = 'solid';
        box.style.borderColor = 'var(--accent-primary)';
    });
    box.addEventListener('mouseleave', () => {
        box.style.borderStyle = 'dashed';
        box.style.borderColor = 'var(--border-color)';
    });
});

// ============================================
// Persona Photo Hover
// ============================================

document.querySelectorAll('.persona-photo').forEach(photo => {
    photo.addEventListener('mouseenter', () => {
        photo.style.transform = 'scale(1.1)';
        photo.style.transition = 'transform 0.3s ease';
    });
    photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'scale(1)';
    });
});

// ============================================
// EBO Card Click Animation
// ============================================

document.querySelectorAll('.ebo-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-5px)';
        }, 100);
    });
});

// ============================================
// HMW Card Number Animation
// ============================================

document.querySelectorAll('.hmw-number').forEach(number => {
    number.addEventListener('mouseenter', () => {
        number.style.transform = 'rotate(360deg) scale(1.1)';
        number.style.transition = 'transform 0.5s ease';
    });
    number.addEventListener('mouseleave', () => {
        number.style.transform = 'rotate(0deg) scale(1)';
    });
});

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ============================================
// Console Welcome Message
// ============================================

console.log('%cİş Süreçleri Analizi Projesi', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cProje sunum sitesi başarıyla yüklendi!', 'color: #4a5568; font-size: 14px;');
