/* ============================================================================
   TSIGOURA VERDE RESORT — Shared data
   ----------------------------------------------------------------------------
   ΠΗΓΗ: ο έντυπος κατάλογος του καταστήματος (φωτογραφίες, Ιούλιος 2026).
   Χρησιμοποιείται ως ο γενικός κατάλογος του εστιατορίου.

   ✅ ΑΠΟ ΤΟΝ ΚΑΤΑΛΟΓΟ, ΑΥΤΟΛΕΞΕΙ:
      ονόματα πιάτων (ΕΛ + EN), τιμές, μονάδες (/kg, 200ml, φιάλη),
      κατηγορίες, και οι τρεις νομικές δηλώσεις στο τέλος.

   ⛔ ΔΕΝ ΥΠΑΡΧΟΥΝ στον κατάλογο — άρα ΔΕΝ ΥΠΑΡΧΟΥΝ ΕΔΩ:
      περιγραφές πιάτων, αλλεργιογόνα ανά πιάτο, χρόνοι αναμονής,
      "δημοφιλή", "επιλογή σεφ", χορτοφαγικά/πικάντικα, βαθμολογίες.
      Όλα αυτά είναι ΚΕΝΑ και συμπληρώνονται από το Pro mode.

   🌐 ΜΕΤΑΦΡΑΣΕΙΣ: Οι πελάτες βλέπουν καθαρό μενού σε 6 γλώσσες. Όπου ένα
      ελληνικό προϊόν δεν μεταφράζεται καλά, κρατάμε το όνομα και εξηγούμε σύντομα.
   ========================================================================== */

const STORAGE_KEY = 'tsigoura_verde_v13';  /* bumped — script-published menu */

const VENUE = {
  name: 'Tsigoura Verde Resort',
  crest: 'TR',
  catalogTitle: { el:'Κατάλογος', en:'Menu', de:'Speisekarte',
                  ro:'Meniu', sr:'Мени', bg:'Меню' },

  /* ⚠️ ΣΥΜΠΛΗΡΩΣΤΕ — δεν τα γνωρίζω, δεν τα εφευρίσκω */
  legal: {
    companyName: '', afm: '', doy: '', gemi: '',
    address: '', phone: '', email: '', mhte: '',
    agoranomikos: 'ΑΓΟΡΑΝΟΜΙΚΟΣ ΥΠΕΥΘΥΝΟΣ: ΜΟΡΑΡΟΥ ΒΙΟΛΕΤΑ',   // ← από τον κατάλογο
  },

  /* Νομικά κείμενα καταλόγου σε όλες τις διαθέσιμες γλώσσες. */
  notices: {
    taxes: {
      el:'Στις τιμές συμπεριλαμβάνονται τα ποσοστά σερβιτόρων και όλοι οι νόμιμοι φόροι.',
      en:'All taxes are included.',
      de:'Alle Steuern sind inbegriffen.',
      ro:'Toate taxele sunt incluse.',
      sr:'Сви порези су укључени.',
      bg:'Всички данъци са включени.' },
    complaints: {
      el:'Το κατάστημα υποχρεούται να διαθέτει έντυπα δελτία, σε ειδική θήκη δίπλα στην έξοδο για τη διατύπωση οποιασδήποτε διαμαρτυρίας.',
      en:'The facility is required to have available preprinted forms, in a special case next to the exit so that any complaint can be expressed.',
      de:'Der Betrieb ist verpflichtet, vorgedruckte Formulare in einem speziellen Behälter neben dem Ausgang bereitzuhalten, damit Beschwerden geäußert werden können.',
      ro:'Unitatea este obligată să dețină formulare pretipărite, într-un suport special lângă ieșire, pentru a putea fi exprimată orice reclamație.',
      sr:'Објекат је дужан да поседује унапред штампане обрасце, у посебном држачу поред излаза, како би се могла изразити било каква жалба.',
      bg:'Заведението е длъжно да разполага с предварително отпечатани формуляри, в специална кутия до изхода, за да може да бъде изразено всякакво оплакване.' },
    allergens: {
      el:'Όλα τα προϊόντα μας μπορεί να περιέχουν αλλεργιογόνα. Σε περίπτωση που έχετε αλλεργίες ή παρουσιάζετε δυσανεξία σε κάποια τρόφιμα, οφείλετε να ενημερώσετε τον σερβιτόρο.',
      en:'All our products may contain allergens. If you have allergies or food intolerances, you must inform the waiter.',
      de:'Alle unsere Produkte können Allergene enthalten. Wenn Sie Allergien oder Unverträglichkeiten haben, müssen Sie den Kellner informieren.',
      ro:'Toate produsele noastre pot conține alergeni. Dacă aveți alergii sau intoleranțe alimentare, trebuie să informați ospătarul.',
      sr:'Сви наши производи могу садржати алергене. Ако имате алергије или интолеранције на храну, морате обавестити конобара.',
      bg:'Всички наши продукти може да съдържат алергени. Ако имате алергии или хранителни непоносимости, трябва да уведомите сервитьора.' },
    thanks: { el:'Ευχαριστούμε!', en:'Thank you!', de:'Danke!', ro:'Mulțumim!', sr:'Хвала!', bg:'Благодарим!' },
  },
};

const LANGUAGES = [
  { code:'el', label:'Ελληνικά', flag:'🇬🇷', verified:true  },
  { code:'en', label:'English',  flag:'🇬🇧', verified:true  },
  { code:'de', label:'Deutsch',  flag:'🇩🇪', verified:true },
  { code:'ro', label:'Română',   flag:'🇷🇴', verified:true },
  { code:'sr', label:'Српски',   flag:'🇷🇸', verified:true },
  { code:'bg', label:'Български',flag:'🇧🇬', verified:true },
];

