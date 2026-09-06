# Lingo Türkiye — Açılış Quizleri

TRT 1'de yayınlanan **Lingo Türkiye** için açılış stratejisi çalışma quizleri.

Her soru şu biçimde: *"N harfli, X ile başlayan bir kelime için aşağıdaki beş
kelimeden hangi ikisi daha iyi bir başlangıç verir?"*

İlk harf oyunda zaten verili olduğu için asıl mesele ilk iki tahmini doğru
seçmek — amaç kelimeyi bulmak değil, **elemek**. İyi bir açılış ikilisi çok
sayıda **farklı** harfi aynı anda dener ve geriye en az adayı bırakır.

## Sayfalar

| Sayfa | İçerik |
|---|---|
| [`index.html`](index.html) | Giriş, soru tipinin açıklaması |
| [`4harf.html`](4harf.html) | 4 harfli kelimeler — 28 soru |
| [`5harf.html`](5harf.html) | 5 harfli kelimeler — 28 soru |
| [`6harf.html`](6harf.html) | 6 harfli kelimeler — 28 soru |
| [`7harf.html`](7harf.html) | 7 harfli kelimeler — 28 soru |

Dört sayfa birbirinden bağımsızdır: 4 harfli çalışılmak istendiğinde sadece o
sayfanın soruları gelir. Her sayfada Türk alfabesinin 28 harfi sırayla sorulur;
ilerleme tarayıcıda saklanır, sayfa kapatılıp kaldığı yerden devam edilebilir.

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
