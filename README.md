# ididit.fyi

![Seeds](./src/static/seeds.png)

Zbuduj osobistą bibliotekę mądrości. <br><br>
Dostępna wersja DEMO bez rejestracji.
<br>
[Zobacz teraz!](https://ididit.fyi/)

## Jak to działa

- Nasiona (seeds) to wartościowe myśli, które dzięki regularnym powtórkom 'kiełkują' i stopniowo stają się częścią Twojego światopoglądu
- W taliach (decks) zapisuj nasiona (autor i źródło opcjonalnie)
- Raz dziennie (o 4 rano) generuje się dzienny przegląd (daily review), który losuje nasiona
- Każde nasiono możesz oznaczyć żeby wyświetlało się codziennie
- Losowanie odbywa się na podstawie limitów które ustawisz dla talii

Przykład: w talii jest 10 kart, a limit tej talii to 2 - codziennie dwa losowe nasiona będą wybierane do przeglądu spośród tych dziesięciu.

![Daily Review](./src/static/daily-review.png)
_Daily Review_

### Pozostała funkcjonalność

- Talie i nasiona posiadają opcje sortowania
- Kolejność talii można ustawić metodą drag & drop (opcja custom)
- Kolejność talii wyświetlanych w przeglądzie jest losowa
- Jeśli przegląd nie jest zakończony, wszelkie zmiany w taliach / nasionach powodują jego aktualizację
- Nasiona oznaczone do codziennych powtórek nie liczą się do limitu talii

Przykład: talia ma ustawiony limit 0, ale jest w niej nasiono oznaczone do codziennych powtórek - to nasiono i tak pojawi się w przeglądzie.

##### Autoryzacja (Firebase Authentication)

- Rejestracja / logowanie z linkiem na adres email
- Rejestracja / logowanie z Google
- Logowanie email + hasło

### Techniczne informacje

##### Firestore (NoSQL)

- Każda zmiana jest natychmiastowo synchronizowana z bazą danych
- Status synchronizacji wskazuje interaktywna ikona chmurki / ładowania
- W razie osiągnięcia limitu wielkości dokumentu Firestore - nasiona, talie lub przegląd przenoszone są do nowych lub mniej zapełnionych dokumentów

##### Firebase cloud functions (NodeJS)

- Rejestracja powoduje utworzenie predefiniowanego dokumentu dla użytkownika w bazie danych
- Usunięcie konta powoduje likwidację wszystkich dokumentów użytkowanika z bazy danych
- Przycisk DEMO powoduje utworzenie anonimowej sesji ze skopiowanymi danymi z konta 'rodzica'

## Technologie

##### Baza projektu:

- Typescript
- Svelte + Sveltekit
- Vite

##### Backend:

- Firebase

##### Design:

- Tailwind CSS
- DaisyUI - biblioteka komponentów Tailwind
- Muuri - biblioteka drag and drop

##### Testy:

- Playwright

## Już wkrótce

- Filtrowanie talii po nazwie
- Filtrowanie nasion po treści, autorze i źródle
- Przenoszenie nasion między taliami
- Operacje na wielu nasionach jednocześnie
  <br><br>
- Tryb powiększonego okna edycji nasion
- Podstawowy edytor tekstu w edycji nasion
- System zarządzania autorami i źródłami
- Opcja dodawania kolejnego nasiona z tym samym autorem i źródłem (przydatne podczas spisywania wielu fragmentów z książki)
  <br><br>
- Możliwość korzystania z aplikacji w trybie offline i synchronizacja danych po ponownym połączeniu z internetem
- Responsywny design