/* 14 αλλεργιογόνα ΕΕ — η λίστα υπάρχει για να τη ΣΥΜΠΛΗΡΩΣΕΤΕ, όχι για να μαντέψω */
const ALLERGENS = {
  gluten:   { el:'Γλουτένη',        en:'Gluten',        de:'Gluten',        ro:'Gluten',        sr:'Глутен',        bg:'Глутен' },
  crustacea:{ el:'Καρκινοειδή',     en:'Crustaceans',   de:'Krebstiere',    ro:'Crustacee',     sr:'Ракови',        bg:'Ракообразни' },
  eggs:     { el:'Αυγά',            en:'Eggs',          de:'Eier',          ro:'Ouă',           sr:'Јаја',          bg:'Яйца' },
  fish:     { el:'Ψάρια',           en:'Fish',          de:'Fisch',         ro:'Pește',         sr:'Риба',          bg:'Риба' },
  peanuts:  { el:'Αράπικα φιστίκια',en:'Peanuts',       de:'Erdnüsse',      ro:'Arahide',       sr:'Кикирики',      bg:'Фъстъци' },
  soy:      { el:'Σόγια',           en:'Soybeans',      de:'Soja',          ro:'Soia',          sr:'Соја',          bg:'Соя' },
  milk:     { el:'Γάλα',            en:'Milk',          de:'Milch',         ro:'Lapte',         sr:'Млеко',         bg:'Мляко' },
  nuts:     { el:'Ξηροί καρποί',    en:'Tree nuts',     de:'Schalenfrüchte',ro:'Fructe cu coajă',sr:'Језграсти плодови',bg:'Ядки' },
  celery:   { el:'Σέλινο',          en:'Celery',        de:'Sellerie',      ro:'Țelină',        sr:'Целер',         bg:'Целина' },
  mustard:  { el:'Μουστάρδα',       en:'Mustard',       de:'Senf',          ro:'Muștar',        sr:'Слачица',       bg:'Синап' },
  sesame:   { el:'Σουσάμι',         en:'Sesame',        de:'Sesam',         ro:'Susan',         sr:'Сусам',         bg:'Сусам' },
  sulphites:{ el:'Θειώδη',          en:'Sulphites',     de:'Sulfite',       ro:'Sulfiți',       sr:'Сулфити',       bg:'Сулфити' },
  lupin:    { el:'Λούπινο',         en:'Lupin',         de:'Lupinen',       ro:'Lupin',         sr:'Лупина',        bg:'Лупина' },
  molluscs: { el:'Μαλάκια',         en:'Molluscs',      de:'Weichtiere',    ro:'Moluște',       sr:'Мекушци',       bg:'Мекотели' },
};

/* Κατηγορίες — ΕΛ/EN αυτολεξεί από τον κατάλογο */
const DEFAULT_CATEGORIES = [
  { id:'appetizers', order:1, icon:'dip',   t:{ el:'Ορεκτικά', en:'Appetizers', de:'Vorspeisen', ro:'Aperitive', sr:'Предјела', bg:'Предястия' } },
  { id:'salads',     order:2, icon:'salad', t:{ el:'Σαλάτες',  en:'Salads',     de:'Salate',     ro:'Salate',    sr:'Салате',   bg:'Салати' } },
  { id:'spit',       order:3, icon:'skewer', hidden:true, accent:'#B4623A', tint:'#F6E6DC', image:'media/dishes/67-lamb-spit-clean.png', t:{ el:'Σούβλες', en:'On the spit', de:'Vom Spieß', ro:'La proțap', sr:'Са ражња', bg:'На шиш' } },
  { id:'meat',       order:4, icon:'meat',  t:{ el:'Της ώρας', en:'Grill dishes',de:'Vom Grill', ro:'La grătar', sr:'Са роштиља', bg:'Скара' } },
  { id:'drinks',     order:5, icon:'wine',  t:{ el:'Ποτά',     en:'Drinks',     de:'Getränke',   ro:'Băuturi',   sr:'Пића',     bg:'Напитки' } },
  { id:'pizza',      order:6, icon:'pizza', hidden:true, t:{ el:'Πίτσες',   en:'Pizzas',     de:'Pizzen',     ro:'Pizza',     sr:'Пице',     bg:'Пици' } },
];

/* --------------------------------------------------------------------------
   ΜΕΝΟΥ — κάθε γραμμή αντιστοιχεί 1:1 σε γραμμή του έντυπου καταλόγου.
   allergens:[] και desc:'' ΕΠΙΤΗΔΕΣ ΚΕΝΑ. Συμπληρώνονται από το Pro mode.
   -------------------------------------------------------------------------- */
const M = (id,cat,price,unit,icon,el,en,de,ro,sr,bg) => ({
  id, cat, price, unit, icon,
  available:true, allergens:[],
  t:{ el:{n:el,d:''}, en:{n:en,d:''}, de:{n:de,d:''}, ro:{n:ro,d:''}, sr:{n:sr,d:''}, bg:{n:bg,d:''} }
});

