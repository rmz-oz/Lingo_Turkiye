# Lingo Türkiye — Açılış Quizleri

TRT 1'de yayınlanan **Lingo Türkiye** için açılış stratejisi çalışma quizleri.

Her soru şu biçimde: *"N harfli, X ile başlayan bir kelime için aşağıdaki beş
kelimeden hangi ikisi daha iyi bir başlangıç verir?"*

İlk harf oyunda zaten verili olduğu için asıl mesele ilk iki tahmini doğru
seçmek — amaç kelimeyi bulmak değil, **elemek**. İyi bir açılış ikilisi çok
sayıda **farklı** harfi aynı anda dener ve geriye en az adayı bırakır.

## Sayfalar

Site `docs/` klasöründedir.

| Sayfa | İçerik |
|---|---|
| [`docs/oyun.html`](docs/oyun.html) | **Oyunun kendisi** — 3 etap + puzzle + 120 sn final |
| [`docs/index.html`](docs/index.html) | Giriş, sayfaların açıklaması |
| [`docs/4harf.html`](docs/4harf.html) | 4 harfli — 28 ders notu + 54 soru |
| [`docs/5harf.html`](docs/5harf.html) | 5 harfli — 28 ders notu + 54 soru |
| [`docs/6harf.html`](docs/6harf.html) | 6 harfli — 28 ders notu + 54 soru |
| [`docs/7harf.html`](docs/7harf.html) | 7 harfli — 28 ders notu + 51 soru |

Dört sayfa birbirinden bağımsızdır: 4 harfli çalışılmak istendiğinde sadece o
sayfanın içeriği gelir. Her sayfa iki sekmelidir.

**Ders notu** — 28 harfin her biri için kısa kart: açılış ikilisi, havuzda en çok
geçen harfler, en yaygın sesli–sessiz düzeni, sık bitişler, yarışmada en çok
çıkmış cevaplar, açılışın hiç dokunmadığı tuzak kelime.

**Quiz** — iki bölüm:
1. **Açılış** (28 soru): hangi ikili daha iyi başlangıç verir.
2. **Taktik** (23–26 soru): ders notundaki bilgilerin sorusu — en çok geçen harf,
   sesli düzeni, en çok çıkmış cevap, açılıştan hiç renk almayan kelime.

İlerleme tarayıcıda saklanır; sayfa kapatılıp kaldığı yerden devam edilebilir.

## Cevaplar nasıl hesaplandı

- **Havuz:** TDK Güncel Türkçe Sözlük'ten, o harfle başlayan ve o uzunlukta olan
  bütün kelimeler.
- **Ağırlık:** her kelime, Türkçe derlemdeki kullanım sıklığına göre
  ağırlıklandırıldı — nadir bir sözlük maddesinin cevap olma ihtimali düşüktür.
- **Ölçüt:** bir ikilinin puanı, o iki tahmin yapıldıktan sonra renk geri
  bildirimiyle **geriye kalan aday sayısının beklenen değeri**. Düşük olan iyidir.
- Beş seçenekten kurulabilecek on ikilinin tamamı hesaplandı; doğru cevap en
  düşük değeri veren ikili. Sorular, doğru ikili ile ikinci en iyi ikili
  arasında belirgin fark olacak şekilde seçildi.
- **J** harfinde havuz 10–17 kelimeden ibaret olduğu için soru yerine listenin
  tamamı gösteriliyor.

Kelime çıkış sayıları 5–445. bölümlerin cevap arşivinden alınmıştır.

## Oyun

`docs/oyun.html` — telefonda oynanacak şekilde yazıldı, ekran klavyesi Türk
alfabesinin 29 harfini taşır.

**Akış:** 1. etap 3 × 4 harfli + 8–9 harfli puzzle · 2. etap 3 × 5 harfli +
9–10 harfli puzzle · 3. etap 4 kelime + 10–11 harfli puzzle · final 120 saniye,
4'ten 7 harfliye, pas hakkıyla; 7 harfli **süper lingo** ₺50.000.

**Kurallar:** ilk harf verili, 5 tahmin hakkı, her tahmin için **10 saniye**.
Yeşil = doğru yerde, sarı = kelimede var yeri yanlış, gri = yok. Tahminin
sözlükte olması gerekir. Puzzle'da ipucu kelimenin TDK tanımıdır; 3 hak,
her yanlıştan sonra bir harf açılır.

**Kelime seçimi istatistiğe dayanır:** kelimelerin %80'i arşivde gerçekten
cevap olmuş kelimelerden, **kaç kez çıktıysa o kadar yüksek ihtimalle** seçilir
(ÇATI 12 kez çıktığı için 1 kez çıkan bir kelimeden 12 kat olası). Kalan %20
sözlükten gelir — arşivdeki gerçek oran da budur: son 50 bölümde cevapların
%80'i daha önce çıkmış kelimeydi. Puzzle kelimelerinin de %80'i yayında
gerçekten puzzle olmuş kelimelerden seçilir.
