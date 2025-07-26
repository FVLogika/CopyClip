// CopyClip jQuery Plugin v1.0.0
// https://github.com/tuo-repo/copyclip
// License: MIT

;(function($){
	'use strict';

	/**
	 * Verifica se esiste già una regola CSS per uno specifico selettore.
	 * Evita duplicazioni nella iniezione di <style>.
	 *
	 * @param {String} selector - selettore CSS da cercare (es: '.copy' o 'cc-text')
	 * @returns {Boolean}
	 */
	function cssRuleExists(selector) {
		for (var i = 0; i < document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			var rules;
			try {
				rules = sheet.cssRules || sheet.rules;
			} catch (e) {
				continue; // fogli CORS
			}
			for (var j = 0; j < rules.length; j++) {
				if (rules[j].selectorText === selector) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Inietta dinamicamente un tag <style> in <head> con la regola CSS richiesta.
	 * Chiamala per ogni selettore + dichiarazione da applicare.
	 *
	 * @param {String} selector - selettore CSS (es: 'cc-text' o '.copy')
	 * @param {String} declaration - dichiarazione CSS (es: 'display: none !important;')
	 */
	function injectStyleRule(selector, declaration) {
		if (cssRuleExists(selector)) {
			return;
		}
		var css = selector + " { " + declaration + " }";
		var style = document.createElement('style');
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

		// inietta i due stili di default
		injectStyleRule(settings.tag, "display: none !important;");
		injectStyleRule(settings.selector, "cursor: pointer !important;");

		// Delegazione su document: anche elementi creati dinamicamente
		$(document).on('click.CopyClip', settings.selector, function(event) {
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
