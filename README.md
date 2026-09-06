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
| [`docs/index.html`](docs/index.html) | Giriş, soru tiplerinin açıklaması |
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
