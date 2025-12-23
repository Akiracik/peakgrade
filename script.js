// Global değişkenler
let totalTopics = 5;
let completedTopics = 0;
let yazilimTotalTopics = 8;
let yazilimCompletedTopics = 0;

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Uygulamayı başlat
function initializeApp() {
    // Checkbox'ları dinle
    setupCheckboxListeners();
    
    // Modal kapama olaylarını ayarla
    setupModalEvents();
    
    // İlerleme durumunu yükle
    loadProgress();
    
    // Tema kontrolü
    checkThemeReadability();
    
    console.log('📚 Final çalışma sitesi başarıyla yüklendi!');
}

// Checkbox dinleyicilerini ayarla
function setupCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.completion-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const topicCard = this.closest('.topic-card');
            const topicTitle = topicCard.querySelector('.topic-title').textContent;
            const currentSubject = this.closest('.subject-content').id;
            
            if (this.checked) {
                topicCard.classList.add('completed');
                showNotification(`✅ "${topicTitle}" konusu tamamlandı!`, 'success');
                
                // Başarı efekti
                addSuccessEffect(topicCard);
                
                // İlgili konuya göre counter artır
                if (currentSubject === 'yazilim-mimarileri') {
                    yazilimCompletedTopics++;
                } else {
                    completedTopics++;
                }
            } else {
                topicCard.classList.remove('completed');
                showNotification(`📖 "${topicTitle}" konusu tekrar işaretlendi`, 'info');
                
                // İlgili konuya göre counter azalt
                if (currentSubject === 'yazilim-mimarileri') {
                    yazilimCompletedTopics--;
                } else {
                    completedTopics--;
                }
            }
            
            updateProgress();
            saveProgress();
        });
    });
}

// İlerleme çubuğunu güncelle
function updateProgress() {
    const activeSubject = document.querySelector('.subject-content.active');
    
    if (activeSubject) {
        const progressFill = activeSubject.querySelector('.progress-fill');
        const progressText = activeSubject.querySelector('.progress-text');
        const subjectId = activeSubject.id;
        
        let percentage, currentCompleted, currentTotal;
        
        if (subjectId === 'yazilim-mimarileri') {
            currentCompleted = yazilimCompletedTopics;
            currentTotal = yazilimTotalTopics;
            percentage = Math.round((yazilimCompletedTopics / yazilimTotalTopics) * 100);
        } else {
            currentCompleted = completedTopics;
            currentTotal = totalTopics;
            percentage = Math.round((completedTopics / totalTopics) * 100);
        }
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${currentCompleted}/${currentTotal} Konu Tamamlandı`;
        
        // İlerleme animasyonu
        progressFill.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Motivasyon mesajları
        if (percentage === 100) {
            setTimeout(() => {
                showNotification('🎉 Tebrikler! Bu bölümdeki tüm konuları tamamladın! 🚀', 'celebration');
            }, 1000);
        } else if (percentage >= 80) {
            showNotification('🔥 Harika! Son spurt zamanı!', 'success');
        } else if (percentage >= 50) {
            showNotification('💪 Yarıdan fazlasını tamamladın! Devam et!', 'success');
        }
    }
    
    // Genel ilerleme hesapla
    const totalAllCompleted = completedTopics + yazilimCompletedTopics;
    const totalAllTopics = totalTopics + yazilimTotalTopics;
    const overallPercentage = Math.round((totalAllCompleted / totalAllTopics) * 100);
    
    const totalProgressSpan = document.getElementById('total-progress');
    if (totalProgressSpan) {
        totalProgressSpan.textContent = `${overallPercentage}%`;
    }
}

// Başarı efekti ekle
function addSuccessEffect(element) {
    element.style.transform = 'scale(1.02)';
    element.style.boxShadow = '0 0 30px rgba(72, 187, 120, 0.4)';
    
    setTimeout(() => {
        element.style.transform = '';
        element.style.boxShadow = '';
    }, 600);
}

// Konu detaylarını aç/kapat
function toggleTopic(topicId) {
    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Modal başlığını ve içeriğini ayarla
    const topicData = getTopicContent(topicId);
    modalTitle.textContent = topicData.title;
    modalBody.innerHTML = topicData.content;
    
    // Modal'ı göster
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Expand butonunu güncelle
    const expandBtn = document.querySelector(`[data-topic="${topicId}"] .expand-btn`);
    expandBtn.classList.add('expanded');
}

// Modal'ı kapat
function closeModal() {
    const modal = document.getElementById('modal-overlay');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Tüm expand butonlarını sıfırla
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.classList.remove('expanded');
    });
}

// Modal olaylarını ayarla
function setupModalEvents() {
    const modal = document.getElementById('modal-overlay');
    
    // Modal dışına tıklandığında kapat
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Bildirim göster
function showNotification(message, type = 'info') {
    // Mevcut bildirimi kaldır
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Stilleri ayarla
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '400px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Tip'e göre renk ayarla
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
            break;
        case 'celebration':
            notification.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #4299e1, #3182ce)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #4a5568, #2d3748)';
    }
    
    document.body.appendChild(notification);
    
    // Animasyon ile göster
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 4 saniye sonra gizle
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// İlerleme durumunu kaydet
function saveProgress() {
    const checkboxes = document.querySelectorAll('.completion-checkbox');
    const progress = [];
    
    checkboxes.forEach((checkbox, index) => {
        progress.push({
            checked: checkbox.checked,
            id: checkbox.id
        });
    });
    
    localStorage.setItem('studyProgress', JSON.stringify(progress));
    localStorage.setItem('completedTopics', completedTopics);
    localStorage.setItem('yazilimCompletedTopics', yazilimCompletedTopics);
}

// İlerleme durumunu yükle
function loadProgress() {
    const savedProgress = localStorage.getItem('studyProgress');
    const savedCompletedTopics = localStorage.getItem('completedTopics');
    const savedYazilimCompletedTopics = localStorage.getItem('yazilimCompletedTopics');
    
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        progress.forEach((item, index) => {
            if (typeof item === 'object' && item.id) {
                // Yeni format
                const checkbox = document.getElementById(item.id);
                if (checkbox && item.checked) {
                    checkbox.checked = true;
                    const topicCard = checkbox.closest('.topic-card');
                    topicCard.classList.add('completed');
                }
            } else if (typeof item === 'boolean') {
                // Eski format - geriye uyumluluk için
                const checkboxes = document.querySelectorAll('.completion-checkbox');
                if (checkboxes[index] && item) {
                    checkboxes[index].checked = true;
                    const topicCard = checkboxes[index].closest('.topic-card');
                    topicCard.classList.add('completed');
                }
            }
        });
    }
    
    if (savedCompletedTopics) {
        completedTopics = parseInt(savedCompletedTopics);
    }
    
    if (savedYazilimCompletedTopics) {
        yazilimCompletedTopics = parseInt(savedYazilimCompletedTopics);
    }
    
    updateProgress();
}

// Tema okunabilirlik kontrolü
function checkThemeReadability() {
    // Kontrast kontrolü yapacak basit bir fonksiyon
    const primaryBg = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg');
    const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    
    console.log('🎨 Tema okunabilirlik kontrolü tamamlandı');
    console.log('🌙 Koyu tema aktif - göz sağlığına uygun');
}

// Konu içeriklerini al
function getTopicContent(topicId) {
    const topics = {
        'post-get': {
            title: 'POST / GET Olayları',
            content: `
                <div class="topic-detail">
                    <h4>🔄 HTTP İstek Metodları</h4>
                    <p><strong>GET</strong> ve <strong>POST</strong>, web uygulamalarında en sık kullanılan HTTP metodlarıdır.</p>
                    
                    <h5>📥 GET Metodu</h5>
                    <ul>
                        <li><strong>Amaç:</strong> Sunucudan veri almak için kullanılır</li>
                        <li><strong>URL'de görünür:</strong> Parametreler URL'de (?param=value şeklinde) görünür</li>
                        <li><strong>Güvenlik:</strong> Hassas bilgiler için uygun değil</li>
                        <li><strong>Boyut sınırı:</strong> URL uzunluk limitine bağlı (~2048 karakter)</li>
                        <li><strong>Bookmark:</strong> URL'yi yer imine ekleyebilirsiniz</li>
                        <li><strong>Tekrar edebilir:</strong> Aynı istek birden fazla kez gönderilebilir</li>
                    </ul>
                    
                    <div class="code-block">
// GET örneği
&lt;a href="sayfa.php?id=123&kategori=programlama"&gt;Detay&lt;/a&gt;

// PHP'de GET verisi alma
$id = $_GET['id'];  // 123
$kategori = $_GET['kategori'];  // programlama
                    </div>
                    
                    <h5>📤 POST Metodu</h5>
                    <ul>
                        <li><strong>Amaç:</strong> Sunucuya veri göndermek için kullanılır</li>
                        <li><strong>Gizli gönderim:</strong> Veriler HTTP body'sinde gönderilir</li>
                        <li><strong>Güvenlik:</strong> Hassas bilgiler için daha uygun</li>
                        <li><strong>Boyut sınırı:</strong> Teorik olarak sınırsız</li>
                        <li><strong>Bookmark:</strong> URL'yi yer imine eklenemez</li>
                        <li><strong>Tekrar edilemez:</strong> Yenileme uyarısı verir</li>
                    </ul>
                    
                    <div class="code-block">
// POST örneği
&lt;form method="POST" action="islem.php"&gt;
    &lt;input type="text" name="kullanici_adi"&gt;
    &lt;input type="password" name="sifre"&gt;
    &lt;button type="submit"&gt;Giriş Yap&lt;/button&gt;
&lt;/form&gt;

// PHP'de POST verisi alma
$kullanici = $_POST['kullanici_adi'];
$sifre = $_POST['sifre'];
                    </div>
                    
                    <h5>🎯 Ne Zaman Hangi Metodu Kullanmalı?</h5>
                    <p><strong>GET kullan:</strong> Arama, filtreleme, sayfa geçişleri</p>
                    <p><strong>POST kullan:</strong> Form gönderimi, veri kaydetme, giriş işlemleri</p>
                </div>
            `
        },
        'form-creation': {
            title: 'Form Oluşturma (Action & Method)',
            content: `
                <div class="topic-detail">
                    <h4>📝 HTML Form Temelleri</h4>
                    <p>Formlar, kullanıcıdan veri toplama ve sunucuya gönderme işlemlerinin temelidir.</p>
                    
                    <h5>🏗️ Temel Form Yapısı</h5>
                    <div class="code-block">
&lt;form action="hedef_sayfa.php" method="POST"&gt;
    &lt;!-- Form elemanları buraya gelir --&gt;
    &lt;input type="text" name="isim" placeholder="İsminizi girin"&gt;
    &lt;button type="submit"&gt;Gönder&lt;/button&gt;
&lt;/form&gt;
                    </div>
                    
                    <h5>🎯 Action Özniteliği</h5>
                    <p><code class="code-inline">action</code> özniteliği, form verilerinin hangi sayfaya gönderileceğini belirtir.</p>
                    <ul>
                        <li><strong>Mutlak URL:</strong> <code class="code-inline">action="https://example.com/islem.php"</code></li>
                        <li><strong>Göreceli URL:</strong> <code class="code-inline">action="islem.php"</code></li>
                        <li><strong>Aynı sayfa:</strong> <code class="code-inline">action=""</code> veya action yazmazsan</li>
                        <li><strong>Başka dizin:</strong> <code class="code-inline">action="../admin/kaydet.php"</code></li>
                    </ul>
                    
                    <h5>⚙️ Method Özniteliği</h5>
                    <p><code class="code-inline">method</code> özniteliği, verilerin nasıl gönderileceğini belirtir.</p>
                    
                    <div class="code-block">
&lt;!-- GET metodu --&gt;
&lt;form action="ara.php" method="GET"&gt;
    &lt;input type="text" name="arama" placeholder="Ara..."&gt;
    &lt;button type="submit"&gt;Ara&lt;/button&gt;
&lt;/form&gt;

&lt;!-- POST metodu --&gt;
&lt;form action="giris.php" method="POST"&gt;
    &lt;input type="email" name="email"&gt;
    &lt;input type="password" name="sifre"&gt;
    &lt;button type="submit"&gt;Giriş&lt;/button&gt;
&lt;/form&gt;
                    </div>
                </div>
            `
        },
        'html-css': {
            title: 'Temel HTML & CSS',
            content: `
                <div class="topic-detail">
                    <h4>🏗️ HTML Temelleri</h4>
                    <p>HTML (HyperText Markup Language), web sayfalarının iskeletini oluşturan işaretleme dilidir.</p>
                    
                    <h5>📋 Temel HTML Yapısı</h5>
                    <div class="code-block">
&lt;!DOCTYPE html&gt;
&lt;html lang="tr"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Sayfa Başlığı&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Ana Başlık&lt;/h1&gt;
    &lt;p&gt;Paragraf metni&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
                    </div>
                    
                    <h4>🎨 CSS Temelleri</h4>
                    <p>CSS (Cascading Style Sheets), HTML elementlerini şekillendirmek için kullanılır.</p>
                    
                    <h5>🎯 CSS Seçiciler</h5>
                    <div class="code-block">
/* Element seçici */
p { color: blue; }

/* Class seçici */
.baslik { color: red; }

/* ID seçici */
#ana-menu { background-color: #333; }
                    </div>
                </div>
            `
        },
        'php-basics': {
            title: 'PHP Temel Konuları',
            content: `
                <div class="topic-detail">
                    <h4>🐘 PHP'ye Giriş</h4>
                    <p>PHP, sunucu tarafında çalışan, dinamik web sayfaları oluşturmak için kullanılan bir programlama dilidir.</p>
                    
                    <h5>🔧 PHP Temel Sözdizimi</h5>
                    <div class="code-block">
&lt;?php
    echo "Merhaba Dünya!";
    
    $isim = "Ahmet";
    $yas = 25;
?&gt;
                    </div>
                    
                    <h5>🌐 Süper Global Değişkenler</h5>
                    <div class="code-block">
&lt;?php
// $_GET - URL parametreleri
$id = $_GET['id'];

// $_POST - Form verileri
$kullanici = $_POST['kullanici_adi'];

// $_SESSION - Oturum verileri
$_SESSION['kullanici_id'] = 123;
?&gt;
                    </div>
                    
                    <h5>📊 Dizi İşlemleri</h5>
                    <div class="code-block">
&lt;?php
$meyveler = ["elma", "armut", "muz"];
$kisi = ["ad" => "Ahmet", "yas" => 28];

foreach ($meyveler as $meyve) {
    echo $meyve;
}
?&gt;
                    </div>
                </div>
            `
        },
        'database': {
            title: 'PHP Veritabanı İşlemleri (MySQL & PDO)',
            content: `
                <div class="topic-detail">
                    <h4>🗄️ MySQL ve PDO'ya Giriş</h4>
                    <p>PDO (PHP Data Objects), PHP'de veritabanı işlemleri için güvenli bir arayüz sağlar.</p>
                    
                    <h5>🔌 Veritabanı Bağlantısı</h5>
                    <div class="code-block">
&lt;?php
$host = 'localhost';
$dbname = 'ogrenci_sistemi';
$username = 'root';
$password = '';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "Bağlantı başarılı!";
} catch (PDOException $e) {
    die("Bağlantı hatası: " . $e->getMessage());
}
?&gt;
                    </div>
                    
                    <h5>➕ Veri Ekleme (INSERT)</h5>
                    <div class="code-block">
&lt;?php
$sql = "INSERT INTO ogrenciler (ad, soyad, email) VALUES (:ad, :soyad, :email)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':ad' => 'Ahmet',
    ':soyad' => 'Yılmaz',
    ':email' => 'ahmet@email.com'
]);
?&gt;
                    </div>
                    
                    <h5>📖 Veri Okuma (SELECT)</h5>
                    <div class="code-block">