const DEFAULT_MENU = [
  /* --- Ορεκτικά / Appetizers --- */
  M(101,'appetizers', 5.00,'portion','dip',      'Τζατζίκι χειροποίητο','Homemade Tzatziki','Hausgemachtes Tzatziki','Tzatziki de casă','Домаћи џаџики','Домашно дзадзики'),
  M(102,'appetizers', 5.00,'portion','dip',      'Τυροσαλάτα','Tyrosalata','Tyrosalata','Tyrosalata','Тиросалата','Тиросалата'),
  M(103,'appetizers', 5.00,'portion','cheese',   'Φέτα λαδορίγανη','Feta with Oil & Oregano','Feta mit Öl & Oregano','Feta cu ulei și oregano','Фета са уљем и ориганом','Фета със зехтин и риган'),
  M(104,'appetizers', 5.00,'portion','dip',      'Μελιτζανοσαλάτα','Melitzanosalata','Melitzanosalata','Melitzanosalata','Мелицаносалата','Мелицаносалата'),
  M(105,'appetizers', 8.00,'portion','pot',      'Μπουγιούρντι','Bougourdi','Bougourdi','Bougourdi','Бујурди','Буюрди'),
  M(106,'appetizers', 9.00,'portion','cheese',   'Φέτα σουσάμι μέλι','Feta with Sesame & Honey','Feta mit Sesam & Honig','Feta cu susan și miere','Фета са сусамом и медом','Фета със сусам и мед'),
  M(107,'appetizers', 5.00,'portion','fries',    'Πατάτες τηγανητές','French Fries','Pommes frites','Cartofi prăjiți','Помфрит','Пържени картофи'),
  M(108,'appetizers', 9.00,'portion','zucchini', 'Κολοκυθάκια τηγανητά','Fried Zucchini','Frittierte Zucchini','Dovlecei prăjiți','Пржене тиквице','Пържени тиквички'),
  M(109,'appetizers', 5.00,'portion','dip',      'Ταραμάς','Taramosalata','Taramosalata','Taramosalata','Тарамосалата','Тарамосалата'),
  M(110,'appetizers', 3.00,'portion','pepper',   'Καυτερή πιπεριά','Green Chili Pepper','Scharfe grüne Paprika','Ardei iute verde','Љута зелена паприка','Люта зелена чушка'),
  M(111,'appetizers', 7.50,'portion','pot',      'Φασόλες φούρνου','Baked Giant Beans','Gebackene Riesenbohnen','Fasole mare la cuptor','Печени крупни пасуљ','Печен едър боб'),
  M(112,'appetizers', 7.50,'portion','potato',   'Πατάτες φούρνου','Oven Baked Potatoes','Ofenkartoffeln','Cartofi la cuptor','Печени кромпир','Печени картофи'),
  M(113,'appetizers', 5.00,'portion','fish',     'Αντζούγιες','Salted Anchovies','Gesalzene Sardellen','Anșoa sărate','Слане инћуне','Солена аншоа'),

  /* --- Σαλάτες / Salads --- */
  M(201,'salads',    12.00,'portion','salad',    'Σαλάτα Τσιγγούρα','Tsigoura Salad','Tsigoura-Salat','Salată Tsigoura','Салата Цигура','Салата Цигура'),
  M(202,'salads',     8.00,'portion','salad',    'Αγγουροντομάτα','Cucumber & Tomato','Gurken-Tomaten-Salat','Salată de castraveți și roșii','Салата краставац-парадајз','Салата краставици-домати'),
  M(203,'salads',    10.00,'portion','salad',    'Χωριάτικη','Greek Salad','Griechischer Salat','Salată grecească','Грчка салата','Гръцка салата'),
  M(204,'salads',     8.00,'portion','salad',    'Βραστή ανάμεικτη','Mixed Boiled Vegetables','Gemischtes gekochtes Gemüse','Legume fierte mixte','Мешано кувано поврће','Смесени варени зеленчуци'),
  M(205,'salads',     7.00,'portion','salad',    'Λάχανο-καρότο','Cabbage-Carrot','Kohl-Karotte','Varză-morcov','Купус-шаргарепа','Зеле-морков'),

  /* --- Κρεατικά / Meat --- */
  M(301,'meat',      12.00,'portion','meat',     'Μπριζόλα χοιρινή','Pork Chop','Schweinekotelett','Cotlet de porc','Свињски котлет','Свинска пържола'),
  M(302,'meat',      20.00,'kg',     'meat',     'Μπριζόλα μοσχαρίσια','Beef Chop','Rindersteak','Antricot de vită','Јунећи котлет','Телешка пържола'),
  M(303,'meat',      10.00,'portion','burger',   'Μπιφτέκι','Beef Patty','Rindfleisch-Frikadelle','Chiftea de vită','Плескавица','Кюфте'),
  M(304,'meat',      11.00,'portion','burger',   'Σουτζουκάκι','Soutzoukaki','Soutzoukaki','Chiftele picante','Ћуфте суџукице','Кюфтета суджук'),
  M(305,'meat',      12.00,'portion','drumstick','Μπούτι κοτόπουλο ξεκοκαλισμένο','Boneless Chicken Thigh','Hähnchenschenkel o. Knochen','Pulpă de pui dezosată','Пилећи батак без кости','Обезкостено пилешко бутче'),
  M(306,'meat',      12.00,'portion','drumstick','Φιλέτο κοτόπουλο','Chicken Fillet','Hähnchenfilet','File de pui','Пилећи филе','Пилешко филе'),
  M(307,'meat',      13.00,'portion','skewer',   'Σουβλάκι χοιρινό','Pork Souvlaki','Schweine-Souvlaki','Souvlaki de porc','Свињски ражњић','Свинско сувлаки'),
  M(308,'meat',      14.00,'portion','skewer',   'Σουβλάκι κοτόπουλο','Chicken Souvlaki','Hähnchen-Souvlaki','Souvlaki de pui','Пилећи ражњић','Пилешко сувлаки'),
  M(309,'meat',      12.00,'portion','meat',     'Πανσέτες','Pork Belly','Schweinebauch','Piept de porc','Свињска потрбушина','Свински гърди'),
  M(310,'meat',      15.00,'portion','chop',     'Παϊδάκια αρνήσια','Lamb Chops','Lammkoteletts','Cotlete de miel','Јагњећи котлети','Агнешки котлети'),
  M(311,'meat',      12.00,'portion','chop',     'Παϊδάκια προβατίνα','Mutton Chops','Hammelkoteletts','Cotlete de oaie','Овчији котлети','Овнешки котлети'),
  M(312,'meat',      15.00,'portion','shank',    'Κότσι','Pork Shank','Schweinshaxe','Ciolan de porc','Свињска коленица','Свински джолан'),
  M(313,'spit',      15.00,'portion','skewer',   'Κοντοσούβλι','Kontosouvli','Kontosouvli','Kontosouvli','Контосувли','Контосувли'),
  M(314,'meat',      12.00,'portion','drumstick','Κοτόπουλο σούβλας','Chicken on the Spit','Hähnchen vom Spieß','Pui la proțap','Пилетина на ражњу','Пиле на шиш'),
  M(315,'spit',      55.00,'kg',     'meat',     'Αρνί σούβλας','Lamb on the Spit','Lamm vom Spieß','Miel la proțap','Јагње на ражњу','Агне на шиш'),
  M(316,'meat',      15.00,'portion','fish',     'Μπακαλιάρος με σκορδαλιά','Cod with Garlic Paste','Kabeljau mit Knoblauchcreme','Cod cu pastă de usturoi','Бакалар са белим луком','Треска с чеснова паста'),
  M(317,'meat',       0.00,'portion','meat',     'Tomahawk χοιρινή','Pork Tomahawk','Schweine-Tomahawk','Tomahawk de porc','Свињски tomahawk','Свински tomahawk'),
  M(318,'meat',      12.00,'portion','meat',     'Γύρος','Gyros','Gyros','Gyros','Гирос','Гирос'),
  M(319,'meat',      12.00,'portion','drumstick','Κοτομπουκιές','Chicken Nuggets','Chicken Nuggets','Nuggets de pui','Пилећи нагетси','Пилешки хапки'),

  /* --- Πίτσες / Pizzas --- */
  M(401,'pizza',     10.00,'portion','pizza',    'Μαργαρίτα','Margherita','Margherita','Margherita','Маргарита','Маргарита'),
  M(402,'pizza',     12.00,'portion','pizza',    'Σπέσιαλ','Special','Spezial','Special','Специјал','Специал'),

  /* --- Ποτά / Drinks --- */
  M(501,'drinks',     4.00,'portion','soda',     'Coca-Cola','Coca-Cola','Coca-Cola','Coca-Cola','Кока-Кола','Кока-Кола'),
  M(502,'drinks',     4.00,'portion','soda',     'Fanta Λεμονάδα','Fanta Lemon','Fanta Zitrone','Fanta Lămâie','Фанта лимун','Фанта лимон'),
  M(503,'drinks',     4.00,'portion','soda',     'Fanta Πορτοκαλάδα','Fanta Orange','Fanta Orange','Fanta Portocală','Фанта поморанџа','Фанта портокал'),
  M(504,'drinks',     4.00,'portion','soda',     'Sprite','Sprite','Sprite','Sprite','Спрајт','Спрайт'),
  M(505,'drinks',     4.00,'portion','soda',     'Σόδα','Soda','Soda','Sifon','Сода','Сода'),
  M(506,'drinks',     4.00,'portion','soda',     'Τόνικ','Tonic','Tonic','Apă tonică','Тоник','Тоник'),
  M(507,'drinks',     5.00,'portion','soda',     'Ice Tea Lipton (ροδάκινο/λεμόνι)','Lipton Ice Tea (peach/lemon)','Lipton Eistee (Pfirsich/Zitrone)','Lipton Ice Tea (piersică/lămâie)','Lipton ледени чај (бресква/лимун)','Lipton студен чай (праскова/лимон)'),
  M(508,'drinks',     8.00,'portion','juice',    'Λεμονάδα σπιτική','Homemade Lemonade','Hausgemachte Limonade','Limonadă de casă','Домаћа лимунада','Домашна лимонада'),
  M(509,'drinks',     5.00,'portion','mug',      'Βαρέλι Mythos 400ml','Mythos Draught 400ml','Mythos vom Fass 400ml','Mythos la halbă 400ml','Mythos точено 400ml','Mythos наливна 400ml'),
  M(510,'drinks',     3.50,'portion','mug',      'Βαρέλι Mythos 250ml','Mythos Draught 250ml','Mythos vom Fass 250ml','Mythos la halbă 250ml','Mythos точено 250ml','Mythos наливна 250ml'),
  M(511,'drinks',     5.00,'portion','beer',     'Βεργίνα','Vergina','Vergina','Vergina','Вергина','Вергина'),
  M(512,'drinks',     5.00,'portion','beer',     'Heineken','Heineken','Heineken','Heineken','Хајнекен','Хайнекен'),
  M(513,'drinks',     5.00,'portion','beer',     'Amstel Free','Amstel Free','Amstel Free','Amstel Free','Amstel Free','Amstel Free'),
  M(514,'drinks',     5.00,'portion','wine',     'Ρετσίνα Μαλαματίνα','Malamatina Retsina','Malamatina Retsina','Retsina Malamatina','Рецина Маламатина','Рецина Маламатина'),
  M(515,'drinks',     5.00,'portion','wine',     'Ρετσίνα Γεωργιάδη','Georgiadi Retsina','Georgiadi Retsina','Retsina Georgiadi','Рецина Георгијади','Рецина Георгиади'),
  M(516,'drinks',     6.00,'portion','wine',     'Χύμα ροζέ ημίγλυκο','House Rosé (semi-sweet)','Hausrosé (halbsüß)','Rosé de casă (demidulce)','Домаћи розе (полуслатко)','Домашно розе (полусладко)'),
  M(517,'drinks',     6.00,'portion','wine',     'Χύμα κόκκινο ξηρό','House Red (dry)','Hausrot (trocken)','Roșu de casă (sec)','Домаће црно (суво)','Домашно червено (сухо)'),
  M(518,'drinks',     6.00,'portion','wine',     'Χύμα λευκό ξηρό','House White (dry)','Hausweiß (trocken)','Alb de casă (sec)','Домаће бело (суво)','Домашно бяло (сухо)'),
  M(519,'drinks',    20.00,'portion','wine',     'Ρήγας Κούπα (κόκκινο)','King of Hearts (red)','King of Hearts (rot)','King of Hearts (roșu)','King of Hearts (црвено)','King of Hearts (червено)'),
  M(520,'drinks',    10.00,'portion','drink',    'Ούζο χύμα 200ml','House Ouzo 200ml','Haus-Ouzo 200ml','Ouzo de casă 200ml','Домаћи узо 200ml','Домашно узо 200ml'),
  M(521,'drinks',    10.00,'portion','drink',    'Τσίπουρο χύμα 200ml','House Tsipouro 200ml','Haus-Tsipouro 200ml','Tsipouro de casă 200ml','Домаћи ципуро 200ml','Домашно ципуро 200ml'),
  M(522,'drinks',    12.00,'portion','drink',    'Ηδονικό','Idoniko','Idoniko','Idoniko','Идонико','Идонико'),
  M(523,'drinks',    70.00,'bottle', 'bottle',   'Φιάλη ουίσκι','Whiskey (bottle)','Whisky (Flasche)','Whiskey (sticlă)','Виски (флаша)','Уиски (бутилка)'),
  M(524,'drinks',    70.00,'bottle', 'bottle',   'Φιάλη βότκα','Vodka (bottle)','Wodka (Flasche)','Vodcă (sticlă)','Вотка (флаша)','Водка (бутилка)'),
  M(525,'drinks',    80.00,'bottle', 'bottle',   'Φιάλη ρούμι','Rum (bottle)','Rum (Flasche)','Rom (sticlă)','Рум (флаша)','Ром (бутилка)'),
  M(526,'drinks',    70.00,'bottle', 'bottle',   'Φιάλη Campari','Campari (bottle)','Campari (Flasche)','Campari (sticlă)','Campari (флаша)','Campari (бутилка)'),
  M(527,'drinks',     8.00,'portion','drink',    'Ποτό μερίδα','Spirits (portion)','Spirituosen (Portion)','Tărie (porție)','Жестоко пиће (порција)','Алкохол (порция)'),
];

