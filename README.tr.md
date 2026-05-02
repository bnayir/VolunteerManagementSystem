<p align="right">
  <a href="README.md">🇬🇧 English</a> | <strong>🇹🇷 Türkçe</strong>
</p>

#  Gönüllülük Yönetim Sistemi: Çok Platformlu Ekosistem

> **Kapsamlı uçtan uca yönetim çözümü:** Modern bir teknolojik çerçeve aracılığıyla organizatörler ve gönüllüler arasındaki bağı güçlendirmek için tasarlanmıştır.

---

##  Proje Genel Bakış
VolunteerConnect; ölçeklenebilir bir **Merkezi API**, dinamik bir **Web Yönetim Paneli** ve kullanıcı odaklı bir **Mobil Uygulama**dan oluşan entegre bir ekosistemdir. Bu proje, birden fazla platformun merkezi bir servis katmanı üzerinden sorunsuz bir şekilde etkileşime girdiği kurumsal düzeyde bir üretim ortamını simüle etmek üzere tasarlanmıştır.

##  Temel Özellikler
*   **Merkezi Komuta:** Yöneticilerin etkinlik oluşturması, başvuruları yönetmesi ve gerçek zamanlı istatistikleri takip etmesi için özelleşmiş Web arayüzü.
*   **Her An Erişim:** Gönüllülerin konum bazlı etkinlikleri keşfetmesi ve tek dokunuşla başvurması için akıcı Mobil deneyim.
*   **Gerçek Zamanlı Analizler:** Katılım oranlarını ve gönüllü bağlılığını doğrudan veritabanından hesaplayan kapsamlı bir dashboard.
*   **Duyuru Modülü:** Yöneticilerden tüm kullanıcılara anlık bilgi akışı sağlayan platformlar arası bildirim sistemi.

---

##  Teknoloji Yığını ve Mimari
Sistem, her platformun bağımsız olarak çalıştığı ancak merkezi bir servis katmanı üzerinden senkronize kaldığı **Ayrıştırılmış (Decoupled) Mimari** ile inşa edilmiştir.

### ⚙️ Backend
*   **Framework:** .NET 8 Web API
*   **Veritabanı:** MS SQL Server & Entity Framework Core (Code First)
*   **Güvenlik:** JWT tabanlı Kimlik Doğrulama ve Rol Tabanlı Yetkilendirme (RBAC)
*   **Odak Noktası:** Veri bütünlüğü, ölçeklenebilirlik ve RESTful prensipleri.

###  Mobil Uygulama 
*   **Teknoloji:** React Native
*   **Durum Yönetimi:** React Hooks
*   **Ağ Yönetimi:** API iletişimi için özel Interceptor yapılı Axios
*   **Depolama:** Güvenli yerel oturum yönetimi için AsyncStorage.

###  Frontend 
*   **Teknoloji:** React.js / Vite
*   **UI/UX:** Masaüstü yönetimi için duyarlı (Responsive) tasarım
*   **Özellikler:** Panel analitikleri ve etkinlik yönetimi için tam CRUD işlemleri.

---

##  Sistem İş Akışı
1.  **Yönetimsel Eylem (Web):** Bir organizatör, Web Paneli üzerinden yeni bir gönüllü etkinliği oluşturur. İstek .NET API tarafından işlenir ve SQL veritabanına kaydedilir.
2.  **Gönüllü Etkileşimi (Mobil):** Gönüllü, API'den en güncel etkinlikleri çeken Mobil Uygulamayı açar.
3.  **Başvuru Süreci:** Bir gönüllü başvurduğunda durum gerçek zamanlı olarak güncellenir. Yönetici başvuruyu onaylayabilir veya reddedebilir; bu durum gönüllünün cihazına anında yansır.
4.  **Senkronizasyon:** Tüm platformlar aynı veritabanını paylaşarak tüm veriler için **"Tek Doğruluk Kaynağı"** (Single Source of Truth) sağlar.

---

##  Geliştirme Felsefesi
Bu mimariyi, sistemin geleceğe hazır olmasını sağlamak için seçtim:
*   **Ölçeklenebilirlik:** İş mantığını yeniden yazmadan yeni platformlar (örneğin bir Masaüstü uygulaması veya Akıllı Saat entegrasyonu) eklenebilir.
*   **Bakım Kolaylığı:** Her bileşen, tüm ekosistemi etkilemeden bağımsız olarak güncellenebilir veya hataları giderilebilir.
*   **Performans:** API sadece gerekli JSON verilerini sunarak mobil kullanıcılar için bant genişliği kullanımını önemli ölçüde azaltır.