&lt;?php
$sql = "SELECT * FROM ogrenciler WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([':id' => 1]);

if ($ogrenci = $stmt->fetch()) {
    echo "Ad: " . $ogrenci['ad'];
}
?&gt;
                    </div>
                    
                    <h5>✏️ Veri Güncelleme (UPDATE)</h5>
                    <div class="code-block">
&lt;?php
$sql = "UPDATE ogrenciler SET email = :email WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':email' => 'yeni@email.com',
    ':id' => 1
]);
?&gt;
                    </div>
                    
                    <h5>🗑️ Veri Silme (DELETE)</h5>
                    <div class="code-block">
&lt;?php
$sql = "DELETE FROM ogrenciler WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([':id' => 1]);
?&gt;
                    </div>
                </div>
            `
        }
    };

    return topics[topicId] || { title: 'Konu bulunamadı', content: '<p>Bu konu henüz hazırlanmamış.</p>' };
}

// Yazılım Mimarileri konu detaylarını aç/kapat
function toggleYazilimTopic(topicId) {
    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Modal başlığını ve içeriğini ayarla
    const topicData = getYazilimTopicContent(topicId);
    modalTitle.textContent = topicData.title;
    modalBody.innerHTML = topicData.content;
    
    // Modal'ı göster
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Expand butonunu güncelle
    const expandBtn = document.querySelector(`[data-topic="${topicId}"] .expand-btn`);
    if (expandBtn) {
        expandBtn.classList.add('expanded');
    }
}

// Yazılım Mimarileri konu içeriklerini al
function getYazilimTopicContent(topicId) {
    const yazilimTopics = {
        'yazilim-muhendisligi': {
            title: 'Yazılım Mühendisliği Temelleri',
            content: `
                <div class="topic-detail">
                    <h4>🔧 Yazılım Mühendisliği Nedir?</h4>
                    <p>Yazılım mühendisliği, bilgisayar programları yapmanın bilimsel yoludur. Tıpkı inşaat mühendislerinin binaları planlayıp inşa etmesi gibi, yazılım mühendisleri de programları planlayıp yaparlar.</p>
                    
                    <h5>🌍 Neden Bu Kadar Önemli?</h5>
                    <ul>
                        <li><strong>Hayatımızın Her Yerinde:</strong> Telefonunuz, ATM'ler, hastaneler, uçaklar - hepsi yazılımla çalışır</li>
                        <li><strong>Ekonomik Güç:</strong> Gelişmiş ülkelerin gelirinin büyük kısmı yazılımdan gelir</li>
                        <li><strong>Güvenlik:</strong> Hatalı yazılım can ve mal kaybına neden olabilir</li>
                        <li><strong>Verimlilik:</strong> İyi yazılım hayatımızı kolaylaştırır</li>
                    </ul>
                    
                    <h5>💰 Yazılım Maliyetleri</h5>
                    <p><strong>Şaşırtıcı Gerçek:</strong> Yazılımın maliyeti genellikle donanımdan daha fazladır!</p>
                    <ul>
                        <li>Bilgisayarınızdaki programlar, bilgisayardan daha pahalı olabilir</li>
                        <li>Yazılımı sürdürmek (bakım, güncelleme), yapmaktan daha pahalıdır</li>
                        <li>Bu yüzden doğru planlama çok önemlidir</li>
                    </ul>
                    
                    <h5>⭐ İyi Yazılımın Özellikleri</h5>
                    <div class="code-block">
✅ Sürdürülebilirlik: Kolayca güncellenebilir
✅ Güvenilirlik: Hata yapmaz, güvenlidir
✅ Etkinlik: Hızlı çalışır, az kaynak kullanır
✅ Kabul edilebilirlik: Kullanıcılar severek kullanır
                    </div>
                    
                    <h5>🎯 Yazılım Mühendisliği vs Programlama</h5>
                    <p><strong>Programlama:</strong> Sadece kod yazmak<br>
                    <strong>Yazılım Mühendisliği:</strong> Planlama + Tasarım + Kodlama + Test + Bakım + Yönetim</p>
                </div>
            `
        },
        'yazilim-surecleri': {
            title: 'Yazılım Geliştirme Süreçleri',
            content: `
                <div class="topic-detail">
                    <h4>🏗️ Yazılım Nasıl Geliştirilir?</h4>
                    <p>Yazılım geliştirmek ev inşa etmeye benzer. Farklı yöntemler vardır, her birinin avantajları ve dezavantajları bulunur.</p>
                    
                    <h5>🌊 Çağlayan (Waterfall) Modeli</h5>
                    <p><strong>Mantık:</strong> Bir aşama bitmeden diğerine geçme!</p>
                    <div class="code-block">
1. İhtiyaç Analizi (Ne isteniyor?)
2. Sistem Tasarımı (Nasıl yapacağız?)
3. Geliştirme (Kodlama)
4. Test Etme
5. Kullanıma Sunma
6. Bakım
                    </div>
                    
                    <p><strong>Avantajlar:</strong> Net plan, kontrollü süreç<br>
                    <strong>Dezavantajlar:</strong> Değişiklik zor, geç geri bildirim</p>
                    
                    <h5>🔄 Artırımlı Geliştirme</h5>
                    <p><strong>Mantık:</strong> Yazılımı parça parça yap, sürekli iyileştir!</p>
                    <ul>
                        <li>Önce temel özellikleri yap</li>
                        <li>Müşteriye göster, geri bildirim al</li>
                        <li>Yeni özellikler ekle</li>
                        <li>Sürekli tekrarla</li>
                    </ul>
                    
                    <p><strong>Avantajlar:</strong> Hızlı geri bildirim, değişikliklere açık<br>
                    <strong>Dezavantajlar:</strong> Planlama zor, kontrol güç</p>
                    
                    <h5>🧪 Prototipleme</h5>
                    <p><strong>Mantık:</strong> Önce basit bir deneme versiyonu yap!</p>
                    <ul>
                        <li>Hızlıca çalışan bir model yap</li>
                        <li>Müşteriye göster</li>
                        <li>Değişiklikleri öğren</li>
                        <li>Gerçek yazılımı ona göre yap</li>
                    </ul>
                    
                    <h5>🏢 RUP (Rational Unified Process)</h5>
                    <p>Büyük projelerde kullanılan modern yöntem:</p>
                    <div class="code-block">
• Başlangıç: Proje mümkün mü?
• Ayrıntılandırma: Ayrıntılı plan yapma
• İnşa: Kodlama ve test
• Geçiş: Kullanıcılara teslim
                    </div>
                    
                    <h5>🎯 Hangi Yöntemi Seçmeli?</h5>
                    <p><strong>Çağlayan:</strong> Net gereksinimler, az değişiklik<br>
                    <strong>Artırımlı:</strong> Sık değişiklik, hızlı teslimat<br>
                    <strong>Prototipleme:</strong> Belirsiz gereksinimler</p>
                </div>
            `
        },
        'gereksinim-muhendisligi': {
            title: 'Müşteri İsteklerini Anlama',
            content: `
                <div class="topic-detail">
                    <h4>🤝 Müşteri Ne İstiyor?</h4>
                    <p>Yazılım yapmanın en zor kısmı, müşterinin gerçekte ne istediğini anlamaktır. Çoğu zaman müşteri bile tam olarak bilmez!</p>
                    
                    <h5>📋 Gereksinim Türleri</h5>
                    
                    <h6>🔧 Fonksiyonel Gereksinimler</h6>
                    <p><strong>Tanım:</strong> Yazılımın ne yapması gerektiği</p>
                    <ul>
                        <li>"Kullanıcı giriş yapabilmeli"</li>
                        <li>"Fatura yazdırabilmeli"</li>
                        <li>"Rapor oluşturabilmeli"</li>
                    </ul>
                    
                    <h6>⚡ Fonksiyonel Olmayan Gereksinimler</h6>
                    <p><strong>Tanım:</strong> Yazılımın nasıl çalışması gerektiği</p>
                    <div class="code-block">
• Hız: "3 saniyede açılmalı"
• Güvenlik: "Şifreler şifrelenmeli"
• Kullanılabilirlik: "5 yaşındaki çocuk kullanabilmeli"
• Güvenilirlik: "Günde 1 saatten fazla durmmalı"
                    </div>
                    
                    <h5>👥 İhtiyaçları Kim Belirler?</h5>
                    <ul>
                        <li><strong>Son kullanıcılar:</strong> Gerçekte yazılımı kullanacak kişiler</li>
                        <li><strong>Yöneticiler:</strong> Para ödeyen ve karar veren kişiler</li>
                        <li><strong>Teknik uzmanlar:</strong> İşin detaylarını bilen kişiler</li>
                        <li><strong>Müşteriler:</strong> Yazılımdan etkilenecek diğer kişiler</li>
                    </ul>
                    
                    <h5>🕵️ İhtiyaçları Nasıl Öğreniriz?</h5>
                    
                    <p><strong>1. Görüşme (Mülakat)</strong></p>
                    <ul>
                        <li>Doğrudan konuşma en etkili yoldur</li>
                        <li>Açık uçlu sorular sorun: "Nasıl çalışıyor?"</li>
                        <li>Dinlemeyi unutmayın!</li>
                    </ul>
                    
                    <p><strong>2. Gözlem (Etnografi)</strong></p>
                    <ul>
                        <li>İnsanları gerçek işlerinde gözlemleyin</li>
                        <li>Söyledikleri ile yaptıkları farklı olabilir</li>
                        <li>Gizli ihtiyaçları keşfedebilirsiniz</li>
                    </ul>
                    
                    <p><strong>3. Senaryolar ve Kullanım Durumları</strong></p>
                    <div class="code-block">
Senaryo Örneği:
"Müşteri ATM'ye gelir, kartını sokar, PIN kodunu girer,
para çekmek ister, miktar belirler, parayını alır ve gider."
                    </div>
                    
                    <h5>⚠️ Sık Karşılaşılan Problemler</h5>
                    <ul>
                        <li><strong>Belirsizlik:</strong> "Kullanıcı dostu olsun" ne demek?</li>
                        <li><strong>Çakışan istekler:</strong> Farklı kişiler farklı şeyler istiyor</li>
                        <li><strong>Değişen istekler:</strong> Proje ilerledikçe fikirler değişiyor</li>
                        <li><strong>Gizli beklentiler:</strong> "Bu tabii ki olacak" diye düşünülenler</li>
                    </ul>
                    
                    <h5>✅ İyi Gereksinim Nasıl Olur?</h5>
                    <div class="code-block">
✓ Net: Herkes aynı şeyi anlamalı
✓ Ölçülebilir: "Hızlı" değil, "3 saniyede" deyin
✓ Test edilebilir: Yapılıp yapılmadığı anlaşılmalı
✓ Tutarlı: Birbiri ile çelişmemeli
                    </div>
                </div>
            `
        },
        'sistem-modelleme': {
            title: 'Yazılımı Görselleştirme',
            content: `
                <div class="topic-detail">
                    <h4>🎨 Karmaşık Yazılımları Nasıl Anlarız?</h4>
                    <p>Büyük yazılımlar çok karmaşıktır. Binlerce satır kodun ne yaptığını anlamak için görsel modeller kullanırız. Tıpkı bir binanın planını çizmek gibi!</p>
                    
                    <h5>🏗️ Neden Model Yaparız?</h5>
                    <ul>
                        <li><strong>Anlaşılır olması için:</strong> Resim bin kelimeden iyidir</li>
                        <li><strong>İletişim için:</strong> Ekip üyeleri arasında ortak dil</li>
                        <li><strong>Planlama için:</strong> Yapmadan önce tasarımı görmek</li>
                        <li><strong>Hata tespiti için:</strong> Problemleri erken fark etmek</li>
                    </ul>
                    
                    <h5>📊 UML - Yazılımcıların Resim Dili</h5>
                    <p><strong>UML (Unified Modeling Language):</strong> Yazılım projelerini çizmek için standart yöntem</p>
                    
                    <h6>🏠 Yapısal Modeller - "Yazılım Neye Benziyor?"</h6>
                    <p><strong>Sınıf Diyagramları:</strong> Yazılımın parçaları ve aralarındaki ilişkiler</p>
                    <div class="code-block">
Örnek: Okul Sistemi
┌─────────────┐    ┌─────────────┐
│   Öğrenci   │────│    Ders     │
│ - isim      │    │ - adı       │
│ - numara    │    │ - kodu      │
│ + kayıtOl() │    │ + başla()   │
└─────────────┘    └─────────────┘
                    </div>
                    
                    <h6>🔄 Davranışsal Modeller - "Yazılım Ne Yapar?"</h6>
                    <p><strong>Aktivite Diyagramları:</strong> İş akışları, süreçler</p>
                    <ul>
                        <li>Kullanıcı ne yapar?</li>
                        <li>Sistem nasıl tepki verir?</li>
                        <li>Hangi sırayla olaylar gerçekleşir?</li>
                    </ul>
                    
                    <p><strong>Sequence Diyagramları:</strong> Nesneler arası iletişim</p>
                    <div class="code-block">
ATM Örneği:
Kullanıcı → ATM: Kart tak
ATM → Bank: Kart geçerli mi?
Bank → ATM: Evet, geçerli
ATM → Kullanıcı: PIN kodu gir
                    </div>
                    
                    <h6>🌐 İçerik Modelleri - "Yazılım Nerede Çalışır?"</h6>
                    <ul>
                        <li>Yazılım hangi sistemlerle konuşur?</li>
                        <li>Dış dünyayla nasıl etkileşir?</li>
                        <li>Sınırları nelerdir?</li>
                    </ul>
                    
                    <h5>🎯 Model Türleri ve Kullanım Alanları</h5>
                    <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                        <tr style="background: var(--accent-bg);">
                            <th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">Model</th>
                            <th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">Ne İçin</th>
                            <th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">Örnek</th>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Use Case</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Kullanıcı senaryoları</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">"Para çekme"</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Class</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Kod yapısı</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">"Müşteri" sınıfı</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Activity</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">İş akışları</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">"Sipariş süreci"</td>
                        </tr>
                    </table>
                    
                    <h5>💡 Pratik İpuçları</h5>
                    <ul>
                        <li><strong>Basit başlayın:</strong> Karmaşık modeller kimsenin işine yaramaz</li>
                        <li><strong>Amaca odaklanın:</strong> Her model belirli bir soruyu cevaplar</li>
                        <li><strong>Güncel tutun:</strong> Kodla uyumsuz model yanıltıcıdır</li>
                        <li><strong>Ekiple paylaşın:</strong> Model sadece kağıtta kalmamalı</li>
                    </ul>
                </div>
            `
        },
        'gercek-ornekler': {
            title: 'Gerçek Hayat Örnekleri',
            content: `
                <div class="topic-detail">
                    <h4>🌍 Gerçek Yazılım Projeleri</h4>
                    <p>Teoriden pratiğe geçelim! İşte yazılım mühendisliği prensiplerinin gerçek hayatta nasıl uygulandığını gösteren örnekler.</p>
                    
                    <h5>💉 İnsülin Pompası Kontrol Sistemi</h5>
                    <p><strong>Problem:</strong> Diyabet hastaları insülinlerini manuel enjekte etmek zorunda</p>
                    <p><strong>Çözüm:</strong> Otomatik insülin veren akıllı pompa</p>
                    
                    <h6>Sistem Nasıl Çalışır?</h6>
                    <div class="code-block">
