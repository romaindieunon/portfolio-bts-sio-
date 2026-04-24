# Portfolio BTS SIO SISR — Romain Dieunon

Portfolio multi-pages réalisé en HTML / CSS / JavaScript pur (aucun framework, aucune dépendance hors Google Fonts).

## Structure des fichiers

```
portfolio/
├── index.html              # Accueil
├── apropos.html            # À propos / CV
├── entreprise.html         # Présentation de l'entreprise
├── projets.html            # Tableau + fiches projets
├── veille.html             # Veille technologique
├── contact.html            # Formulaire de contact
├── css/
│   └── style.css           # Styles de toutes les pages
├── js/
│   └── script.js           # Menu mobile, animations, formulaire
└── assets/
    ├── photos/
    │   ├── profil.svg      # À remplacer par ta photo (profil.jpg)
    │   └── entreprise.svg  # À remplacer par une photo de l'entreprise
    └── projets/            # Captures / schémas de projets (remplaçables)
        ├── ad.svg
        ├── reseau.svg
        ├── securite.svg
        ├── serveur.svg
        ├── supervision.svg
        └── virtualisation.svg
```

## Comment l'ouvrir

Double-clique simplement sur `index.html` — tout est statique, rien à installer.

Pour un rendu optimal, tu peux aussi servir le site localement :
- **VS Code** : extension "Live Server" → clic droit sur `index.html` → "Open with Live Server".
- **Python** : `python -m http.server` dans le dossier `portfolio/`, puis ouvrir `http://localhost:8000`.

## Comment le personnaliser

### 1. Remplacer les textes "à compléter"
Ouvre chaque fichier `.html` dans un éditeur (VS Code, Sublime, Notepad++…) et cherche les mentions `[à compléter]` ou `[à compléter — …]`. Remplace-les par tes vraies informations :
- Ton âge, ta ville, ton lycée
- Les dates et noms de tes stages
- Le nom et les détails de ton entreprise d'accueil
- Ton sujet de veille technologique

### 2. Remplacer les photos
Glisse tes propres images dans `assets/photos/` et `assets/projets/`, puis :
- Pour la photo de profil : remplace `profil.svg` par `profil.jpg` (ou `.png`) et mets à jour les lignes `<img src="assets/photos/profil.svg" …>` dans `index.html` et `apropos.html`.
- Pour les projets : remplace les `.svg` par tes propres captures d'écran et adapte les `src`.

Taille recommandée :
- Portrait : carré, minimum 400×400 px (800×800 idéalement)
- Projets : 16/9, minimum 800×450 px

### 3. Lier ton CV en PDF
Dans `apropos.html`, cherche le bouton "Télécharger mon CV" et remplace :
```html
<a href="#" class="btn btn-primary" onclick="alert(...); return false;">
```
par :
```html
<a href="assets/cv.pdf" class="btn btn-primary" download>
```
Puis dépose ton `cv.pdf` dans le dossier `assets/`.

### 4. Activer le formulaire de contact
Le formulaire est en "démo" (il affiche un message sans envoyer de mail).
Pour qu'il envoie réellement, deux options simples et gratuites :

**Option A — Formspree** (recommandée, aucun JS à écrire) :
1. Crée un compte sur https://formspree.io (gratuit jusqu'à 50 mails/mois).
2. Récupère ton endpoint, par exemple `https://formspree.io/f/XXXXXXX`.
3. Dans `contact.html`, modifie la balise `<form>` :
   ```html
   <form id="contact-form" class="form-grid fade-in" action="https://formspree.io/f/XXXXXXX" method="POST">
   ```
4. Supprime la partie `form.addEventListener(...)` dans `js/script.js` (ou laisse, elle restera inoffensive).

**Option B — mailto simple :**
Remplace le `<form>` par un gros bouton qui ouvre la messagerie :
```html
<a class="btn btn-primary" href="mailto:romaindieunon26@gmail.com?subject=Contact%20depuis%20le%20portfolio">Écrire un mail</a>
```

### 5. Mettre à jour les liens LinkedIn / GitHub
Cherche les `href="#"` dans les footers et dans la page Contact, remplace par tes vrais liens.

## Déployer le portfolio en ligne (gratuit)

Trois options, au choix :

- **GitHub Pages** : crée un repo `romaindieunon.github.io`, pousse les fichiers, c'est en ligne.
- **Netlify Drop** : https://app.netlify.com/drop → glisse le dossier `portfolio/` → URL publique en 10 secondes.
- **Vercel** : pareil que Netlify, très simple pour un site statique.

## Couleurs et thème

Les couleurs sont centralisées dans `css/style.css` tout en haut (variables `--primary`, `--bg`, etc.). Change-les pour adapter l'identité visuelle sans toucher au reste.

## Bonne présentation au jury !