/* Μεταβλητές/διπλές τιμές & σύντομες περιγραφές */
const PRICE_TEXT = { 302:'20–29€', 317:'Ρωτήστε μας', 516:'500ml 6€ · 1L 12€', 517:'500ml 6€ · 1L 12€', 518:'500ml 6€ · 1L 12€' };
const DESC = {
  101:{ el:'δροσερή σάλτσα γιαουρτιού με αγγούρι και σκόρδο', en:'cool yogurt dip with cucumber and garlic', de:'Joghurt-Dip mit Gurke und Knoblauch', ro:'sos de iaurt cu castravete și usturoi', sr:'освежавајући јогурт намаз са краставцем и белим луком', bg:'свеж йогуртен дип с краставица и чесън' },
  102:{ el:'πικάντικη κρέμα φέτας', en:'spicy feta cheese spread', de:'pikante Feta-Creme', ro:'cremă picantă de feta', sr:'пикантни намаз од фете', bg:'пикантен крем от фета' },
  104:{ el:'κρέμα από ψητή μελιτζάνα', en:'roasted aubergine spread', de:'Creme aus gerösteter Aubergine', ro:'pastă de vinete coapte', sr:'намаз од печеног патлиџана', bg:'разядка от печен патладжан' },
  105:{ el:'φέτα, ντομάτα και πιπεριά στον φούρνο', en:'baked feta with tomato and pepper', de:'gebackener Feta mit Tomate und Paprika', ro:'feta la cuptor cu roșie și ardei', sr:'запечена фета са парадајзом и паприком', bg:'печена фета с домат и чушка' },
  106:{ el:'φέτα με σουσάμι και μέλι', en:'feta with sesame and honey', de:'Feta mit Sesam und Honig', ro:'feta cu susan și miere', sr:'фета са сусамом и медом', bg:'фета със сусам и мед' },
  109:{ el:'άλειμμα από αυγοτάραχο ψαριού', en:'fish roe spread', de:'Fischrogen-Creme', ro:'pastă de icre de pește', sr:'намаз од рибље икре', bg:'разядка от рибен хайвер' },
  111:{ el:'γίγαντες φούρνου με ντομάτα', en:'oven-baked giant beans with tomato', de:'Riesenbohnen aus dem Ofen mit Tomate', ro:'fasole mare la cuptor cu roșii', sr:'крупни пасуљ из рерне са парадајзом', bg:'едър боб на фурна с домат' },
  201:{ el:'μαρούλι, ρόκα, παρμεζάνα, καλαμπόκι, μπαλσάμικο', en:'lettuce, rocket, parmesan, corn, balsamic', de:'Kopfsalat, Rucola, Parmesan, Mais, Balsamico', ro:'salată verde, rucola, parmezan, porumb, balsamic', sr:'зелена салата, рукола, пармезан, кукуруз, балзамико', bg:'маруля, рукола, пармезан, царевица, балсамико' },
  204:{ el:'βραστά λαχανικά εποχής', en:'seasonal boiled vegetables', de:'gekochtes Gemüse der Saison', ro:'legume fierte de sezon', sr:'кувано сезонско поврће', bg:'варени сезонни зеленчуци' },
  302:{ el:'20–29€, ανάλογα το βάρος', en:'20–29€, depending on weight', de:'20–29 €, je nach Gewicht', ro:'20–29 €, în funcție de greutate', sr:'20–29 €, у зависности од тежине', bg:'20–29 €, според теглото' },
  304:{ el:'μικρά μπιφτέκια με ανατολίτικα μπαχαρικά', en:'small spiced meat patties', de:'kleine würzige Fleischröllchen', ro:'mici chiftele condimentate', sr:'мале зачињене ћуфте', bg:'малки пикантни кюфтенца' },
  311:{ el:'παϊδάκια από προβατίνα', en:'mutton chops', de:'Hammelkoteletts', ro:'cotlete de oaie', sr:'овчији котлети', bg:'овнешки котлети' },
  313:{ el:'χοιρινό σε μεγάλη σούβλα, κομμένο σε μερίδα', en:'pork roasted on a large spit, served as a portion', de:'Schweinefleisch vom großen Spieß, als Portion serviert', ro:'carne de porc la proțap mare, servită porție', sr:'свињетина са великог ражња, порција', bg:'свинско на голям шиш, сервирано порция' },
  314:{ el:'κοτόπουλο ψημένο στη σούβλα', en:'spit-roasted chicken', de:'Hähnchen vom Spieß', ro:'pui la proțap', sr:'пилетина са ражња', bg:'пиле на шиш' },
  315:{ el:'αρνί στη σούβλα, τιμή ανά κιλό', en:'spit-roasted lamb, price per kg', de:'Lamm vom Spieß, Preis pro kg', ro:'miel la proțap, preț pe kg', sr:'јагње са ражња, цена по кг', bg:'агне на шиш, цена за кг' },
  316:{ el:'μπακαλιάρος με σκορδαλιά', en:'cod with garlic potato dip', de:'Kabeljau mit Knoblauch-Kartoffel-Creme', ro:'cod cu pastă de cartofi și usturoi', sr:'бакалар са намазом од белог лука', bg:'треска с чеснова картофена разядка' },
  317:{ el:'χοιρινή tomahawk στη σχάρα', en:'grilled pork tomahawk', de:'gegrilltes Schweine-Tomahawk', ro:'tomahawk de porc la grătar', sr:'свињски tomahawk са роштиља', bg:'свински tomahawk на скара' },
  318:{ el:'γύρος μερίδα', en:'gyros portion', de:'Gyros-Portion', ro:'porție de gyros', sr:'порција гироса', bg:'порция гирос' },
  319:{ el:'τραγανές κοτομπουκιές', en:'crispy chicken nuggets', de:'knusprige Chicken Nuggets', ro:'nuggets de pui crocante', sr:'хрскави пилећи нагетси', bg:'хрупкави пилешки хапки' },
  516:{ el:'500ml / 1L', en:'500ml / 1L', de:'500 ml / 1 l', ro:'500 ml / 1 l', sr:'500 ml / 1 l', bg:'500 мл / 1 л' },
  517:{ el:'500ml / 1L', en:'500ml / 1L', de:'500 ml / 1 l', ro:'500 ml / 1 l', sr:'500 ml / 1 l', bg:'500 мл / 1 л' },
  518:{ el:'500ml / 1L', en:'500ml / 1L', de:'500 ml / 1 l', ro:'500 ml / 1 l', sr:'500 ml / 1 l', bg:'500 мл / 1 л' },
  520:{ el:'χύμα ούζο 200ml', en:'house ouzo, 200ml', de:'Haus-Ouzo, 200 ml', ro:'ouzo de casă, 200 ml', sr:'домаћи узо, 200 ml', bg:'домашно узо, 200 мл' },
  521:{ el:'χύμα τσίπουρο 200ml', en:'house tsipouro, 200ml', de:'Haus-Tsipouro, 200 ml', ro:'tsipouro de casă, 200 ml', sr:'домаћи ципуро, 200 ml', bg:'домашно ципуро, 200 мл' },
};
/* Συστατικά (ενδεικτικά, EL/EN) — για το κουμπί (i). ΔΕΝ υποκαθιστούν τη
   δήλωση αλλεργιογόνων: ο πελάτης ΠΡΕΠΕΙ να ρωτά τον σερβιτόρο.
   Επιβεβαίωσέ τα με τον μάγειρα και συμπλήρωσε όσα λείπουν από το Pro mode. */