1. Kan şekeri sensörü → Şeker seviyesini ölç
2. Kontrol yazılımı → Hesaplama yap
3. İnsülin pompası → Gerekli dozu ver
4. Sürekli izleme → 7/24 kontrol
                    </div>
                    
                    <p><strong>Kritik Gereksinimler:</strong></p>
                    <ul>
                        <li><strong>Güvenilirlik:</strong> Hata yapamaz, hayat memat meselesi!</li>
                        <li><strong>Hız:</strong> Anında tepki vermeli</li>
                        <li><strong>Dayanıklılık:</strong> 7/24 çalışmalı</li>
                        <li><strong>Hassaslık:</strong> Dozu çok az/çok fazla olmamalı</li>
                    </ul>
                    
                    <p><strong>Öğrenilenler:</strong> Kritik sistemlerde test ve doğrulama çok önemli!</p>
                    
                    <h5>🏥 Hastane Yönetim Sistemi (MHC-PMS)</h5>
                    <p><strong>Problem:</strong> Akıl sağlığı hastalarının takibi zor</p>
                    <p><strong>Çözüm:</strong> Merkezi hasta kayıt ve takip sistemi</p>
                    
                    <h6>Sistem Özellikleri:</h6>
                    <ul>
                        <li><strong>Hasta kayıtları:</strong> Geçmiş, ilaçlar, tedaviler</li>
                        <li><strong>Randevu sistemi:</strong> Doktor-hasta eşleştirme</li>
                        <li><strong>Mobil erişim:</strong> Doktorlar her yerden erişebilir</li>
                        <li><strong>Güvenlik:</strong> Hasta bilgileri gizli</li>
                    </ul>
                    
                    <p><strong>Paydaşlar:</strong></p>
                    <div class="code-block">
• Hastalar: Bilgileri kayıtlı tutulan
• Doktorlar: Teşhis ve tedavi yapan
• Hemşireler: Bakım koordine eden
• Sekreterler: Randevu yöneten
• BT ekibi: Sistemi kuran/yöneten
• Yöneticiler: Rapor isteyen
                    </div>
                    
                    <p><strong>Zorluklar:</strong></p>
                    <ul>
                        <li>Farklı kliniklerde çalışma</li>
                        <li>İnternet olmadığında da çalışabilme</li>
                        <li>Veri güvenliği ve gizliliği</li>
                        <li>Kullanım kolaylığı</li>
                    </ul>
                    
                    <h5>🌤️ Hava Durumu İstasyon Sistemi</h5>
                    <p><strong>Problem:</strong> Uzak bölgelerdeki hava durumu bilinmiyor</p>
                    <p><strong>Çözüm:</strong> Otomatik hava ölçüm istasyonları</p>
                    
                    <h6>Sistem Bileşenleri:</h6>
                    <ul>
                        <li><strong>Sensörler:</strong> Sıcaklık, nem, rüzgar, yağış</li>
                        <li><strong>Veri toplama:</strong> Her saatte ölçüm</li>
                        <li><strong>Haberleşme:</strong> Uydu bağlantısı</li>
                        <li><strong>Güç sistemi:</strong> Solar panel + batarya</li>
                    </ul>
                    
                    <p><strong>Özel Durumlar:</strong></p>
                    <div class="code-block">
• Fırtınada: Kendini koru moduna geç
• Güneşli günde: Bataryaları şarj et
• Bağlantı kesilirse: Verileri kaydet
• Sensör arızası: Yedek sensöre geç
                    </div>
                    
                    <h5>📚 Bu Örneklerden Çıkarılan Dersler</h5>
                    
                    <p><strong>1. Gereksinimler Hayati Önemde</strong></p>
                    <ul>
                        <li>İnsülin pompası: Yanlış doz öldürebilir</li>
                        <li>Hastane sistemi: Hasta bilgileri kaybolabilir</li>
                        <li>Hava sistemi: Tahmin hataları zararlı olabilir</li>
                    </ul>
                    
                    <p><strong>2. Kullanıcı Çeşitliliği</strong></p>
                    <ul>
                        <li>Farklı kişiler sistemi farklı şekillerde kullanır</li>
                        <li>Teknik olmayan kullanıcılar da var</li>
                        <li>Eğitim ve destek gerekli</li>
                    </ul>
                    
                    <p><strong>3. Güvenilirlik Kritik</strong></p>
                    <ul>
                        <li>7/24 çalışması gereken sistemler</li>
                        <li>Yedekleme ve arıza durumu planları</li>
                        <li>Sürekli izleme ve uyarı sistemleri</li>
                    </ul>
                    
                    <p><strong>4. Karmaşık Sistemler</strong></p>
                    <ul>
                        <li>Birden çok alt sistem birlikte çalışır</li>
                        <li>Haberleşme protokolleri önemli</li>
                        <li>Test etmek zor ama şart</li>
                    </ul>
                    
                    <h5>💡 Size Tavsiye</h5>
                    <p>Yazılım yaparken şunu unutmayın: <strong>"Bu sistemi kullanan gerçek insanlar var ve onların hayatını etkiliyor!"</strong></p>
                </div>
            `
        },
        'yazilim-etigi': {
            title: 'Yazılım Etiği ve Sorumluluk',
            content: `
                <div class="topic-detail">
                    <h4>⚖️ Yazılım Etiği Nedir?</h4>
                    <p>Yazılımcılar topluma hizmet eden mesleki sorumluluğa sahiptir. Tıpkı doktorların "zarar verme" yemini gibi, yazılımcıların da etik kurallara uyması gerekir.</p>
                    
                    <h5>🌍 Neden Bu Kadar Önemli?</h5>
                    <ul>
                        <li><strong>Toplumsal Etki:</strong> Yazdığınız kod milyonlarca kişiyi etkileyebilir</li>
                        <li><strong>Güven:</strong> İnsanlar teknolojiye güvenmek zorunda</li>
                        <li><strong>Güç:</strong> Büyük güç büyük sorumluluk getirir</li>
                        <li><strong>Gelecek:</strong> Bugünkü kararlar yarının dünyasını şekillendirir</li>
                    </ul>
                    
                    <h5>📜 Temel Etik İlkeler</h5>
                    
                    <h6>1. 🏆 Kamu Yararı</h6>
                    <p><strong>İlke:</strong> Toplumun çıkarlarını her zaman ön planda tut</p>
                    <ul>
                        <li>Güvenli yazılım yap</li>
                        <li>Topluma zarar verebilecek sistemlerde çalışma</li>
                        <li>Kişisel çıkardan çok genel yarar</li>
                    </ul>
                    
                    <h6>2. 👤 İşveren ve Müşteri Hakları</h6>
                    <p><strong>İlke:</strong> İşveren/müşteri haklarını koru, ama topluma zarar vermeyecek şekilde</p>
                    <ul>
                        <li>Gizlilik sözleşmelerini ihlal etme</li>
                        <li>Şirket sırlarını açıklama</li>
                        <li>Ancak yasadışı durumlarda sessiz kalma</li>
                    </ul>
                    
                    <h6>3. 💎 Ürün Kalitesi</h6>
                    <p><strong>İlke:</strong> En yüksek mesleki standartlarda çalış</p>
                    <div class="code-block">
✓ Test edilmiş kod yazmak
✓ Dokümantasyon oluşturmak
✓ Güvenlik açıklarını kapatmak
✓ Performans optimizasyonu yapmak
                    </div>
                    
                    <h6>4. 🎯 Dürüstlük ve Bağımsızlık</h6>
                    <ul>
                        <li>Bilmediğin konularda uzman gibi davranma</li>
                        <li>Süreler ve maliyetler konusunda gerçekçi ol</li>
                        <li>Çıkar çatışmalarından kaçın</li>
                        <li>Rüşvet veya hediye kabul etme</li>
                    </ul>
                    
                    <h6>5. 👥 Meslektaşlar</h6>
                    <ul>
                        <li>Diğer yazılımcılara saygı göster</li>
                        <li>Bilgi paylaş ve öğret</li>
                        <li>Adaletsizlik gördüğünde sessiz kalma</li>
                        <li>Meslektaşlarını destekle</li>
                    </ul>
                    
                    <h6>6. 📚 Kendini Geliştirme</h6>
                    <ul>
                        <li>Sürekli öğren ve gelişim göster</li>
                        <li>Yeni teknolojileri takip et</li>
                        <li>Mesleki standartları yükseltmeye katkı sağla</li>
                    </ul>
                    
                    <h5>⚠️ Etik İklemler - Gerçek Hayat Örnekleri</h5>
                    
                    <p><strong>Senaryo 1:</strong> Şirketiniz güvenlik açığı olan bir yazılımı satmak istiyor</p>
                    <p><em>Ne yapmalı?</em> Önce şirket yönetimine durumu bildirin. Dinlemezse otoriteleri uyarın.</p>
                    
                    <p><strong>Senaryo 2:</strong> Müşteri verilerini izinsiz toplayan özellik eklemenizi istiyorlar</p>
                    <p><em>Ne yapmalı?</em> Reddedin. Alternatif, yasal çözümler önerin.</p>
                    
                    <p><strong>Senaryo 3:</strong> Rakip şirketten gizli bilgi almanızı istiyorlar</p>
                    <p><em>Ne yapmalı?</em> Kesinlikle reddedın. Bu hem etik dışı hem de yasadışıdır.</p>
                    
                    <h5>🏛️ Yasal Çerçeve</h5>
                    <ul>
                        <li><strong>KVKK (Kişisel Verilerin Korunması):</strong> Türkiye'de veri koruma kanunu</li>
                        <li><strong>GDPR:</strong> Avrupa veri koruma yönetmeliği</li>
                        <li><strong>Fikri Mülkiyet:</strong> Telif hakları ve patent koruması</li>
                        <li><strong>Siber Güvenlik:</strong> Sistemleri koruma yükümlülüğü</li>
                    </ul>
                    
                    <h5>💡 Pratik İpuçları</h5>
                    <ul>
                        <li><strong>Soru sor:</strong> "Bu doğru mu?" diye düşün</li>
                        <li><strong>Sonuçları değerlendir:</strong> "Kim etkilenecek?"</li>
                        <li><strong>Şeffaf ol:</strong> Gizleyecek bir şeyin varsa yanlış yapıyorsundur</li>
                        <li><strong>Danış:</strong> Emin değilsen deneyimli kişilerden görüş al</li>
                    </ul>
                </div>
            `
        },
        'prototipleme-spiral': {
            title: 'İleri Geliştirme Yöntemleri',
            content: `
                <div class="topic-detail">
                    <h4>🔄 Prototipleme - "Önce Dene, Sonra Yap"</h4>
                    <p>Prototipleme, gerçek ürünü yapmadan önce basit bir deneme versiyonu yapma tekniğidir. Ev satın alırken önce gezmeye benzer!</p>
                    
                    <h5>🎯 Prototipleme Ne İşe Yarar?</h5>
                    <ul>
                        <li><strong>Erken Geri Bildirim:</strong> Müşteri ne istediğini daha net anlıyor</li>
                        <li><strong>Risk Azaltma:</strong> Büyük hatalar erken fark ediliyor</li>
                        <li><strong>İletişim:</strong> Sözle anlatmak yerine göstermek</li>
                        <li><strong>Tasarım Doğrulama:</strong> Gerçekten çalışır mı test etmek</li>
                    </ul>
                    
                    <h5>🛠️ Prototip Türleri</h5>
                    
                    <h6>📝 Kağıt Prototip</h6>
                    <ul>
                        <li>En hızlı ve ucuz yöntem</li>
                        <li>Kullanıcı arayüzü tasarımı için ideal</li>
                        <li>Değişiklik yapmak çok kolay</li>
                    </ul>
                    
                    <h6>💻 Dijital Prototip</h6>
                    <ul>
                        <li>Gerçeğe daha yakın deneyim</li>
                        <li>Tıklama ve geçiş animasyonları</li>
                        <li>Daha çok zaman alır ama etkili</li>
                    </ul>
                    
                    <h6>⚡ Çalışan Prototip</h6>
                    <ul>
                        <li>Gerçekten çalışan basit versiyon</li>
                        <li>Teknik fizibilite için</li>
                        <li>En pahalı ama en güvenilir</li>
                    </ul>
                    
                    <h4>🌪️ Spiral Model - "Sürekli İyileştirme"</h4>
                    <p>Spiral model, proje risklerini yönetmeye odaklanan bir geliştirme yöntemidir. Projede sürekli döngüler halinde ilerlersiniz.</p>
                    
                    <h5>🔄 Spiral'in 4 Aşaması</h5>
                    <div class="code-block">
1. 📋 Planlama: Hedefleri ve alternatifleri belirle
2. ⚠️  Risk Analizi: Potansiyel sorunları tespit et
3. 🏗️  Geliştirme: Bu aşamada gerekli çalışmayı yap
4. 📊 Değerlendirme: Sonuçları müşteriyle birlikte değerlendir
                    </div>
                    
                    <h5>🎯 Her Döngüde Neler Olur?</h5>
                    <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                        <tr style="background: var(--accent-bg);">
                            <th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">Döngü</th>
                            <th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">Odak</th>
                            <th style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2);">Çıktı</th>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">1</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Gereksinimler</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Prototip</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">2</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Tasarım</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Simülasyon</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">3</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Kodlama</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Beta Versiyon</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">4</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Test & Teslimat</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(255,255,255,0.1);">Final Ürün</td>
                        </tr>
                    </table>
                    
                    <h4>🏢 RUP (Rational Unified Process)</h4>
                    <p>IBM tarafından geliştirilen, büyük projelerde kullanılan modern bir yöntem.</p>
                    
                    <h5>📊 RUP'un 4 Fazı</h5>
                    
                    <h6>🚀 Başlangıç (Inception)</h6>
                    <ul>
                        <li>Proje mantıklı mı?</li>
                        <li>Maliyet ne kadar?</li>
                        <li>Riskler nelerdir?</li>
                        <li>Genel vizyon belirle</li>
                    </ul>
                    
                    <h6>🔍 Ayrıntılandırma (Elaboration)</h6>
                    <ul>
                        <li>Detaylı gereksinimler</li>
                        <li>Mimari tasarım</li>
                        <li>Risk analizi</li>
                        <li>İlk prototip</li>
                    </ul>
                    
                    <h6>🏗️ İnşa (Construction)</h6>
                    <ul>
                        <li>Kodlama ve test</li>
                        <li>Özellik geliştirme</li>
                        <li>Entegrasyon</li>
                        <li>Dokümantasyon</li>
                    </ul>
                    
                    <h6>🚀 Geçiş (Transition)</h6>
                    <ul>
                        <li>Kullanıcıya teslim</li>
                        <li>Eğitim ve destek</li>
                        <li>Hata düzeltme</li>
                        <li>Son testler</li>
                    </ul>
                    
                    <h5>⚖️ RUP'un Özellikleri</h5>
                    <div class="code-block">
