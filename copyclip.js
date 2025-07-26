// CopyClip jQuery Plugin v1.0.0
// https://github.com/tuo-repo/copyclip
// License: MIT

;(function($){
	'use strict';

	/**
	 * Verifica se esiste già nel documento una regola CSS per il tag custom.
	 * Serve a non duplicare l'iniezione dello style.
	 *
	 * @param {String} tagName Nome del tag custom (es: 'cc-text')
	 * @returns {Boolean} true se trova almeno una regola per quel tag, false altrimenti
	 */
	function cssTagExists(tagName) {
		// Scorri tutti gli styleSheet caricati in pagina
		for (var i = 0; i < document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			var rules;
			// Cross-origin stylesheet possono lanciare eccezioni su .cssRules
			try {
				rules = sheet.cssRules || sheet.rules;
			} catch (e) {
				continue;
			}
			// Controlla ogni regola per vedere se selettore contiene il nostro tag
			for (var j = 0; j < rules.length; j++) {
				var selector = rules[j].selectorText;
				if (selector && selector.indexOf(tagName) !== -1) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Inietta dinamicamente un tag <style> in <head> per nascondere il tag custom.
	 * Usa cssTagExists per non duplicare l’iniezione.
	 *
	 * @param {String} tagName Nome del tag custom da nascondere
	 */
	function injectTagStyle(tagName) {
		if (cssTagExists(tagName)) {
			return; // già presente, non faccio nulla
		}
		var css = tagName + " { display: none !important; }";
		var style = document.createElement('style');
		style.id = 'copyClipStyles';
		style.type = 'text/css';
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	}

	/**
	 * Funzione principale del plugin.
	 * Applica delegazione di eventi per intercettare il click sugli elementi target.
	 *
	 * Opzioni disponibili:
	 * - selector: string, selettore jQuery per gli elementi “cliccabili”
	 * - tag: string, nome del tag custom che contiene il testo da copiare
	 * - onCopy: function(text, el), callback dopo copia riuscita
	 * - onError: function(err, el), callback in caso di errore
	 *
	 * @param {Object} options Override delle opzioni di default
	 * @returns {jQuery} this (per il chaining)
	 */
	$.fn.CopyClip = function(options) {
		// Unisci le opzioni utente con i default
		var settings = $.extend({}, $.fn.CopyClip.defaults, options);

		// Inietta lo stile per nascondere il tag custom
		injectTagStyle(settings.tag);

		// Delegazione: intercetta il click sul container (es. document o elemento specifico)
		this.on('click', settings.selector, function(event) {
			// Previeni comportamento default (utile per <a>, ecc.)
			event.preventDefault();

			// Estrai il testo dal tag custom figlio
			var $el = $(this);
			var textToCopy = $el.find(settings.tag).text();

			// Seleziona Clipboard API moderna
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(textToCopy)
					.then(function(){
						if (typeof settings.onCopy === 'function') {
							settings.onCopy(textToCopy, $el.get(0));
						}
					})
					.catch(function(err){
						if (typeof settings.onError === 'function') {
							settings.onError(err, $el.get(0));
						}
					});
			}
			// Fallback per browser più vecchi
			else {
				try {
					var $tmp = $('<textarea>');
					$('body').append($tmp);
					$tmp.val(textToCopy).select();
					document.execCommand('copy');
					$tmp.remove();
					if (typeof settings.onCopy === 'function') {
						settings.onCopy(textToCopy, $el.get(0));
					}
				}
				catch (err) {
					if (typeof settings.onError === 'function') {
						settings.onError(err, $el.get(0));
					}
				}
			}
		});

		// Ritorna this per chaining
		return this;
	};

	// Opzioni di default del plugin
	$.fn.CopyClip.defaults = {
		selector : '.copy', // quali elementi diventano “cliccabili”
		tag	 : 'cc-text', // tag custom che contiene il testo da copiare
		onCopy : null, // callback dopo copia
		onError : null // callback in caso di errore
	};

})(jQuery);
