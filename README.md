# CopyClip - Plugin jQuery per copia invisibile

Versione: 1.0.0  
Autore: Flavio  
Licenza: MIT  
Repository: https://github.com/FVLogika/CopyClip

## Descrizione:
CopyClip è un plugin jQuery leggero e modulare che consente di copiare in automatico
contenuti testuali nascosti da un tag custom (default ```<cc-text>```) al clipboard
tramite click su elementi trigger. L'iniezione dei CSS e l'uso della delegazione
degli eventi lo rendono compatibile anche con elementi generati dinamicamente
dopo l'inizializzazione.

## Funzionalità principali:
- Iniezione automatica delle regole CSS per nascondere il tag e attivare il cursore
- Delegazione su document per supporto a elementi dinamici
- Compatibile con Clipboard API moderna e fallback legacy su execCommand
- Callbacks personalizzabili per successo e errore

## Installazione:
1. Includere jQuery nella pagina
2. Includere copyclip.js nel progetto:
- usando una copia scaricata
- usando la CDN https://cdn.jsdelivr.net/gh/FVLogika/CopyClip/copyclip.min.js

## Esempio base:

HTML:
```HTML
<button class="copy">
  Codice segreto
  <cc-text>ABC123</cc-text>
</button>

<p>bla bla bla... <span class="copy">clicca qui<cc-text>testo nascosto da copiare</cc-text></span> ... bla bla</p>
```

JS:
```js
$(function(){
  $.fn.CopyClip({
    onCopy: function(text, el) {
      alert('Testo copiato: ' + text);
    },
    onError: function(err, el) {
      console.error('Errore copia:', err);
    }
  });
});
```

## Compatibilità:

- Qualsiasi elemento cliccabile: button, a, td, div, ecc.  
- Contenuti aggiunti dinamicamente via Ajax o DOM  
- Browser moderni + fallback per browser datati

## Opzioni disponibili:

- selector: Selettore jQuery degli elementi trigger (default: '.copy')
- tag: Nome del tag HTML custom che contiene il testo da copiare (default: 'cc-text')
- onCopy: Funzione callback che riceve il testo copiato e l’elemento cliccato
- onError: Funzione callback che riceve l’errore e l’elemento cliccato

## Note tecniche:

- Il plugin usa navigator.clipboard.writeText quando disponibile.
- Se non disponibile, usa una textarea nascosta e document.execCommand('copy').
- Il tag custom può essere rinominato o sostituito con qualsiasi altro elemento.
- I CSS vengono iniettati solo se non già presenti nel documento.

## Suggerimenti:

- Evita contenuto interattivo dentro <cc-text> per evitare conflitti.
- Se usi tooltip o alert esterni, puoi gestire tutto via la callback onCopy.
- Per sicurezza HTML, verifica che il tag custom sia valido nel tuo framework.

## Licenza:

MIT - uso libero con attribuzione. Vedi LICENSE nel repository.

## Autore:

Flavio – Milan, Italy  
Repository GitHub: https://github.com/FVLogika/CopyClip