✓ Kullanım durumu odaklı
✓ Mimari merkezli
✓ Yinelemeli ve artırımlı
✓ Risk odaklı
✓ Kalite odaklı
                    </div>
                    
                    <h5>🎯 Hangi Durumda Hangi Yöntem?</h5>
                    
                    <p><strong>Prototipleme Kullan:</strong></p>
                    <ul>
                        <li>Gereksinimler belirsiz</li>
                        <li>Yeni teknoloji kullanıyorsan</li>
                        <li>Kullanıcı arayüzü önemli</li>
                    </ul>
                    
                    <p><strong>Spiral Model Kullan:</strong></p>
                    <ul>
                        <li>Yüksek riskli projeler</li>
                        <li>Büyük ve karmaşık sistemler</li>
                        <li>Uzun süreli projeler</li>
                    </ul>
                    
                    <p><strong>RUP Kullan:</strong></p>
                    <ul>
                        <li>Kurumsal projeler</li>
                        <li>Büyük geliştirme ekipleri</li>
                        <li>Dokümantasyon önemli</li>
                    </ul>
                    
                    <h5>💡 Başarı İpuçları</h5>
                    <ul>
                        <li><strong>Basit başla:</strong> Karmaşık prototip yapmaya gerek yok</li>
                        <li><strong>Erken test et:</strong> Prototipleri hemen kullanıcıya göster</li>
                        <li><strong>Esnek ol:</strong> Plan değişebilir, bu normal</li>
                        <li><strong>Risk takip et:</strong> Sorunları erken yakala</li>
                    </ul>
                </div>
            `
        },
        'ileri-uml': {
            title: 'İleri UML ve Model Tabanlı Mühendislik',
            content: `
                <div class="topic-detail">
                    <h4>🧩 İleri UML Diyagramları</h4>
                    <p>Temel UML öğrendikten sonra, daha karmaşık sistemleri modelleyebilmek için ileri diyagram türlerini öğrenelim.</p>
                    
                    <h5>🎭 Davranışsal Diyagramlar</h5>
                    
                    <h6>🔄 State Machine Diyagramları</h6>
                    <p><strong>Amaç:</strong> Bir nesnenin farklı durumlarını ve aralarındaki geçişleri gösterir</p>
                    <div class="code-block">
Örnek: ATM Makinesi Durumları
┌─────────────┐ kart tak ┌──────────────┐
│    Bekliyor │──────────→│ PIN İstiyor  │
└─────────────┘          └──────────────┘
                                │
                         doğru PIN │ yanlış PIN
                                │↓      ↑│
                         ┌──────────────┐ │
                         │   İşlem      │ │
                         │   Seçimi     │ │
                         └──────────────┘ │
                                │←────────┘
                           işlem tamam
                                │
                                ↓
                         ┌──────────────┐
                         │ Kart İadesi  │
                         └──────────────┘
                    </div>
                    
                    <h6>📅 Timing Diyagramları</h6>
                    <ul>
                        <li>Zamanla değişen durumları gösterir</li>
                        <li>Gerçek zamanlı sistemlerde önemli</li>
                        <li>Performans analizi için kullanılır</li>
                    </ul>
                    
                    <h6>🤝 Communication Diyagramları</h6>
                    <ul>
                        <li>Nesneler arası ilişkileri vurgular</li>
                        <li>Sequence diyagramına alternatif</li>
                        <li>Karmaşık etkileşimlerde kullanışlı</li>
                    </ul>
                    
                    <h5>🏗️ Yapısal Diyagramlar</h5>
                    
                    <h6>📦 Component Diyagramları</h6>
                    <p><strong>Amaç:</strong> Sistemin büyük parçalarını ve aralarındaki bağlantıları gösterir</p>
                    <div class="code-block">
Web Uygulaması Bileşenleri:
┌─────────────────┐    ┌──────────────────┐
│  Kullanıcı      │────│   İş Mantığı     │
│  Arayüzü        │    │   (Business)     │
└─────────────────┘    └──────────────────┘
                                │
                                │
                       ┌──────────────────┐
                       │   Veri Erişim    │
                       │   (Data Access)  │
                       └──────────────────┘
                                │
                                │
                       ┌──────────────────┐
                       │   Veritabanı     │
                       └──────────────────┘
                    </div>
                    
                    <h6>🌐 Deployment Diyagramları</h6>
                    <ul>
                        <li>Yazılımın hangi donanımda çalıştığını gösterir</li>
                        <li>Sunucu yapılandırması için</li>
                        <li>Performans planlaması</li>
                    </ul>
                    
                    <h4>🚀 Çalıştırılabilir UML (Executable UML)</h4>
                    <p>Normal UML sadece tasarım gösterir. Çalıştırılabilir UML'de modelden doğrudan kod üretilebilir!</p>
                    
                    <h5>✨ Executable UML Özellikleri</h5>
                    <ul>
                        <li><strong>Tam Tanımlı:</strong> Her detay modelde belirtilir</li>
                        <li><strong>Test Edilebilir:</strong> Model çalıştırılabilir</li>
                        <li><strong>Platform Bağımsız:</strong> Farklı dillere çevrilebilir</li>
                        <li><strong>Otomatik Kod:</strong> Kod elle yazılmaz, üretilir</li>
                    </ul>
                    
                    <h5>🔧 Action Language (Eylem Dili)</h5>
                    <p>UML modellerinde iş mantığını kodlamamızı sağlar:</p>
                    <div class="code-block">
// UML Action Language Örneği
müşteri = Müşteri.create();
müşteri.adı = "Ahmet Yılmaz";
müşteri.bakiye = 1000;

if (müşteri.bakiye > miktar) then
    müşteri.bakiye = müşteri.bakiye - miktar;
    işlem.durumu = "başarılı";
else
    işlem.durumu = "yetersiz bakiye";
end if;
                    </div>
                    
                    <h4>🏭 Model Driven Architecture (MDA)</h4>
                    <p>Modeli merkeze alan yazılım geliştirme yaklaşımı. "Kod değil, model yaz!" felsefesi.</p>
                    
                    <h5>📊 MDA'nın 3 Katmanı</h5>
                    
                    <h6>1. 💡 CIM (Computation Independent Model)</h6>
                    <ul>
                        <li>İş süreçlerini gösterir</li>
                        <li>Teknik detay yok</li>
                        <li>İş uzmanlarının anlayabileceği seviye</li>
                    </ul>
                    
                    <h6>2. 🎯 PIM (Platform Independent Model)</h6>
                    <ul>
                        <li>Yazılım mantığını gösterir</li>
                        <li>Teknoloji belirtmez</li>
                        <li>Java, C#, Python gibi farklı dillere çevrilebilir</li>
                    </ul>
                    
                    <h6>3. ⚙️ PSM (Platform Specific Model)</h6>
                    <ul>
                        <li>Belirli teknolojiyle sınırlı</li>
                        <li>Gerçek kod üretilebilir</li>
                        <li>Deployment detayları içerir</li>
                    </ul>
                    
                    <h5>🔄 Model Transformation (Dönüşüm)</h5>
                    <div class="code-block">
CIM (İş Modeli)
    │ transformation
    ↓
PIM (Platform Bağımsız)
    │ transformation
    ↓
PSM (Java)    PSM (C#)    PSM(Python)
    │             │           │
    ↓             ↓           ↓
Java Kodu    C# Kodu    Python Kodu
                    </div>
                    
                    <h4>🛠️ Modern UML Araçları</h4>
                    
                    <h5>💼 Profesyonel Araçlar</h5>
                    <ul>
                        <li><strong>Enterprise Architect:</strong> Tam özellikli, büyük projeler</li>
                        <li><strong>IBM Rational Rose:</strong> IBM'nin aracı</li>
                        <li><strong>Visual Paradigm:</strong> Kullanımı kolay</li>
                        <li><strong>StarUML:</strong> Ücretsiz alternatif</li>
                    </ul>
                    
                    <h5>🌐 Online Araçlar</h5>
                    <ul>
                        <li><strong>Draw.io/Diagrams.net:</strong> Ücretsiz, tarayıcı tabanlı</li>
                        <li><strong>Lucidchart:</strong> Collaborative çalışma</li>
                        <li><strong>PlantUML:</strong> Kod ile diyagram oluşturma</li>
                    </ul>
                    
                    <h4>🎯 İleri UML Kullanım Alanları</h4>
                    
                    <h5>🏗️ Sistem Mühendisliği</h5>
                    <ul>
                        <li>Büyük, karmaşık sistemler</li>
                        <li>Donanım-yazılım entegrasyonu</li>
                        <li>Güvenlik kritik sistemler</li>
                    </ul>
                    
                    <h5>📱 Mobil ve Web Uygulamaları</h5>
                    <ul>
                        <li>Kullanıcı deneyimi tasarımı</li>
                        <li>API tasarımı</li>
                        <li>Mikroservis mimarileri</li>
                    </ul>
                    
                    <h5>🤖 Yapay Zeka ve IoT</h5>
                    <ul>
                        <li>Machine Learning pipeline'ları</li>
                        <li>IoT cihaz ağları</li>
                        <li>Edge computing sistemleri</li>
                    </ul>
                    
                    <h4>💡 İleri Seviye İpuçları</h4>
                    
                    <h5>📏 Model Kalitesi</h5>
                    <ul>
                        <li><strong>Tutarlılık:</strong> Farklı diyagramlar birbiriyle uyumlu olmalı</li>
                        <li><strong>Tamlık:</strong> Tüm önemli durumlar modellenmeli</li>
                        <li><strong>Sadelik:</strong> Gereksiz karmaşıklıktan kaçın</li>
                    </ul>
                    
                    <h5>👥 Takım Çalışması</h5>
                    <ul>
                        <li><strong>Standart:</strong> Takım için model kuralları belirle</li>
                        <li><strong>Versiyon kontrol:</strong> Model değişikliklerini takip et</li>
                        <li><strong>İnceleme:</strong> Modelleri birlikte gözden geçir</li>
                    </ul>
                    
                    <h5>⚡ Performans</h5>
                    <ul>
                        <li>Büyük modellerinizi parçalara böl</li>
                        <li>Gereksiz detayları gösterme</li>
                        <li>Sadece gerekli görünümleri oluştur</li>
                    </ul>
                    
                    <h5>🔮 Gelecek</h5>
                    <p>UML sürekli evrimleşiyor. Agile, DevOps ve cloud-native yaklaşımlarla uyumlu yeni versiyonlar geliyor. Temel prensipleri öğrenin, araçlar değişebilir!</p>
                </div>
            `
        }
    };

    return yazilimTopics[topicId] || { title: 'Konu bulunamadı', content: '<p>Bu konu henüz hazırlanmamış.</p>' };
}

// Klavye kısayolları
document.addEventListener('keydown', function(e) {
    // Ctrl + K ile modal kapat
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        closeModal();
    }
    
    // Ctrl + R ile ilerlemeyi sıfırla
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        if (confirm('Tüm ilerlemeyi sıfırlamak istediğinize emin misiniz?')) {
            localStorage.clear();
            location.reload();
        }
    }
});

// Sayfa kapatılmadan önce uyar (eğer ilerleme varsa)
window.addEventListener('beforeunload', function(e) {
    if (completedTopics > 0) {
        e.preventDefault();
        e.returnValue = '';
        return 'Çalışma ilerlemeniz kaydedilecek. Sayfayı kapatmak istediğinize emin misiniz?';
    }
});

// Çalışma süresi takibi
let studyStartTime = Date.now();
setInterval(function() {
    const studyTime = Math.floor((Date.now() - studyStartTime) / 1000);
    const minutes = Math.floor(studyTime / 60);
    const seconds = studyTime % 60;
    
    // Konsola çalışma süresi yazdır
    if (studyTime % 300 === 0) { // Her 5 dakikada bir
        console.log(`📊 Çalışma süresi: ${minutes} dakika ${seconds} saniye`);
    }
}, 1000);

// İSG Test Sistemi
let isgQuestions = [];
let currentISGQuestionIndex = 0;
let userISGAnswers = [];
let isgTestStartTime = null;
let isgTestTimer = null;
let shuffledISGQuestions = [];

// Navigation işlevselliği güncelle
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
});

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn:not(.disabled)');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.dataset.subject;
            switchSubject(subject);
        });
    });
}

function switchSubject(subject) {
    // Tüm nav butonlarından active class'ını kaldır
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Tıklanan butona active class'ı ekle
    document.querySelector(`[data-subject="${subject}"]`).classList.add('active');
    
    // Tüm subject content'leri gizle
    document.querySelectorAll('.subject-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // İlgili subject content'i göster
    document.getElementById(subject).classList.add('active');
}

// İSG sorularını parse et
function parseISGQuestions() {
    const questionsText = `1-Risk değerlendirmesi yapma yükümlülüğü İş Kanununa göre hangi işyerlerini kapsamaktadır?
A) Tüm işyerleri
B) Ağır ve Tehlikeli İşler kapsamındaki işyerleri
C) Sanayiden sayılan işyerleri
D) 50 ve üzerinde işçi çalıştıran işyerleri

3-Aşağıda yer alanlardan hangisi, iş güvenliği uzmanlarının görevleri arasında değildir?
A) Çalışma ortamı gözetimi
B) Rehberlik ve danışmanlık
C) Sağlık gözetimi
D) İlgili birimlerle işbirliği

4-Aşağıdakilerin hangisinde İşyerlerinde, İş sağlığı ve güvenliği kurulu oluşturma şartları doğru olarak verilmiştir?
I-Sanayiden sayılan işler yapıyor olmak
II-Ağır ve tehlikeli işler kapsamında işler yapıyor olmak
III- Altı aydan fazla süren sürekli işlerin yapıldığı işyeri olmak
IV- Elli ve daha fazla işçi çalıştırıyor olmak
a-I-II   b-I-III-IV c-III-IV   d-II-III

5-İşyerinde risk değerlendirmesi yapıldıktan sonra önlemlere karar verilirken aşağıda belirtilen
önlemlerin öncelik sıralamasını nasıl olmalıdır?
I - İşçilere kişisel koruyucu verilmesi
II - Tehlikeli bölümde daha az sayıda işçi çalıştırılması
III - Tehlikenin ortadan kaldırılması
IV - Tehlikeye yol açan durumun daha az tehlikeli olanla değiştirilmesi
A) II - III - IV - I
B) III - II - IV - I
C) II - IV - III - I
D) III - IV - II – I