const INGREDIENTS = {
  101:{el:'γιαούρτι στραγγιστό, αγγούρι, σκόρδο, ελαιόλαδο', en:'strained yogurt, cucumber, garlic, olive oil'},
  102:{el:'φέτα, πιπεριά, ελαιόλαδο', en:'feta, peppers, olive oil'},
  103:{el:'φέτα, ελαιόλαδο, ρίγανη', en:'feta, olive oil, oregano'},
  104:{el:'ψητή μελιτζάνα, σκόρδο, ελαιόλαδο', en:'roasted aubergine, garlic, olive oil'},
  105:{el:'φέτα, ντομάτα, πιπεριά, στον φούρνο', en:'feta, tomato, pepper, baked'},
  106:{el:'φέτα, σουσάμι, μέλι', en:'feta, sesame, honey'},
  107:{el:'πατάτα, ελαιόλαδο, αλάτι', en:'potato, olive oil, salt'},
  108:{el:'κολοκύθι, αλεύρι, ελαιόλαδο', en:'zucchini, flour, olive oil'},
  109:{el:'ταραμάς, ψωμί/πατάτα, λεμόνι, ελαιόλαδο', en:'fish roe, bread/potato, lemon, olive oil'},
  110:{el:'καυτερή πράσινη πιπεριά', en:'green chili pepper'},
  111:{el:'φασόλες γίγαντες, ντομάτα, μυρωδικά', en:'butter beans, tomato, herbs'},
  112:{el:'πατάτες, ελαιόλαδο, μυρωδικά', en:'potatoes, olive oil, herbs'},
  113:{el:'αντζούγιες παστές', en:'salted anchovies'},
  201:{el:'μαρούλι, ρόκα, παρμεζάνα, καλαμπόκι, μπαλσάμικο', en:'lettuce, rocket, parmesan, corn, balsamic'},
  202:{el:'ντομάτα, αγγούρι, κρεμμύδι, ελαιόλαδο', en:'tomato, cucumber, onion, olive oil'},
  203:{el:'ντομάτα, αγγούρι, πιπεριά, ελιές, φέτα, κρεμμύδι, ρίγανη', en:'tomato, cucumber, pepper, olives, feta, onion, oregano'},
  204:{el:'βραστά λαχανικά εποχής', en:'seasonal boiled vegetables'},
  205:{el:'λάχανο, καρότο', en:'cabbage, carrot'},
  301:{el:'χοιρινή μπριζόλα, μπαχαρικά', en:'pork chop, spices'},
  302:{el:'μοσχαρίσια μπριζόλα, μπαχαρικά', en:'beef chop, spices'},
  303:{el:'κιμάς, ψωμί, κρεμμύδι, μπαχαρικά', en:'minced meat, bread, onion, spices'},
  304:{el:'κιμάς, κύμινο, σκόρδο, σάλτσα ντομάτας', en:'minced meat, cumin, garlic, tomato sauce'},
  305:{el:'μπούτι κοτόπουλο, μπαχαρικά', en:'chicken thigh, spices'},
  306:{el:'φιλέτο κοτόπουλο, μπαχαρικά', en:'chicken fillet, spices'},
  307:{el:'χοιρινό, μπαχαρικά', en:'pork, spices'},
  308:{el:'κοτόπουλο, μπαχαρικά', en:'chicken, spices'},
  309:{el:'χοιρινή πανσέτα', en:'pork belly'},
  310:{el:'αρνίσια παϊδάκια', en:'lamb chops'},
  311:{el:'πρόβεια παϊδάκια', en:'mutton chops'},
  312:{el:'χοιρινό κότσι', en:'pork shank'},
  313:{el:'χοιρινό κοντοσούβλι', en:'pork kontosouvli'},
  314:{el:'κοτόπουλο στη σούβλα', en:'chicken on the spit'},
  315:{el:'αρνί στη σούβλα', en:'lamb on the spit'},
  316:{el:'μπακαλιάρος, σκορδαλιά', en:'cod, garlic paste'},
  317:{el:'χοιρινή tomahawk, μπαχαρικά', en:'pork tomahawk, spices'},
  318:{el:'γύρος, ντομάτα, κρεμμύδι, τζατζίκι', en:'gyros, tomato, onion, tzatziki'},
  319:{el:'κοτόπουλο, πανάρισμα, μπαχαρικά', en:'chicken, breading, spices'},
  401:{el:'ζύμη, σάλτσα ντομάτας, μοτσαρέλα', en:'dough, tomato sauce, mozzarella'},
  402:{el:'ζύμη, ντομάτα, μοτσαρέλα, ζαμπόν, μανιτάρια, πιπεριά', en:'dough, tomato, mozzarella, ham, mushrooms, pepper'},
};
/* ────────────────────────────────────────────────────────────────────────
   REMOVABLE — υλικά που ο πελάτης μπορεί να ΑΦΑΙΡΕΣΕΙ από το πιάτο ("χωρίς…").
   Μικρό, ελεγμένο λεξιλόγιο σε 6 γλώσσες. Τα υπόλοιπα πιάτα τα συμπληρώνει
   ο ιδιοκτήτης από το Pro mode. ΔΕΝ αφορά αλλεργίες — αυτές πάντα στον σερβιτόρο.
   ──────────────────────────────────────────────────────────────────────── */