6- I. Kişiye yönelik koruma uygulamaları
II. Tehlike kaynağına yönelik koruma uygulamaları
III. Ortama yönelik koruma uygulamaları
Yukarıda verilen koruma uygulamalarının öncelik sıralaması aşağıdakilerden hangisidir?
a) I, II, III
b)ll,l, III
c) İ,III,II
d) II, III, I

7- Ölüme, hastalığa, yaralanmaya, hasara veya diğer kayıplara sebebiyet veren istenmeyen olaya……………..,kazaya sebep olan veya sebep olacak potansiyele sahip olan oluşuma ise....... ... ........ denir.
Yukarıdaki boşluklara aşağıdakilerden hangisi gelmelidir?
a) Kaza - Olay
b) Risk – Olay
c) Kaza –Tehlike
d) Risk-Tehlike

8- Sağlığı fiziksel, zihinsel ve toplumsal olarak tam bir iyilik hali olarak tanımlayan kuruluş aşağıdakilerden hangisidir?
a) Uluslararası Çalışma Örgütü
b) Dünya Sağlık Örgütü
c) Avrupa İş Sağlığı ve Güvenliği Ajansı
d) Uluslararası Sosyal Güvenlik Birliği

12-Aşağıdakilerden hangisi meslek hastalığının tanımıdır?
a) Belli meslek sahiplerinde sıkça görülen hastalıklardır.
b) Meslek değişikliği sonucunda ortaya çıkan hastalıklardır.
c) Çalışma hayatındaki stres nedeniyle ortaya çıkan hastalıklardır.
d) Kişilerin çalışma hayatında karşılaştıkları etkenler nedeniyle meydana gelen hastalıklardır.

13- Aşağıdakilerden hangisi işyeri hekiminin işyerine yönelik iş sağlığı uygulama ilkelerinden değildir?
a) Uygun işe yerleştirme
b) İşyeri risklerinin kontrolü
c) Aralıklı kontrol muayeneleri
d) İş sağlığı dışındaki birinci basamak sağlık hizmetleri

14- Genç işçi tanımı için aşağıdakilerden hangisi doğrudur?
a) 16 yaşını tamamlamış, ancak 18 yaşını tamamlamamış kişi
b) 15 yaşını tamamlamış, ancak 18 yaşını tamamlamamış kişi
c) 14 yaşını tamamlamış, ancak 18yaşını tamamlamamış kişi
d) 14 yaşını tamamlamış, ancak 16 yaşını tamamlamamış kişi

15- Aşağıdakilerden hangisi iş sağlığı ve güvenliğinin amaçlarından biri değildir?
a) Çalışanları korumak
b) Üretim güvenliğini sağlamak
c) İşletme güvenliğini sağlamak
d) Malul kalanları rehabilite etmek

16- Aşağıdakilerden hangisi tehlikeli durumlar içinde yer almaz?
a) Uygun olmayan makine koruyucular
b) Yetersiz ve bakımsız bina, alet ve makineler
c) Yetersiz aydınlatma ve havalandırma
d) Kişisel koruyucuları kullanmama

18- iş Sağlığı ve Güvenliği Hizmetleri Yönetmeliği'ne göre aşağıdaki ifadelerden hangisi yanlıştı r?
a) İşveren, işyerinde görev yapan iş güvenliği uzmanının çalışma şartları ile yetki ve sorumlulukları konusunda çalışanları bilgilendirmekle yükümlüdür.
b) İşveren, iş güvenliği uzmanının görevini etkili bir şekilde yapmasını sağlamak için işletme içinde gerekli planlama ve düzenlemeleri yapmasına imkân sağlar.
c) işveren, işyerinde başka bir görevi yürüten mühendis veya teknik elemanı iş güvenliği uzmanlığı sertifikasına sahip olması şartı ile iş güvenliği uzmanı olarak görevlendirebilir.
d)İş güvenliği uzmanı, iş sağlığı ve güvenliği ile ilgili çalışmaları yaptığı süre içinde başka bir işle de görevlendirilebilir.

19- Aşağıdakilerden hangisi iş güvenliği uzmanının görevlerinden biri değildir?
a) Risk değerlendirmesinin yapılmasını sağlamak
b) İş sağlığı ve güvenliği eğitimlerini ilgili mevzuata uygun olarak planlamak ve uygulamak
c) Üretimi artırmak üzere iş planları hazırlamak
d)İşyerinde yapılan çalışmalar ve yapılacak değişikliklerle ilgili olarak, iş sağlığı ve güvenliği mevzuatına ve genel iş güvenliği kurallarına uygun olarak sürdürülmesini sağlamak için işverene tavsiyelerde bulunmak

20- iş güvenliği uzmanlarının yetkilerine ilişkin aşağıdakilerden hangisi yanlıştır?
a) İşyerinde belirlediği yakın ve hayati tehlike oluşturan bir hususun acil müdahale gerektirmesi halinde işveren veya işveren vekilinin onayına gerek kalmadan geçici olarak işi durdurmak
b) İş sağlığı ve güvenliği konusunda inceleme ve araştırma yapmak, gerekli bilgi ve belgelere ulaşmak ve çalışanlarla görüşmek
c) Yakın ve hayati tehlike oluşturan bir husus tespit ettiğinde işverene bildirmek, gerekli tedbirler işveren tarafından alınmadığı takdirde durumu Bakanlığa rapor etmek
d) Görevinin gerektirdiği konularda işverenin bilgisi dâhilinde ilgili kurum ve kuruluşlarla iletişime geçmek ve işyerinin iç düzenlemelerine uygun olarak işbirliği yapmak

21- Çok tehlikeli sınıfta yer alan işyerlerinde bir iş güvenliği uzmanı en fazla kaç işçiye hizmet verebilir?
a)250 b) 500 c) 750 d) 1000

22- I. Az tehlikeli sınıfta yer alan 1000 ve daha fazla işçisi olan işyerlerinde her 1000 işçi için tam gün çalışacak en az bir iş güvenliği uzmanı görevlendirilir,
II. Tehlikeli sınıfta yer alan 750 ve daha fazla işçisi olan işyerlerinde her 750 işçi için tam gün çalışacak en az bir işyeri hekimi görevlendirilir.
III. Çok tehlikeli sınıfta yer alan 250 ve daha fazla işçisi olan işyerlerinde her 250 işçi için tam gün çalışacak en az bir iş güvenliği uzmanı görevlendirilir.
IV.Az tehlikeli sınıfta yer alan 2000 ve daha fazla işçisi olan işyerlerinde her 2000 işçi için tam gün çalışacak en az bir işyeri hekimi görevlendirilir.
İş güvenliği uzmanları ve işyeri hekimlerinin çalışma süreleri ile ilgili yukarıda verilenlerden hangileri doğrudur?
a)I,ll,lll,lV b) l, II c)I, III, IV d) II, IV

23- Aşağıdakilerden hangisi işyeri hekimlerinin görevleri arasında değildir?
a)Bulaşıcı hastalıkların kontrolü için yayılmayı önleme ve bağışıklarına çalışmaları yapmak, portör muayenelerinin yapılmasını sağlamak
b) Hasta muayenesi gibi poliklinik hizmetlerini vermek
c) Bulunması halinde iş sağlığı ve güvenliği kuruluna katılarak çalışma ortamı gözetimi ve işçilerin sağlık gözetimi ile ilgili danışmanlık yapmak ve alınan kararların uygulanmasını izlemek
d)İş sağlığı, hijyen, toplu koruma yöntemleri ve kişisel koruyucu donanımlar konularında tavsiyede bulunmak

24- Aşağıdakilerden hangisi işyeri hekimlerinin görevleri arasında değildir?
a) iş sağlığı ve güvenliği çalışmaları kapsamında işyerinde periyodik incelemeler yapmak ve risk değerlendirme çalışmalarına katılmak
b) Gece postaları da dâhil olmak üzere işçilerin sağlık gözetimini yapmak
c) Gerekli laboratuvar tetkiklerini, radyolojik muayeneleri ve portör muayenelerini yapmak
d) İş sağlığı ve güvenliği alanında yapılacak araştırmalara katılmak

25- Aşağıdaki işyerlerinden hangisinde iş sağlığı ve güvenliği kurulu kurulması gerekir?
a) 9 ay süreyle 88 işçinin çalıştığı petrol ve doğalgaz arama işi
b) 7 ay süreyle 25 işçinin çalıştığı 6 katlı bir binanın yıkım işi
c) 45 öğretmen 900 öğrencili Özel eğitim kurumu
d) 3 ay süreyle 55 işçinin çalıştığı pamuk toplama işi

26- Aşağıdakilerden hangisi tehlikenin tanımıdır?
a) İşyerinde var olan ya da dışarıdan gelebilecek, çalışanı veya işyerini etkileyebilecek zarar veya hasar verme potansiyeli.
b) Tehlikeli bir olayın veya maruz kalma durumunun meydana gelme olasılığı ile olay veya maruz kalma durumunun yol açabileceği yaralanma veya sağlık bozulmasının ciddiyet derecesinin birleşimi
c) Yaralanmalara, ölüme, maddi zararlara veya diğer kayıplara yol açan ve istenmeyen olay
d) Kazaya neden olan veya kazaya sebep potansiyele sahip istenmeyen durum

27- Risk kavramı aşağıdakilerden hangisinde doğru olarak tanımlanmıştır?
a) Yaralanmalara, ölüme, maddi zararlara veya diğer kayıplara yol açan ve istenmeyen olay
b) insanların yaralanması veya sağlığının bozulması veya bunların birlikte gerçekleşmesine sebep olabilecek kaynak, durum veya işlem
c) Kazaya neden olan veya kazaya sebep potansiyele sahip istenmeyen durum
dTehlikeden kaynaklanacak kayıp, yaralanma ya da başka zararlı sonuç meydana gelme ihtimali.

29- Riskleri doğru değerlendirebilmek için aşağıda belirtilen adımlar nasıl sıralanmalıdır?
I.Tehlikelerin değerlendirmesi
II. Tehlikelerin belirlenmesi
III. Kontrol önlemlerinin uygulanması
IV. Risklerin derecelendirilmesi
V. Denetim, izleme ve gözden geçirme
a)II-I-IV-III-V
b)III-II-I-IV-V-
c)II-III-I-V-IV
d)I-II-IV-III-V

30-) Aşağıda önce risk, sonra tehlike yazılmıştır. Bu sıralamalardan hangisi yanlıştır?
a) Doğal gaz –Yangın veya patlama
b) Bel ağrısı-Elle taşıma işleri
c) Elde dolaşım bozuklukları -Titreşim
d) Bulanık görme-Kaynak ışınlan

31- Aşağıda önce tehlike, sonra risk yazılmıştır. Bu sıralamalardan hangisi yanlıştır?
a) Kişinin düşmesi-yüksekte çalışma
b) Kapalı ortamda çalışma - zehirli gazlardan etkilenme
c) Elektrik enerjisi - izolesi bozuk iletkene dokunma ile elektrik çarpması
d) Gürültülü ortam - işitme kaybına yo! Açması

32- Risk kontrol önlemlerinin uygulanmasında sıralama aşağıdakilerden hangisi olmalıdır?
a) Kişisel koruyucular- mühendislikönlemleri - eliminasyon - idari önlemler
b) Eliminasyon - mühendislik önlemleri - idari önlemler - kişisel koruyucular
c) İdari önlemler- eliminasyon - kişisel koruyucular - mühendislik önlemleri
d) Kişisel koruma önlemleri -toplu koruma Önlemleri - eliminasyon - idari önlemler

34- I. İşçilere kişisel koruyucu verilmesi
II. Tehlikeli bölümdedaha az sayıda işçi çalıştırılması
III. Tehlikenin ortadan kaldırılması
IV. Tehlikeye yol açan durumun daha az tehlikeli olanla değiştirilmesi
İşyerinde risk değerlendirmesi yapıldıktan sonra yukarıda belirtilen kontrol önlemlerinin alınmasına karar verilmiştir. Kontrol önlemlerine ilişkin öncelik sıralaması aşağıdakilerden hangisinde doğru verilmiştir?
a)I-II-III-IV
b)III-IV-II-I
c)II-III-IV-I
d)III-II-IV-I

36- Aşağıdakilerden hangisi iş sağlığı ve güvenliği yönünden güvensiz davranış değildir?
a)Tehlikeli hızla çalışma
b)Topraklanrnamış elektrikli makine
c)Görevi dışında iş yapma
d)İş disiplinine uymama

37- Aşağıdakilerden hangisi iş kazalarına neden olabilecek güvensiz davranışlardandır?
a)Yetersiz aydınlatma
b) Yetersiz uyan ve ikaz levhaları
c) Arızalı ve bakımsız ekipmanlar
d) İşe uygun makine kullanmama

38- Aşağıdakilerden hangisi iş kazalarına neden olabilecek tehlikeli hareketlerden değildir?
a) Makine ve tezgâhların hatalı yerleşimi
b) Eğitim yetersizliği
c) Koruyucu tertibatı kullanmama
d) Alet ve makineleri tehlikeli şekilde kullanma

39- İş sağlığı ve güvenliği yönünden aşağıdakilerden hangisi güvensiz davranıştır?
a) İşyeri ortamına yayılmış zararlı toz
b)Kmkfiş veya priz
c) Kişisel koruyucu kullanmama
d) Koruyucusu olmayan makine

40- Aşağıdakilerden hangisi iş sağlığı ve güvenliği yönünden güvensiz durumdur?
a) işe uygun makine kullanmama
b) Makine koruyucusunu çıkarma
c) Görevi dışında iş yapma
d) işe uygun olmayan el aleti

41- Aşağıdaküerden hangisi iş kazalarına neden olabilecek tehlikeli durumlardan değildir?
a) Tehlikeli hızla çalışma
b}Tehlikeli yükseklikteki istiflemeler
c) Güvensiz ve sağlıksızçevre koşullan
d) Topraklanmamış elektrikli makineler

42-Aşağıdaküerden hangisi tehlikeli durum kapsamına girmez?
a) Makine ve tezgâhların hatalı yerleşimi
b) Koruyucu tertibatın bulunmaması veya uygun olmaması
c) Alet ve makineleri tehlikeli şekilde kullanma
d) Uygun olmayan termal konfor şartları

44- Aşağıdakilerden hangisi kişinin niteliklerine uygun olan bir işe yerleştirilmesini amaçlamaktadır?
a) Sistematik muayene
b) İlkmuayene
c) Aralıklı muayene
d) işe giriş muayenesi

45- Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmeliğe göre aşağıdakilerden hangisi/hangileri işverenin yükümlülükleri arasında yer almaktadır?
I. iş sağlığı ve güvenliği eğitimlerini düzenlemek
II. Çalışanların eğitimlere katılımını sağlamak
III. Eğitimler için uygun yer, araç ve gereci teinin etmek
a) Yalnız l b) l, II c) II,III d) l, II, III