const RM = {
  onion:  {el:'κρεμμύδι',       en:'onion',   de:'Zwiebel',   ro:'ceapă',      sr:'црни лук',    bg:'лук'},
  olives: {el:'ελιές',          en:'olives',  de:'Oliven',    ro:'măsline',    sr:'маслине',     bg:'маслини'},
  pepper: {el:'πιπεριά',        en:'pepper',  de:'Paprika',   ro:'ardei',      sr:'паприка',     bg:'чушка'},
  feta:   {el:'φέτα',           en:'feta',    de:'Feta',      ro:'feta',       sr:'фета',        bg:'сирене'},
  garlic: {el:'σκόρδο',         en:'garlic',  de:'Knoblauch', ro:'usturoi',    sr:'бели лук',    bg:'чесън'},
  oregano:{el:'ρίγανη',         en:'oregano', de:'Oregano',   ro:'oregano',    sr:'оригано',     bg:'риган'},
  chili:  {el:'καυτερή πιπεριά',en:'chili',   de:'Chili',     ro:'ardei iute', sr:'љута паприка',bg:'лют пипер'},
  mush:   {el:'μανιτάρια',      en:'mushrooms',de:'Pilze',    ro:'ciuperci',   sr:'печурке',     bg:'гъби'},
  ham:    {el:'ζαμπόν',         en:'ham',     de:'Schinken',  ro:'șuncă',      sr:'шунка',       bg:'шунка'},
};
/* ΜΟΝΟ πιάτα που ΦΤΙΑΧΝΟΝΤΑΙ ΤΗΝ ΩΡΑ (assembled-to-order) μπορούν να προσαρμοστούν.
   Έτοιμα/χονδρικής (τζατζίκι, μπιφτέκι, σουτζουκάκι, ψητό μπουγιούρντι) ΔΕΝ αλλάζουν. */
const REMOVABLE = {
  202:['onion'],                         /* Αγγουροντομάτα — φρέσκια σαλάτα */
  203:['onion','olives','pepper','feta'],/* Χωριάτικη — φρέσκια σαλάτα */
  402:['ham','mush','pepper'],           /* Σπέσιαλ πίτσα — φτιάχνεται την ώρα */
};
DEFAULT_MENU.forEach(i=>{
  if(PRICE_TEXT[i.id]) i.priceText = PRICE_TEXT[i.id];
  if(DESC[i.id]){
    LANGUAGES.forEach(l=>{ if(DESC[i.id][l.code]) i.t[l.code].d = DESC[i.id][l.code]; });
  }
  if(INGREDIENTS[i.id]) i.ing = INGREDIENTS[i.id];
  if(REMOVABLE[i.id]) i.removable = REMOVABLE[i.id].map(k=>RM[k]);  /* [{el,en,…}] */
});