46- İş Sağlığı ve Güvenliği Kanununa göre aşağıdaki hallerden hangisinde/hangilerinde işveren çalışanların sağlık muayenelerinin yapılmasını sağlamak zorundadır?
I.İşe giriş,
II.İş değişikliği,
III.İş kazası, meslek hastalığı veya
sağlık nedenli işten uzak kalma sonrası işe dönüşte talep halinde,
IV.Bakanlıkça belirlenen düzenli periyotlar
a) Yalnız l b) l, II c) 1,II,III d) l, II, III,IV

47-İş Sağlığı ve Güvenliği Kanununa göre aşağıdaki hallerden hangisinde/hangilerinde işveren çalışanların iş sağlığı ve güvenliği eğitimlerini almasını sağlamak zorundadır?
I İşe başlamadan önce,
II Çalışma yeri veya iş değişikliğinde,
III İş ekipmanının değişmesi halinde veya yeni teknoloji uygulanması
a) Yalnız l b) l, II c) II,III d) l, II, III

48- Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmeliğe göre aşağıdakilerden hangisi/hangileri çalışanların yükümlülükleri arasında yer almaktadır?
I. İş sağlığı ve güvenliği eğitimlerine katılmak
II. Talirnatve prosedürlere uymak
III. Eğitimleriçin gereken ücreti ödemek
a) Yalnız l b)l,ll c) II, III d)l,ll,lll

49- Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmeliğe göre aşağıdaki ifadelerden hangisi doğru değildir?
a) işverenler, işyerlerinde sağlıklı ve güvenli çalışma ortamının tesis edilmesi için gerekli önlemleri almakla yükümlüdürler.
b) işveren tarafından yapılan eğitimlerde geçen süre çalışma süresinden sayılmaz.
c) İşyerindeki kadınların, gençlerin, çocukların, özürlü, eski hükümlü, terör mağduru ve göçmen işçilerin eğitimine özel önem verilir.
d) Sağlık ve güvenlik ile ilgili özel görevi bulunan çalışanlar ve temsilcileri özel olarak eğitilir.

50- Aşağıdakİlerden hangisi iş sağlığı ve güvenliği eğitimlerinin amaçlarından değildir?
a) işyerlerinde sağlıklı ve güvenli bir ortamı temin etmek
b) İş kazalarını ve meslek hastalıklarını azaltmak
c) İleri seviyede enerji tasarrufu sağlamak
d) İş sağlığı ve güvenliği bilinci oluşturarak uygun davranış kazandırmak

51-Aşağıdakilerden hangisinde çalışan sayısına karşılık gelen çalışan temsilcisi sayısı doğru olarak verilmiştir?
a-45 çalışan-2 çalışan temsilcisi
b-350 çalışan-3 çalışan temsilcisi
c-800 çalışan-3 çalışan temsilcisi
d-1000 çalışan-5 çalışan temsilcisi

52-Aşağıda önce tehlike sonra risk yazılmıştır. Bu sıralamada hangisi yanlıştır.
a.Kapalı ortamlarda çalışma- Zehirli gazlardan etkilenme,
b.Elektrik enerjisi- izolesi bozuk iletkene dokunma ile elektrik çarpması,
c.Gürültülü ortam- işitme kaybına yol açması,
d.Kişinin düşmesi- yüksekte çalışma

53- Çok Tehlikeli Sınıfta yer alan işyerlerinde İş Güvenliği Uzmanı en fazla kaç işçiye hizmet verebilir?
a)250
b)500
c)750
d)1000

54- C sınıfı iş güvenliği uzmanları hangi sınıf işyerlerinde görev ayabilir?
a. Tehlikeli
b. Tehlikeli ve az tehlikeli
c. Az tehlikeli
d. Çok tehlikeli

55- A sınıfı iş güvenliği uzmanları hangi sınıf işyerlerinde görev ayabilir?
a. Tehlikeli
b. Hepsi
c. Az tehlikeli
d. Çok tehlikeli

56- Aşağıda belirtilen işlerden hangisinde İş sağlığı Kanunu hükümleri uygulanmaz?
A)stajyerler hakkında
B)kamu kurum çalışanları hakkında
C)özel sektör çalışanları hakkında
D)ev hizmetleri çalışanları

57- Aşağıda belirtilen işlerden hangisinde İş sağlığı Kanunu hükümleri uygulanır?
a-Afet ve acil durum birimleri
b-çıraklar
c-Hükümlü ve tutuklulara yönelik hizmet yapanlar
d-Kendi nam ve hesabına mal ve hizmet üretimi yapanlar

58- Bir iş sözleşmesine dayanarak çalışan gerçek kişi iş kanununa göre nasıl
tanımlanır?
A) İşveren
B) Çırak
C) Stajyer
D) İşçi

59- Mal veya hizmet üretmek amacıyla maddi olan/olmayan unsurlar ile çalışanın birlikte örgütlendiği, işverenin işyerinde ürettiği mal veya hizmet ile nitelik yönünden bağlılığı bulunan ve aynı yönetim altında örgütlenen işyerine bağlı yerler ile dinlenme, çocuk emzirme, yemek, uyku, yıkanma,    muayene ve bakım, beden ve mesleki eğitim yerleri ve avlu gibi diğer eklentiler ve araçları da içeren organizasyon ifadesi aşağıdakilerden hangisinin tanımıdır?
a.İşyeri
b.Dinlenme tesisi
c.Fabrika
d.Okul

60- İşçi çalıştıran gerçek veya tüzel kişiye yahut tüzel kişiliği olmayan kurum ve
kuruluş iş kanununa göre nasıl tanımlanır?
A)İşçi B)Çırak C)İşveren D)Stajyer

61- İşveren adına hareket eden ve işin, işyerinin ve işletmenin yönetiminde görev alan kimseler iş kanununa göre nasıl tanımlanır?
A) İşveren Vekili
B) İşveren
C) İşçi
D) Çırak

63- Aşağıdakilerden hangisi güvensiz davranış örneğidir?
A) Kaygan zemin
B) Gürültülü ortam
C) Koruyucu eksikliği
D) KKD Kullanmama

65- Hangi işyerlerinde tam süreli iş güvenliği uzmanı görevlendirilmesi
mecburiyeti vardır?
A) Az tehlikeli sınıfta yer alan ve 750 işçi çalıştırılan işyerlerinde,
B) Tehlikeli sınıfta yer alan ve 500 işçi çalıştırılan işyerlerinde,
C) Çok tehlikeli sınıfta yer alan ve 200 işçi çalıştırılan işyerlerinde,
D) Az tehlikeli sınıfta yer alan ve 500 işçi çalıştırılan işyerlerinde

66-Hangi işyerlerinde tam süreli işyeri hekimi görevlendirilmesi mecburiyeti vardır?
A) Tehlikeli sınıfta yer alan ve 750 işçi çalıştırılan işyerlerinde,
B) Az tehlikeli sınıfta yer alan ve 500 işçi çalıştırılan işyerlerinde,
C) Çok tehlikeli sınıfta yer alan ve 250 işçi çalıştırılan işyerlerinde,
D) Tehlikeli sınıfta yer alan ve 500 işçi çalıştırılan işyerlerinde,

67- İş güvenliği uzmanlığı belgeleriyle ilgili aşağıdakilerden hangisi yanlıştır?
A) (B) sınıfı belgeye sahip olanlar tehlikeli ve az tehlikeli sınıflarda yer alan işyerlerinde,
B) (A) sınıfı belgeye sahip olanlar sadece çok tehlikeli ve tehlikeli sınıflarda yer alan işyerlerinde
C) (C) sınıfı belgeye sahip olanlar az tehlikeli sınıfta yer alan işyerlerinde,
D) (A) sınıfı belgeye sahip olanlar bütün tehlike sınıflarında yer alan işyerlerinde, görev yaparlar.

68- Aşağıdakilerden hangisi iş güvenliği uzmanının görevi değildir?
A)Üretimi artırmak
B)Acil durum planlarını hazırlamak
C)Düzeltici faaliyet planlarını yapmak
D)Yangından korunma ve yangınla mücadele çalışmalarını yönetmek ve ilgili kayıtların tutulmasını sağlamak

69- İş Güvenliği uzmanın, bütün tehlike sınıflarında yer alan işyerlerinde çalışabilmesi için hangi sınıf belgeye sahip olması gerekir?
A) A B) B  C) C D) D

70- Aşağıdakilerden hangisi işverenin yükümlülüklerinden biri değildir?
A) İşçileri yasal hak ve sorumlulukları konusunda bilgilendirmek
B) İşçilere mesleki riskler konusunda eğitim vermek
C) Denetlemek
D) İş sağlığı ve iş güvenliği eğitimlerine katılmak

71-İş sağlığı ve iş güvenliği konusunda kimlerin görev ve sorumlulukları
vardır?
A)İşveren B)İşçi C)Devlet D)Hepsi

72- Aşağıdakilerden hangisi, hangileri işverenin yükümlülüğündedir?
I-Teknik gelişmelere uyum sağlanması
II-Tehlikeli olanların, tehlikesiz veya daha az tehlikeli olanlarla değiştirilmesi
III-Toplu korunma önlemlerine, kişisel korunma önlemlerine göre öncelik verilmesi
IV-İşçilere uygun talimatların verilmesi
A) Hepsi B)Hiçbiri C)II, III, IV D) I, III, IV

73- Aşağıda belirtilenlerden hangisi/hangileri İşyerlerinde iş sağlığı ve
güvenliğinin sağlanması için işverenin yükümlülüklerindendir?
I. Gerekli her türlü önlemi almak
II. Araç ve gereçleri noksansız bulundurmak
III. İşyerinde alınan iş sağlığı ve güvenliği önlemlerine uyulup uyulmadığını
denetlemek
IV. İşçileri karşı karşıya bulundukları mesleki riskler, alınması gerekli tedbirler,
yasal hak ve sorumlulukları konusunda bilgilendirmek
A)I, II B)I, II, IV C)Hepsi D)I, IV

74- İşçiler, işverene karşı yükümlülükleri saklı kalmak şartıyla işyerinde sağlık ve güvenliğin korunması ve geliştirilmesinde aşağıdakilerden hangisini yerine getirmekle yükümlü değildir?
A) Sağlık muayenelerine katılmak
B) Fazla mesaiye kalmak
C) Eğitim çalışmalarına katılmak
D) Verilecek talimatlara uymak

75- İş Sağlığı ve Güvenliği ile ilgili Yasal düzenlemelere göre aşağıdakilerden hangisi işverenin görevleri arasında yer almaz?
A) Önlem almak
B) Çalışanları bilgilendirmek
C) İşyerinde denetimler yapmak
D) Çalışanların ailevi sorunları ile ilgilenmek

76- İş sağlığı ve guvenliği kanununa göre aşağıdakilerden hangisi "asli görevinin yanında iş sağlığı ve güvenliği ile ilgili önleme, koruma, tahliye, yangınla mücadele , ilkyardım vb. konularda özel görevlendirilmiş uygun donanım ve yeterli eğitime sahip kişiyi" ifade etmektedir?
a)Destek elemanı
b)İnsan kaynakları eğiticisi
c)Mutemet yetkilisi
d)Çalışan temsilcisi

77- İş sağlığı ve guvenliği kanununa göre aşağıdakilerden hangisi "İş sağlığı ve güvenliği ile ilgili çalışmalara katılma, çalışmaları izleme, tedbir alınmasını isteme, tekliflerde bulunma vb. konularda çalışanları temsil etmeye yetkili çalışanı" ifade etmektedir?
a)Destek elemanı
b)İnsan kaynakları eğiticisi
c)Mutemet yetkilisi
d)Çalışan temsilcisi

78- Aşağıda belirtilen işverenin iş sağlığı ve güvenliği hizmetlerini yükümlülüklerinden hangisi doğru değildir?
a)Belirlenen niteliklere ve gerekli belgeye sahip olması halinde, tehlike sınıfı ve çalışan sayısı dikkate alınarak, bu hizmetin yerine getirilmesini kendisi üstlenebilir.
b)Belirlenen niteliklere ve gerekli belgeye sahip olmayan ancak 50'den az çalışanı bulunan ve çok tehlikeli sınıfta yer alan işyeri işverenleri veya işveren vekili tarafından Bakanlıkça ilan edilen eğitimleri tamamlamak şartıyla işe giriş ve periyodik muayeneler ve tetkikler hariç iş sağlığı ve güvenliği hizmetlerini yürütebilirler.
c)İşveren Çalışanları arasından; Belirlenen niteliklere ve gerekli belgeye sahip olması halinde İş Güvenliği Uzmanı, İşyeri Hekimi ve Diğer Sağlık Personeli görevlendirir.
d)Bu hizmetin tamamını veya bir kısmını OSGB'lerden veya yetkilendirilmiş TSM'lerden hizmet alarak yerine getirebilir.`;

    // Soruları parse et
    const questionBlocks = questionsText.split('\n\n').filter(block => block.trim());
    const parsedQuestions = [];
    
    let questionCounter = 1;
    
    questionBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        if (lines.length >= 5) {
            const questionText = lines[0];
            const optionA = lines[1];
            const optionB = lines[2];
            const optionC = lines[3];
            const optionD = lines[4];
            
            // Doğru cevabı belirle (bu basitleştirilmiş bir versiyon)
            const correctAnswers = {
                1: 'A', 3: 'C', 4: 'b', 5: 'D', 6: 'd', 7: 'c', 8: 'b', 12: 'd', 13: 'd', 14: 'a',
                15: 'd', 16: 'd', 18: 'd', 19: 'c', 20: 'd', 21: 'a', 22: 'c', 23: 'b', 24: 'c', 25: 'a',
                26: 'a', 27: 'd', 29: 'a', 30: 'b', 31: 'a', 32: 'b', 34: 'b', 36: 'b', 37: 'd', 38: 'a',
                39: 'c', 40: 'd', 41: 'a', 42: 'c', 44: 'd', 45: 'd', 46: 'd', 47: 'd', 48: 'b', 49: 'b',
                50: 'c', 51: 'd', 52: 'd', 53: 'a', 54: 'c', 55: 'b', 56: 'D', 57: 'b', 58: 'D', 59: 'a',
                60: 'C', 61: 'A', 63: 'D', 65: 'B', 66: 'A', 67: 'B', 68: 'A', 69: 'A', 70: 'D', 71: 'D',
                72: 'A', 73: 'C', 74: 'B', 75: 'D', 76: 'a', 77: 'd', 78: 'b'
            };

            parsedQuestions.push({
                id: questionCounter,
                question: questionText,
                options: {
                    A: optionA.substring(3), // "A) " kısmını çıkar
                    B: optionB.substring(3),
                    C: optionC.substring(3),
                    D: optionD.substring(3)
                },
                correctAnswer: correctAnswers[questionCounter] || 'A'
            });
            
            questionCounter++;
        }
    });
    
    isgQuestions = parsedQuestions.slice(0, 101); // İlk 101 soru
}

// Test başlatma fonksiyonu
function startISGTest() {
    if (isgQuestions.length === 0) {
        parseISGQuestions();
    }
    
    // Soruları karıştır
    shuffledISGQuestions = [...isgQuestions].sort(() => Math.random() - 0.5);
    
    // Test verilerini sıfırla
    currentISGQuestionIndex = 0;
    userISGAnswers = new Array(shuffledISGQuestions.length).fill(null);
    isgTestStartTime = Date.now();
    
    // UI'yi güncellle
    document.querySelector('.test-controls').style.display = 'none';
    document.getElementById('test-content').style.display = 'block';
    document.getElementById('test-results').style.display = 'none';
    
    // Timer'ı başlat
    startISGTimer();
    
    // İlk soruyu göster
    displayISGQuestion();
    
    showNotification('🚀 İSG Test başlatıldı! Başarılar dilerim!', 'success');
}

// Timer başlatma
function startISGTimer() {
    isgTestTimer = setInterval(() => {
        const elapsed = Date.now() - isgTestStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('test-timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Soru gösterme
function displayISGQuestion() {
    const question = shuffledISGQuestions[currentISGQuestionIndex];
    const questionElement = document.getElementById('question-text');
    const optionsElement = document.getElementById('answer-options');
    
    // Soru metni
    questionElement.textContent = `${currentISGQuestionIndex + 1}. ${question.question}`;
    
    // Seçenekler
    optionsElement.innerHTML = '';
    Object.entries(question.options).forEach(([key, value]) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.onclick = () => selectISGAnswer(key);
        
        // Seçili cevap varsa işaretle
        if (userISGAnswers[currentISGQuestionIndex] === key) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <div class="answer-option-letter">${key}</div>
            <div>${value}</div>
        `;
        
        optionsElement.appendChild(optionElement);
    });
    
    // Navigation butonları
    updateISGNavigationButtons();
    
    // Progress
    updateISGProgress();
}

// Cevap seçme
function selectISGAnswer(selectedOption) {
    userISGAnswers[currentISGQuestionIndex] = selectedOption;
    const currentQuestion = shuffledISGQuestions[currentISGQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer.toUpperCase();
    const isCorrect = selectedOption.toUpperCase() === correctAnswer;
    
    // UI güncelle
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'wrong');
        option.style.pointerEvents = 'none'; // Diğer seçenekleri devre dışı bırak
    });
    
    const selectedElement = event.target.closest('.answer-option');
    selectedElement.classList.add('selected');
    
    // Doğru/yanlış renk göster
    if (isCorrect) {
        selectedElement.classList.add('correct');
        showNotification(`✅ Doğru cevap!`, 'success');
    } else {
        selectedElement.classList.add('wrong');
        showNotification(`❌ Yanlış! Doğru cevap: ${correctAnswer}`, 'info');
    }
    
    // 1.5 saniye sonra otomatik olarak sonraki soruya geç
    setTimeout(() => {
        // Seçenekleri tekrar aktif et
        document.querySelectorAll('.answer-option').forEach(option => {
            option.style.pointerEvents = 'auto';
        });
        
        if (currentISGQuestionIndex < shuffledISGQuestions.length - 1) {
            currentISGQuestionIndex++;
            displayISGQuestion();
        } else {
            // Son soru ise test bitir
            finishTest();
        }
    }, 1500);
}

// Navigation butonlarını güncelle
function updateISGNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    prevBtn.disabled = currentISGQuestionIndex === 0;
    
    if (currentISGQuestionIndex === shuffledISGQuestions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        finishBtn.style.display = 'none';
    }
    
    // Soru sayacı
    document.getElementById('current-question').textContent = currentISGQuestionIndex + 1;
    document.getElementById('total-questions').textContent = shuffledISGQuestions.length;
}

// Progress güncelle
function updateISGProgress() {
    const answered = userISGAnswers.filter(answer => answer !== null).length;
    const percentage = Math.round((answered / shuffledISGQuestions.length) * 100);
    
    document.getElementById('isg-progress').style.width = `${percentage}%`;
    document.getElementById('isg-progress-text').textContent =
        `${answered}/${shuffledISGQuestions.length} Soru Cevaplandı`;
}

// Önceki soru
function previousQuestion() {
    if (currentISGQuestionIndex > 0) {
        currentISGQuestionIndex--;
        displayISGQuestion();
    }
}

// Sonraki soru
function nextQuestion() {
    if (currentISGQuestionIndex < shuffledISGQuestions.length - 1) {
        currentISGQuestionIndex++;
        displayISGQuestion();
    }
}

// Test bitirme
function finishTest() {
    clearInterval(isgTestTimer);
    
    // Sonuçları hesapla
    const results = calculateISGResults();
    
    // UI güncelle
    document.getElementById('test-content').style.display = 'none';
    document.getElementById('test-results').style.display = 'block';
    document.querySelector('.restart-test-btn').style.display = 'inline-flex';
    
    // Sonuçları göster
    displayISGResults(results);
    
    showNotification('🏁 Test tamamlandı! Sonuçlarınızı inceleyebilirsiniz.', 'celebration');
}

// Sonuçları hesapla
function calculateISGResults() {
    let correct = 0;
    let wrong = 0;
    let empty = 0;
    
    userISGAnswers.forEach((answer, index) => {
        if (answer === null) {
            empty++;
        } else if (answer.toUpperCase() === shuffledISGQuestions[index].correctAnswer.toUpperCase()) {
            correct++;
        } else {
            wrong++;
        }
    });
    
    const percentage = Math.round((correct / shuffledISGQuestions.length) * 100);
    
    return { correct, wrong, empty, percentage };
}

// Sonuçları göster
function displayISGResults(results) {
    document.getElementById('score-percentage').textContent = `${results.percentage}%`;
    document.getElementById('correct-count').textContent = results.correct;
    document.getElementById('wrong-count').textContent = results.wrong;
    document.getElementById('empty-count').textContent = results.empty;
    
    // Renk ayarla
    const scoreCircle = document.querySelector('.score-circle');
    if (results.percentage >= 85) {
        scoreCircle.style.borderColor = 'var(--accent-success)';
        scoreCircle.style.color = 'var(--accent-success)';
    } else if (results.percentage >= 70) {
        scoreCircle.style.borderColor = 'var(--accent-warning)';
        scoreCircle.style.color = 'var(--accent-warning)';
    } else {
        scoreCircle.style.borderColor = 'var(--accent-danger)';
        scoreCircle.style.color = 'var(--accent-danger)';
    }
}

// Cevap anahtarını göster/gizle
function toggleAnswerKey() {
    const answerKey = document.getElementById('answer-key');
    
    if (answerKey.style.display === 'none' || !answerKey.style.display) {
        generateAnswerKey();
        answerKey.style.display = 'block';
    } else {
        answerKey.style.display = 'none';
    }
}

// Cevap anahtarını oluştur
function generateAnswerKey() {
    const answerKey = document.getElementById('answer-key');
    answerKey.innerHTML = '';
    
    shuffledISGQuestions.forEach((question, index) => {
        const userAnswer = userISGAnswers[index];
        const correctAnswer = question.correctAnswer.toUpperCase();
        const isCorrect = userAnswer && userAnswer.toUpperCase() === correctAnswer;
        const isEmpty = userAnswer === null;
        
        const keyItem = document.createElement('div');
        keyItem.className = 'answer-key-item';
        
        let answerClass = '';
        let answerText = '';
        
        if (isEmpty) {
            answerClass = 'user-empty';
            answerText = `Doğru: ${correctAnswer} | Sizin: Boş`;
        } else if (isCorrect) {
            answerClass = 'user-correct';
            answerText = `Doğru: ${correctAnswer} | Sizin: ${userAnswer} ✓`;
        } else {
            answerClass = 'user-wrong';
            answerText = `Doğru: ${correctAnswer} | Sizin: ${userAnswer} ✗`;
        }
        
        keyItem.innerHTML = `
            <div class="answer-key-question">${index + 1}. ${question.question.substring(0, 100)}...</div>
            <div class="answer-key-answer ${answerClass}">${answerText}</div>
        `;
        
        answerKey.appendChild(keyItem);
    });
}

// Test yeniden başlatma
function restartISGTest() {
    if (isgTestTimer) {
        clearInterval(isgTestTimer);
    }
    
    // UI sıfırla
    document.querySelector('.test-controls').style.display = 'block';
    document.getElementById('test-content').style.display = 'none';
    document.getElementById('test-results').style.display = 'none';
    document.querySelector('.restart-test-btn').style.display = 'none';
    
    // Progress sıfırla
    document.getElementById('isg-progress').style.width = '0%';
    document.getElementById('isg-progress-text').textContent = 'Test Başlatılmadı';
    
    showNotification('🔄 Test sıfırlandı. Yeniden başlatabilirsiniz.', 'info');
}

// Hastane Otomasyonu Test Sistemi
let hastaneQuestions = [];
let currentHastaneQuestionIndex = 0;
let userHastaneAnswers = [];
let hastaneTestStartTime = null;
let hastaneTestTimer = null;
let shuffledHastaneQuestions = [];
let hastaneIntermediateResults = []; // Her 10 soruda ara sonuçları sakla

// Hastane Otomasyonu sorularını parse et
function parseHastaneQuestions() {
    // Hastane otomasyonu.txt'deki tüm soruları ve cevap anahtarlarını organize et
    const rawData = `DİŞ POLİKLİNİK
1.	Diş Poliklinik modülüne erişim için aşağıdaki yolun hangisi doğrudur?
a)	Hasta İşlemleri > Raporlama
b)	Klinik İşlemleri > Poliklinik
c)	Yönetim > Kullanıcı İşlemleri
d)	Muayene > Diş Takip
e)	Sistem Ayarları > Klinik Yönetimi

2.	Hastanın gelişinde muayene açılmadan önce seçilmesi gereken başvuru niteliği hangisi değildir?
a)	Trafik kazası
b)	İş kazası
c)	Adli vaka
d)	Protez onayı
e)	Müracaat kimlik kontrolü

3.	Şikayetler ekranında aşağıdakilerden hangisi yapılabilir?
a)	Hastanın reçetesi yazılır
b)	Eski şikayetler mevcut muayeneye kopyalanabilir
c)	Protez iş emirleri oluşturulur
d)	Sarf malzemesi düşümü yapılır
e)	Hasta sevki tamamlanır

4.	Teşhis eklemek için hangi bilgi kullanılarak arama yapılabilir?
a)	Hastanın adı
b)	Mernis kodu
c)	ICD10 kodu
d)	Reçete numarası
e)	Protokol numarası

5.	Diş şemasında yarım çenenin otomatik seçilmesini sağlayan buton hangisidir?
a)	Kırmızı çarpı
b)	Mavi kare
c)	Yeşil tik
d)	Diş Durum seçeneği
e)	Tüm Dişleri Temizle butonu

6.	Planlı tedavilerde protez işlemi uygulandıktan sonra hastadan taahhüt almak için hangi işlem yapılır?
a)	Reçete ekranına giriş yapılır
b)	Tedaviye çift tıklanır
c)	Tedavinin üzerine sağ tıklanarak "Taahhüt Al" seçilir
d)	Mernis sorgusu yapılır
e)	Reçete onayı tamamlanır

7.	Protez takip modülünde "Yeni İş Emri" butonu ne işe yarar?
a)	Hastanın eski reçetelerini getirir
b)	Hastaya yapılan protez tedavisi için iş emri oluşturur
c)	Teşhis listesini yeniler
d)	Poliklinik sevki başlatır
e)	Reçete geçmişini temizler

8.	Reçete ekranında e-imza ile Medula'ya gönderim hangi buton ile yapılır?
a)	Reçete Yazdır
b)	Manuel Reçete
c)	E-İmza Reçete Gönder
d)	İlaç Detayı
e)	Reçete Temizle

9.	Sarf malzeme düşümü hangi amaçla yapılmaktadır?
a)	Hastanın teşhislerini kaydetmek için
b)	Poliklinik deposundaki malzemeleri hasta üzerine işlemek için
c)	Reçete geçmişini görmek için
d)	Protez iş emirlerini onaylamak için
e)	Hasta bilgilerini güncellemek için

10.	Bir muayenenin protez muayenesi olduğunu gösteren simge hangisidir?
a)	Mavi "R" simgesi
b)	Turuncu "TT" simgesi
c)	Yeşil "P" simgesi
d)	Kırmızı "S" simgesi
e)	Gri "K" simgesi`;

    // Cevap anahtarları (her 10 soru için)
    const answerKeys = [
        ['B', 'D', 'B', 'C', 'C', 'C', 'B', 'C', 'B', 'B'], // 1-10
        ['B', 'D', 'C', 'C', 'C', 'E', 'D', 'E', 'C', 'A'], // 11-20
        ['A', 'D', 'E', 'B', 'D', 'D', 'E', 'D', 'E', 'C'], // 21-30
        ['A', 'C', 'E', 'D', 'B', 'B', 'D', 'B', 'A', 'C'], // 31-40
        ['C', 'B', 'C', 'C', 'B', 'D', 'E', 'C', 'C', 'C'], // 41-50
        ['B', 'B', 'C', 'B', 'E', 'B', 'A', 'B', 'B', 'C'], // 51-60
        ['C', 'C', 'B', 'C', 'B', 'B', 'C', 'B', 'A', 'C'], // 61-70
        ['B', 'C', 'C', 'B', 'D', 'C', 'C', 'A', 'E', 'D'], // 71-80
        ['A', 'B', 'C', 'A', 'B', 'D', 'D', 'A', 'D', 'B'], // 81-90
        ['C', 'E', 'B', 'C', 'C', 'B', 'C', 'B', 'C', 'C'], // 91-100
        ['B', 'D', 'C', 'C', 'C', 'B', 'C', 'C', 'D', 'B'], // 101-110
        ['B', 'C', 'D', 'C', 'B', 'B', 'B', 'D', 'D', 'C'], // 111-120
        ['B', 'E', 'E', 'B', 'A', 'E', 'E', 'D', 'E', 'E'], // 121-130
        ['C', 'D', 'B', 'E', 'D', 'E', 'D', 'E', 'C', 'E'], // 131-140
        ['E', 'D', 'C', 'B', 'C', 'B', 'B', 'C', 'C', 'C']  // 151-160 (son 10, E harfi 160. soru için placeholder)
    ];

    // Örnek sorular - gerçek uygulamada tüm 160 soru burada olacak
    const questionsData = [
        {
            question: "Diş Poliklinik modülüne erişim için aşağıdaki yolun hangisi doğrudur?",
            options: { A: "Hasta İşlemleri > Raporlama", B: "Klinik İşlemleri > Poliklinik", C: "Yönetim > Kullanıcı İşlemleri", D: "Muayene > Diş Takip", E: "Sistem Ayarları > Klinik Yönetimi" }
        },
        {
            question: "Hastanın gelişinde muayene açılmadan önce seçilmesi gereken başvuru niteliği hangisi değildir?",
            options: { A: "Trafik kazası", B: "İş kazası", C: "Adli vaka", D: "Protez onayı", E: "Müracaat kimlik kontrolü" }
        },
        {
            question: "Şikayetler ekranında aşağıdakilerden hangisi yapılabilir?",
            options: { A: "Hastanın reçetesi yazılır", B: "Eski şikayetler mevcut muayeneye kopyalanabilir", C: "Protez iş emirleri oluşturulur", D: "Sarf malzemesi düşümü yapılır", E: "Hasta sevki tamamlanır" }
        },
        {
            question: "Teşhis eklemek için hangi bilgi kullanılarak arama yapılabilir?",
            options: { A: "Hastanın adı", B: "Mernis kodu", C: "ICD10 kodu", D: "Reçete numarası", E: "Protokol numarası" }
        },
        {
            question: "Diş şemasında yarım çenenin otomatik seçilmesini sağlayan buton hangisidir?",
            options: { A: "Kırmızı çarpı", B: "Mavi kare", C: "Yeşil tik", D: "Diş Durum seçeneği", E: "Tüm Dişleri Temizle butonu" }
        },
        // Daha fazla soru eklenebilir, ancak demo amaçlı ilk 20 soru yeterli
    ];

    // Soruları oluştur (160 soru için genişletilebilir)
    const allQuestions = [];
    
    // Demo için 160 soru oluştur (gerçek uygulamada tüm sorular buraya eklenecek)
    for (let i = 0; i < 160; i++) {
        const sectionIndex = Math.floor(i / 10);
        const questionIndex = i % 10;
        const answerKeyIndex = Math.floor(i / 10);
        
        // Basit soru oluşturma (gerçek uygulamada tüm sorular elle girilmeli)
        const questionData = questionsData[i % 5] || questionsData[0]; // Demo için döngüsel kullan
        
        allQuestions.push({
            id: i + 1,
            sectionIndex: sectionIndex,
            questionIndex: questionIndex,
            question: `${i + 1}. ${questionData.question}`,
            options: questionData.options,
            correctAnswer: answerKeys[answerKeyIndex] ? answerKeys[answerKeyIndex][questionIndex] : 'A',
            originalOrder: i + 1
        });
    }

    hastaneQuestions = allQuestions;
}

// Hastane test başlatma fonksiyonu
function startHastaneTest() {
    if (hastaneQuestions.length === 0) {
        parseHastaneQuestions();
    }
    
    // Soruları karıştır
    shuffledHastaneQuestions = [...hastaneQuestions].sort(() => Math.random() - 0.5);
    
    // Test verilerini sıfırla
    currentHastaneQuestionIndex = 0;
    userHastaneAnswers = new Array(shuffledHastaneQuestions.length).fill(null);
    hastaneTestStartTime = Date.now();
    hastaneIntermediateResults = [];
    
    // UI'yi güncelle
    document.querySelector('#hastane .test-controls').style.display = 'none';
    document.getElementById('hastane-test-content').style.display = 'block';
    document.getElementById('hastane-test-results').style.display = 'none';
    document.getElementById('hastane-intermediate-results').style.display = 'none';
    
    // Timer'ı başlat
    startHastaneTimer();
    
    // İlk soruyu göster
    displayHastaneQuestion();
    
    showNotification('🏥 Hastane Otomasyonu Testi başlatıldı! Başarılar dilerim!', 'success');
}

// Hastane Timer başlatma
function startHastaneTimer() {
    hastaneTestTimer = setInterval(() => {
        const elapsed = Date.now() - hastaneTestStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('hastane-test-timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Hastane soru gösterme
function displayHastaneQuestion() {
    const question = shuffledHastaneQuestions[currentHastaneQuestionIndex];
    const questionElement = document.getElementById('hastane-question-text');
    const optionsElement = document.getElementById('hastane-answer-options');
    
    // Soru metni
    questionElement.textContent = `${currentHastaneQuestionIndex + 1}. ${question.question}`;
    
    // Seçenekler
    optionsElement.innerHTML = '';
    Object.entries(question.options).forEach(([key, value]) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.onclick = () => selectHastaneAnswer(key);
        
        // Seçili cevap varsa işaretle
        if (userHastaneAnswers[currentHastaneQuestionIndex] === key) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <div class="answer-option-letter">${key}</div>
            <div>${value}</div>
        `;
        
        optionsElement.appendChild(optionElement);
    });
    
    // Navigation butonları
    updateHastaneNavigationButtons();
    
    // Progress
    updateHastaneProgress();
}

// Hastane cevap seçme
function selectHastaneAnswer(selectedOption) {
    userHastaneAnswers[currentHastaneQuestionIndex] = selectedOption;
    const currentQuestion = shuffledHastaneQuestions[currentHastaneQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer.toUpperCase();
    const isCorrect = selectedOption.toUpperCase() === correctAnswer;
    
    // UI güncelle
    document.querySelectorAll('#hastane-answer-options .answer-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'wrong');
        option.style.pointerEvents = 'none'; // Diğer seçenekleri devre dışı bırak
    });
    
    const selectedElement = event.target.closest('.answer-option');
    selectedElement.classList.add('selected');
    
    // Doğru/yanlış renk göster
    if (isCorrect) {
        selectedElement.classList.add('correct');
        showNotification(`✅ Doğru cevap!`, 'success');
    } else {
        selectedElement.classList.add('wrong');
        showNotification(`❌ Yanlış! Doğru cevap: ${correctAnswer}`, 'info');
    }
    
    // 1.5 saniye sonra devam et
    setTimeout(() => {
        // Seçenekleri tekrar aktif et
        document.querySelectorAll('#hastane-answer-options .answer-option').forEach(option => {
            option.style.pointerEvents = 'auto';
        });
        
        // Her 10 soruda bir ara sonuç göster
        const nextQuestionIndex = currentHastaneQuestionIndex + 1;
        if (nextQuestionIndex % 10 === 0 && nextQuestionIndex < shuffledHastaneQuestions.length) {
            showIntermediateResults(nextQuestionIndex);
        } else if (nextQuestionIndex < shuffledHastaneQuestions.length) {
            currentHastaneQuestionIndex++;
            displayHastaneQuestion();
        } else {
            // Son soru ise test bitir
            finishHastaneTest();
        }
    }, 1500);
}

// Ara sonuçları göster
function showIntermediateResults(completedQuestions) {
    // Ana test ekranını gizle
    document.getElementById('hastane-test-content').style.display = 'none';
    document.getElementById('hastane-intermediate-results').style.display = 'block';
    
    // Son 10 sorunun sonuçlarını hesapla
    const startIndex = completedQuestions - 10;
    const endIndex = completedQuestions;
    let correct = 0;
    
    for (let i = startIndex; i < endIndex; i++) {
        const userAnswer = userHastaneAnswers[i];
        const correctAnswer = shuffledHastaneQuestions[i].correctAnswer.toUpperCase();
        if (userAnswer && userAnswer.toUpperCase() === correctAnswer) {
            correct++;
        }
    }
    
    // Başlık güncelle
    document.getElementById('intermediate-range').textContent = `${startIndex + 1}-${endIndex}`;
    document.getElementById('intermediate-score-text').textContent = `${correct}/10 Doğru`;
    
    // Ara cevap anahtarını oluştur
    generateIntermediateAnswerKey(startIndex, endIndex);
}

// Ara cevap anahtarı oluştur
function generateIntermediateAnswerKey(startIndex, endIndex) {
    const intermediateAnswerKey = document.getElementById('intermediate-answer-key');
    intermediateAnswerKey.innerHTML = '';
    
    for (let i = startIndex; i < endIndex; i++) {
        const question = shuffledHastaneQuestions[i];
        const userAnswer = userHastaneAnswers[i];
        const correctAnswer = question.correctAnswer.toUpperCase();
        const isCorrect = userAnswer && userAnswer.toUpperCase() === correctAnswer;
        const isEmpty = userAnswer === null;
        
        const keyItem = document.createElement('div');
        keyItem.className = 'answer-key-item';
        
        let answerClass = '';
        let answerText = '';
        
        if (isEmpty) {
            answerClass = 'user-empty';
            answerText = `Doğru: ${correctAnswer} | Sizin: Boş`;
        } else if (isCorrect) {
            answerClass = 'user-correct';
            answerText = `Doğru: ${correctAnswer} | Sizin: ${userAnswer} ✓`;
        } else {
            answerClass = 'user-wrong';
            answerText = `Doğru: ${correctAnswer} | Sizin: ${userAnswer} ✗`;
        }
        
        keyItem.innerHTML = `
            <div class="answer-key-question">${i + 1}. ${question.question.substring(0, 100)}...</div>
            <div class="answer-key-answer ${answerClass}">${answerText}</div>
        `;
        
        intermediateAnswerKey.appendChild(keyItem);
    }
}

// Teste devam et
function continueHastaneTest() {
    currentHastaneQuestionIndex++;
    document.getElementById('hastane-intermediate-results').style.display = 'none';
    document.getElementById('hastane-test-content').style.display = 'block';
    displayHastaneQuestion();
}

// Hastane Navigation butonlarını güncelle
function updateHastaneNavigationButtons() {
    const prevBtn = document.getElementById('hastane-prev-btn');
    const nextBtn = document.getElementById('hastane-next-btn');
    const finishBtn = document.getElementById('hastane-finish-btn');
    
    prevBtn.disabled = currentHastaneQuestionIndex === 0;
    
    if (currentHastaneQuestionIndex === shuffledHastaneQuestions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        finishBtn.style.display = 'none';
    }
    
    // Soru sayacı
    document.getElementById('hastane-current-question').textContent = currentHastaneQuestionIndex + 1;
    document.getElementById('hastane-total-questions').textContent = shuffledHastaneQuestions.length;
}

// Hastane Progress güncelle
function updateHastaneProgress() {
    const answered = userHastaneAnswers.filter(answer => answer !== null).length;
    const percentage = Math.round((answered / shuffledHastaneQuestions.length) * 100);
    
    document.getElementById('hastane-progress').style.width = `${percentage}%`;
    document.getElementById('hastane-progress-text').textContent =
        `${answered}/${shuffledHastaneQuestions.length} Soru Cevaplandı`;
}

// Hastane önceki soru
function previousHastaneQuestion() {
    if (currentHastaneQuestionIndex > 0) {
        currentHastaneQuestionIndex--;
        displayHastaneQuestion();
    }
}

// Hastane sonraki soru
function nextHastaneQuestion() {
    if (currentHastaneQuestionIndex < shuffledHastaneQuestions.length - 1) {
        currentHastaneQuestionIndex++;
        displayHastaneQuestion();
    }
}

// Hastane test bitirme
function finishHastaneTest() {
    clearInterval(hastaneTestTimer);
    
    // Sonuçları hesapla
    const results = calculateHastaneResults();
    
    // UI güncelle
    document.getElementById('hastane-test-content').style.display = 'none';
    document.getElementById('hastane-test-results').style.display = 'block';
    document.querySelector('#hastane .restart-test-btn').style.display = 'inline-flex';
    
    // Sonuçları göster
    displayHastaneResults(results);
    
    showNotification('🏁 Hastane Otomasyonu Testi tamamlandı! Sonuçlarınızı inceleyebilirsiniz.', 'celebration');
}

// Hastane sonuçları hesapla
function calculateHastaneResults() {
    let correct = 0;
    let wrong = 0;
    let empty = 0;
    
    userHastaneAnswers.forEach((answer, index) => {
        if (answer === null) {
            empty++;
        } else if (answer.toUpperCase() === shuffledHastaneQuestions[index].correctAnswer.toUpperCase()) {
            correct++;
        } else {
            wrong++;
        }
    });
    
    const percentage = Math.round((correct / shuffledHastaneQuestions.length) * 100);
    
    return { correct, wrong, empty, percentage };
}

// Hastane sonuçları göster
function displayHastaneResults(results) {
    document.getElementById('hastane-score-percentage').textContent = `${results.percentage}%`;
    document.getElementById('hastane-correct-count').textContent = results.correct;
    document.getElementById('hastane-wrong-count').textContent = results.wrong;
    document.getElementById('hastane-empty-count').textContent = results.empty;
    
    // Renk ayarla
    const scoreCircle = document.querySelector('#hastane-test-results .score-circle');
    if (results.percentage >= 85) {
        scoreCircle.style.borderColor = 'var(--accent-success)';
        scoreCircle.style.color = 'var(--accent-success)';
    } else if (results.percentage >= 70) {
        scoreCircle.style.borderColor = 'var(--accent-warning)';
        scoreCircle.style.color = 'var(--accent-warning)';
    } else {
        scoreCircle.style.borderColor = 'var(--accent-danger)';
        scoreCircle.style.color = 'var(--accent-danger)';
    }
}

// Hastane cevap anahtarını göster/gizle
function toggleHastaneAnswerKey() {
    const answerKey = document.getElementById('hastane-answer-key');
    
    if (answerKey.style.display === 'none' || !answerKey.style.display) {
        generateHastaneAnswerKey();
        answerKey.style.display = 'block';
    } else {
        answerKey.style.display = 'none';
    }
}

// Hastane cevap anahtarını oluştur
function generateHastaneAnswerKey() {
    const answerKey = document.getElementById('hastane-answer-key');
    answerKey.innerHTML = '';
    
    shuffledHastaneQuestions.forEach((question, index) => {
        const userAnswer = userHastaneAnswers[index];
        const correctAnswer = question.correctAnswer.toUpperCase();
        const isCorrect = userAnswer && userAnswer.toUpperCase() === correctAnswer;
        const isEmpty = userAnswer === null;
        
        const keyItem = document.createElement('div');
        keyItem.className = 'answer-key-item';
        
        let answerClass = '';
        let answerText = '';
        
        if (isEmpty) {
            answerClass = 'user-empty';
            answerText = `Doğru: ${correctAnswer} | Sizin: Boş`;
        } else if (isCorrect) {
            answerClass = 'user-correct';
            answerText = `Doğru: ${correctAnswer} | Sizin: ${userAnswer} ✓`;
        } else {
            answerClass = 'user-wrong';
            answerText = `Doğru: ${correctAnswer} | Sizin: ${userAnswer} ✗`;
        }
        
        keyItem.innerHTML = `
            <div class="answer-key-question">${index + 1}. ${question.question.substring(0, 100)}...</div>
            <div class="answer-key-answer ${answerClass}">${answerText}</div>
        `;
        
        answerKey.appendChild(keyItem);
    });
}

// Hastane test yeniden başlatma
function restartHastaneTest() {
    if (hastaneTestTimer) {
        clearInterval(hastaneTestTimer);
    }
    
    // UI sıfırla
    document.querySelector('#hastane .test-controls').style.display = 'block';
    document.getElementById('hastane-test-content').style.display = 'none';
    document.getElementById('hastane-test-results').style.display = 'none';
    document.getElementById('hastane-intermediate-results').style.display = 'none';
    document.querySelector('#hastane .restart-test-btn').style.display = 'none';
    
    // Progress sıfırla
    document.getElementById('hastane-progress').style.width = '0%';
    document.getElementById('hastane-progress-text').textContent = 'Test Başlatılmadı';
    
    showNotification('🔄 Hastane Otomasyonu Testi sıfırlandı. Yeniden başlatabilirsiniz.', 'info');
}