/* 26 July special-night availability: keep only the event food list visible,
   while drinks remain available. Everything else is hidden from guests. */
const JULY26_VISIBLE = new Set([
  101,102,103,104,105,106,107,110,
  201,202,203,205,
  313,315,
  301,302,303,305,306,307,308,309,317,318,319,
  501,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527
]);
const FORCE_HIDDEN_MENU_IDS = new Set([502,503]); /* Fanta Lemon/Orange hidden for now */
DEFAULT_MENU.forEach(i=>{
  i.hidden = !JULY26_VISIBLE.has(Number(i.id));
});

const UNITS = {
  portion:{ el:'', en:'', de:'', ro:'', sr:'', bg:'' },
  kg:     { el:'/κιλό', en:'/kg', de:'/kg', ro:'/kg', sr:'/kg', bg:'/кг' },
  bottle: { el:'/φιάλη', en:'/bottle', de:'/Flasche', ro:'/sticlă', sr:'/флаша', bg:'/бутилка' },
  '200ml':{ el:'/200ml', en:'/200ml', de:'/200ml', ro:'/200ml', sr:'/200ml', bg:'/200мл' },
};

/* Τραπέζια — δείγμα δομής. Ρυθμίζονται πλήρως από τον πίνακα διαχείρισης. */
const DEFAULT_TABLES = [
  { id:'T1', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 1/7', x:5,  y:35, w:9, h:14, shape:'rect' },
  { id:'T2', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 2/7', x:17, y:35, w:9, h:14, shape:'rect' },
  { id:'T3', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 3/7', x:29, y:35, w:9, h:14, shape:'rect' },
  { id:'T4', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 4/7', x:41, y:35, w:9, h:14, shape:'rect' },
  { id:'T5', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 5/7', x:53, y:35, w:9, h:14, shape:'rect' },
  { id:'T6', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 6/7', x:65, y:35, w:9, h:14, shape:'rect' },
  { id:'T7', zone:'outside', seats:4, status:'open', note:'Πάνω σειρά 7/7', x:77, y:35, w:9, h:14, shape:'rect' },
  { id:'T8', zone:'outside', seats:8, status:'open', note:'Κάτω αριστερά · 4-8 άτομα', x:4, y:65, w:11, h:22, shape:'rect' },
  { id:'T9', zone:'shop', seats:4, status:'open', note:'Στρογγυλό στη γραμμή του μαγαζιού', x:52, y:54, w:14, h:14, shape:'round' },
];

/* Ζώνες: ονομάστε τες όπως τις λέτε εσείς, από τον πίνακα διαχείρισης. */
const ZONES = {
  outside:{ el:'Έξω', en:'Outside', de:'Draußen', ro:'Exterior', sr:'Напољу', bg:'Отвън' },
  door:{ el:'Πόρτα', en:'Door', de:'Tür', ro:'Ușă', sr:'Врата', bg:'Врата' },
  shop:{ el:'Μαγαζί', en:'Inside', de:'Innen', ro:'Interior', sr:'Унутра', bg:'Вътре' },
  a:{ el:'Ζώνη Α', en:'Zone A', de:'Zone A', ro:'Zona A', sr:'Зона А', bg:'Зона А' },
  b:{ el:'Ζώνη Β', en:'Zone B', de:'Zone B', ro:'Zona B', sr:'Зона Б', bg:'Зона Б' },
};

/* ────────────────────────────────────────────────────────────────────────
   ANNOUNCE — γιορτινό banner με ημερομηνίες. Εμφανίζεται μόνο μέσα στο
   παράθυρο [from,to]. Τώρα: ειδική βραδιά σούβλας (Κυρ. 26/7).
   ──────────────────────────────────────────────────────────────────────── */
const ANNOUNCE = {
  on:false, from:'2026-07-26', to:'2026-07-26', emoji:'🔥', targetCat:'spit', specialCats:['spit','meat'],
  t:{
    el:{ title:'Κυριακή 26 Ιουλίου · Σούβλες στη Τσιγγούρα', body:'Ειδική βραδιά με αρνί σούβλας και κοντοσούβλι. Πατήστε εδώ για να δείτε το σημερινό μενού.' },
    en:{ title:'Sunday, 26 July · Souvles at Tsigoura', body:'Special night with spit-roasted lamb and kontosouvli. Tap here to see today’s menu.' },
    de:{ title:'Sonntag, 26. Juli · Souvles im Tsigoura', body:'Spezialabend mit Lamm vom Spieß und Kontosouvli. Tippen Sie hier für das heutige Menü.' },
    ro:{ title:'Duminică, 26 iulie · Souvles la Tsigoura', body:'Seară specială cu miel la proțap și kontosouvli. Apăsați aici pentru meniul de astăzi.' },
    sr:{ title:'Недеља, 26. јул · Сувле у Tsigoura', body:'Посебно вече са јагњетом са ражња и контосувлијем. Додирните овде за данашњи мени.' },
    bg:{ title:'Неделя, 26 юли · Сувлес в Tsigoura', body:'Специална вечер с агне на шиш и контосувли. Докоснете тук за днешното меню.' },
  }
};
const DEFAULT_ANNOUNCEMENT = JSON.parse(JSON.stringify(ANNOUNCE));

const DEFAULT_SETTINGS = {
  serviceOpen:true, acceptOrders:true, currency:'€', defaultLang:'el',
  catalogVersion:'event-pricelist-sunday-26-hidden-spit-booking-media-supabase-v3',
  cacheRevision:0,
  cacheSavedAt:0,
  traditionalMenuOnly:true,
  headerActions:{ booking:false, social:true, wifi:true, language:true },
  design:{ accent:'#38564F', showVisualRail:true, categoryArt:true, motion:'rich', showFeaturedHero:true },
  announcement:JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENT)),
};

/* ---------------- state ---------------- */
function defaultState(){
  return { menu:JSON.parse(JSON.stringify(DEFAULT_MENU)),
           categories:JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
           tables:JSON.parse(JSON.stringify(DEFAULT_TABLES)),
           settings:JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
           orders:[], updatedAt:Date.now() };
}
function loadState(){
  try{ const r=localStorage.getItem(STORAGE_KEY); if(!r) return defaultState();
       const base=defaultState(), saved=JSON.parse(r)||{};
       const merged=Object.assign({}, base, saved);
       merged.settings=Object.assign({}, base.settings, saved.settings||{});
       merged.settings.headerActions=Object.assign({}, base.settings.headerActions, (saved.settings&&saved.settings.headerActions)||{});
       merged.settings.design=Object.assign({}, base.settings.design, (saved.settings&&saved.settings.design)||{});
       if((saved.settings||{}).catalogVersion !== DEFAULT_SETTINGS.catalogVersion){
         const savedById=new Map((Array.isArray(saved.menu)?saved.menu:[]).map(i=>[String(i.id),i]));
         const official=JSON.parse(JSON.stringify(DEFAULT_MENU)).map(i=>{
           const old=savedById.get(String(i.id));
           if(old){
             if(Array.isArray(old.allergens)&&old.allergens.length) i.allergens=old.allergens;
           }
           return i;
         });
         const officialIds=new Set(official.map(i=>String(i.id)));
         const custom=(Array.isArray(saved.menu)?saved.menu:[]).filter(i=>i && !officialIds.has(String(i.id)));
         merged.menu=official.concat(custom);
         merged.categories=base.categories;
         merged.settings.catalogVersion=DEFAULT_SETTINGS.catalogVersion;
         merged.settings.traditionalMenuOnly=DEFAULT_SETTINGS.traditionalMenuOnly;
         merged.settings.headerActions=Object.assign({}, DEFAULT_SETTINGS.headerActions);
         merged.settings.announcement=JSON.parse(JSON.stringify(DEFAULT_SETTINGS.announcement));
       }
       return normalizeState(merged); }catch(e){ return defaultState(); }
}
function normalizeState(s){
  const base=defaultState();
  s.settings=Object.assign({}, base.settings, s.settings||{});
  s.settings.headerActions=Object.assign({}, base.settings.headerActions, s.settings.headerActions||{});
  s.settings.design=Object.assign({}, base.settings.design, s.settings.design||{});
  s.settings.announcement=normalizeAnnouncement(s.settings.announcement||base.settings.announcement);
  s.menu=Array.isArray(s.menu)?s.menu:base.menu;
  s.categories=(Array.isArray(s.categories)&&s.categories.length)?s.categories:base.categories;
  s.tables=Array.isArray(s.tables)?s.tables:base.tables;
  s.orders=Array.isArray(s.orders)?s.orders:[];
  const catIds=new Set(s.categories.map(c=>String(c.id||'')));
  s.categories.forEach((c,ix)=>{
    c.id=String(c.id||('cat'+(ix+1))).slice(0,32);
    c.order=Number.isFinite(Number(c.order))?Number(c.order):ix+1;
    c.icon=c.icon||'bowl';
    c.hidden=c.hidden===true;
    c.image=cleanAssetPath(c.image);
    c.accent=/^#[0-9a-f]{6}$/i.test(String(c.accent||''))?c.accent:null;
    c.tint=/^#[0-9a-f]{6}$/i.test(String(c.tint||''))?c.tint:null;
    c.t=c.t&&typeof c.t==='object'?c.t:{};
    const fallbackCat = c.t.el || c.t.en || c.id;
    LANGUAGES.forEach(l=>{
      const cur=c.t[l.code] || fallbackCat;
      c.t[l.code]=String(typeof cur==='string'?cur:(cur&&cur.n)||fallbackCat).slice(0,40);
    });
  });
  s.menu.forEach((i,ix)=>{
    i.id = i.id || (9000+ix);
    i.cat = catIds.has(String(i.cat)) ? i.cat : (s.categories[0]&&s.categories[0].id)||'appetizers';
    i.price = Math.max(0, Number(i.price)||0);
    i.unit = i.unit || 'portion';
    i.icon = i.icon || i.art || 'bowl';
    i.image=cleanAssetPath(i.image);
    i.available = i.available!==false;
    i.hidden = i.hidden===true;
    if(FORCE_HIDDEN_MENU_IDS.has(Number(i.id))) i.hidden = true;
    i.allergens = Array.isArray(i.allergens)?i.allergens:[];
    i.removable = Array.isArray(i.removable)?i.removable:[];
    i.t = i.t&&typeof i.t==='object'?i.t:{};
    const fallbackName = (i.t.el&&i.t.el.n) || (i.t.en&&i.t.en.n) || 'Νέο πιάτο';
    LANGUAGES.forEach(l=>{
      const cur=i.t[l.code];
      if(!cur || typeof cur!=='object') i.t[l.code]={n:fallbackName,d:''};
      else { cur.n=String(cur.n||fallbackName).slice(0,90); cur.d=String(cur.d||'').slice(0,220); }
    });
  });
  return s;
}
function cleanAssetPath(v){
  v=String(v||'').trim();
  if(!v) return '';
  if(/^https?:\/\//i.test(v)) return v.slice(0,300);
  v=v.replace(/^\/+/,'').replace(/\\/g,'/');
  if(v.includes('..')) return '';
  return v.slice(0,180);
}
function normalizeAnnouncement(a){
  const base=JSON.parse(JSON.stringify(DEFAULT_ANNOUNCEMENT));
  a = (a && typeof a==='object') ? a : {};
  const out=Object.assign({}, base, a);
  out.on = Object.prototype.hasOwnProperty.call(a,'on') ? a.on !== false : base.on !== false;
  out.from = /^\d{4}-\d{2}-\d{2}$/.test(String(out.from||'')) ? String(out.from) : base.from;
  out.to = /^\d{4}-\d{2}-\d{2}$/.test(String(out.to||'')) ? String(out.to) : base.to;
  out.emoji = String(out.emoji||'').slice(0,8);
  out.targetCat = String(out.targetCat||base.targetCat).slice(0,32);
  out.specialCats = Array.isArray(out.specialCats) ? out.specialCats.map(x=>String(x).slice(0,32)).filter(Boolean).slice(0,8) : base.specialCats.slice();
  out.t = (out.t && typeof out.t==='object') ? out.t : {};
  LANGUAGES.forEach(l=>{
    const cur=(out.t&&out.t[l.code]) || {};
    const fallback=(base.t&&base.t[l.code]) || base.t.en || {title:'',body:''};
    out.t[l.code]={
      title:String(cur.title == null ? (fallback.title || '') : cur.title).slice(0,90),
      body:String(cur.body == null ? (fallback.body || '') : cur.body).slice(0,220)
    };
  });
  return out;
}
function saveState(s){ s.updatedAt=Date.now();
  if(s.settings){
    s.settings.cacheRevision=s.updatedAt;
    s.settings.cacheSavedAt=s.updatedAt;
  }
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    localStorage.setItem(STORAGE_KEY+'_ping', String(s.updatedAt));
    localStorage.setItem(STORAGE_KEY+'_revision', String(s.updatedAt));
  }catch(e){}
}
function resetState(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }
