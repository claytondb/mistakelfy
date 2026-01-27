// Mistakelfy - AI Text Humanizer
// Makes AI-generated text look more human by adding tasteful imperfections

// Common typo patterns (nearby keys on QWERTY)
const nearbyKeys = {
    'a': ['s', 'q', 'z'],
    'b': ['v', 'n', 'g', 'h'],
    'c': ['x', 'v', 'd', 'f'],
    'd': ['s', 'f', 'e', 'r', 'c', 'x'],
    'e': ['w', 'r', 'd', 's'],
    'f': ['d', 'g', 'r', 't', 'v', 'c'],
    'g': ['f', 'h', 't', 'y', 'b', 'v'],
    'h': ['g', 'j', 'y', 'u', 'n', 'b'],
    'i': ['u', 'o', 'k', 'j'],
    'j': ['h', 'k', 'u', 'i', 'n', 'm'],
    'k': ['j', 'l', 'i', 'o', 'm'],
    'l': ['k', 'o', 'p'],
    'm': ['n', 'j', 'k'],
    'n': ['b', 'm', 'h', 'j'],
    'o': ['i', 'p', 'k', 'l'],
    'p': ['o', 'l'],
    'q': ['w', 'a'],
    'r': ['e', 't', 'd', 'f'],
    's': ['a', 'd', 'w', 'e', 'z', 'x'],
    't': ['r', 'y', 'f', 'g'],
    'u': ['y', 'i', 'h', 'j'],
    'v': ['c', 'b', 'f', 'g'],
    'w': ['q', 'e', 'a', 's'],
    'x': ['z', 'c', 's', 'd'],
    'y': ['t', 'u', 'g', 'h'],
    'z': ['a', 'x', 's']
};

// Common grammar mix-ups humans make
const grammarSwaps = [
    { find: /\btheir\b/gi, replace: 'there', chance: 0.15 },
    { find: /\bthere\b/gi, replace: 'their', chance: 0.15 },
    { find: /\byou're\b/gi, replace: 'your', chance: 0.2 },
    { find: /\bits\b(?!\s+(?:own|self))/gi, replace: "it's", chance: 0.15 },
    { find: /\bit's\b/gi, replace: 'its', chance: 0.15 },
    { find: /\bthen\b/gi, replace: 'than', chance: 0.1 },
    { find: /\bthan\b/gi, replace: 'then', chance: 0.1 },
    { find: /\baffect\b/gi, replace: 'effect', chance: 0.2 },
    { find: /\beffect\b/gi, replace: 'affect', chance: 0.2 },
    { find: /\bdefinitely\b/gi, replace: 'definately', chance: 0.3 },
    { find: /\bseparate\b/gi, replace: 'seperate', chance: 0.3 },
    { find: /\boccasionally\b/gi, replace: 'occassionally', chance: 0.3 },
    { find: /\baccommodate\b/gi, replace: 'accomodate', chance: 0.3 },
    { find: /\boccurred\b/gi, replace: 'occured', chance: 0.3 },
];

// Filler words/phrases to inject
const fillerWords = [
    'like, ',
    'basically ',
    'honestly ',
    'actually ',
    'I mean, ',
    'you know, ',
    'kind of ',
    'sort of ',
    'pretty much ',
    'really ',
];

// Informal replacements
const informalSwaps = [
    { find: /\bgoing to\b/gi, replace: 'gonna', chance: 0.4 },
    { find: /\bwant to\b/gi, replace: 'wanna', chance: 0.3 },
    { find: /\bgot to\b/gi, replace: 'gotta', chance: 0.3 },
    { find: /\bkind of\b/gi, replace: 'kinda', chance: 0.4 },
    { find: /\bsort of\b/gi, replace: 'sorta', chance: 0.3 },
    { find: /\bdo not\b/gi, replace: "don't", chance: 0.5 },
    { find: /\bcannot\b/gi, replace: "can't", chance: 0.5 },
    { find: /\bwill not\b/gi, replace: "won't", chance: 0.5 },
    { find: /\bI am\b/g, replace: "I'm", chance: 0.6 },
    { find: /\bvery\b/gi, replace: 'really', chance: 0.3 },
];

// Track changes for stats
let changeLog = [];

function humanizeText() {
    const input = document.getElementById('input-text').value;
    if (!input.trim()) {
        alert('Please paste some text first!');
        return;
    }

    const chaosLevel = parseInt(document.getElementById('chaos-level').value);
    const options = {
        typos: document.getElementById('opt-typos').checked,
        grammar: document.getElementById('opt-grammar').checked,
        punctuation: document.getElementById('opt-punctuation').checked,
        informal: document.getElementById('opt-informal').checked,
        fillers: document.getElementById('opt-fillers').checked,
        chaos: chaosLevel
    };

    changeLog = [];
    let output = input;

    // Apply transformations based on options
    if (options.informal) {
        output = applyInformalSwaps(output, options.chaos);
    }
    
    if (options.grammar) {
        output = applyGrammarSwaps(output, options.chaos);
    }

    if (options.punctuation) {
        output = applyPunctuationQuirks(output, options.chaos);
    }

    if (options.fillers) {
        output = addFillerWords(output, options.chaos);
    }

    if (options.typos) {
        output = addTypos(output, options.chaos);
    }

    document.getElementById('output-text').value = output;
    showStats(input, output);
}

function applyGrammarSwaps(text, chaos) {
    const chaosMult = chaos / 3;
    
    grammarSwaps.forEach(swap => {
        if (Math.random() < swap.chance * chaosMult) {
            const matches = text.match(swap.find);
            if (matches && matches.length > 0) {
                // Only swap one instance randomly
                const randomMatch = matches[Math.floor(Math.random() * matches.length)];
                const replacement = preserveCase(randomMatch, swap.replace);
                text = text.replace(randomMatch, replacement);
                changeLog.push(`Grammar: "${randomMatch}" → "${replacement}"`);
            }
        }
    });
    
    return text;
}

function applyInformalSwaps(text, chaos) {
    const chaosMult = chaos / 3;
    
    informalSwaps.forEach(swap => {
        if (Math.random() < swap.chance * chaosMult) {
            const matches = text.match(swap.find);
            if (matches && matches.length > 0) {
                const randomMatch = matches[Math.floor(Math.random() * matches.length)];
                const replacement = preserveCase(randomMatch, swap.replace);
                text = text.replace(randomMatch, replacement);
                changeLog.push(`Informal: "${randomMatch}" → "${replacement}"`);
            }
        }
    });
    
    return text;
}

function applyPunctuationQuirks(text, chaos) {
    const chaosMult = chaos / 3;
    
    // Sometimes remove Oxford comma
    if (Math.random() < 0.3 * chaosMult) {
        const oxfordPattern = /,(\s+and\s+\w+[,.])/gi;
        if (oxfordPattern.test(text)) {
            text = text.replace(oxfordPattern, '$1');
            changeLog.push('Removed an Oxford comma');
        }
    }
    
    // Sometimes add double space after period (old habit)
    if (Math.random() < 0.2 * chaosMult) {
        const sentences = text.split(/(?<=\.)\s+/);
        if (sentences.length > 2) {
            const idx = Math.floor(Math.random() * (sentences.length - 1)) + 1;
            text = sentences.slice(0, idx).join(' ') + '.  ' + sentences.slice(idx).join(' ');
            changeLog.push('Added double space after period');
        }
    }
    
    // Sometimes skip a comma
    if (Math.random() < 0.25 * chaosMult) {
        const commaMatches = [...text.matchAll(/,\s+(?=\w)/g)];
        if (commaMatches.length > 0) {
            const match = commaMatches[Math.floor(Math.random() * commaMatches.length)];
            text = text.slice(0, match.index) + ' ' + text.slice(match.index + match[0].length);
            changeLog.push('Removed a comma');
        }
    }
    
    // Occasionally start sentence with "And" or "But"
    if (Math.random() < 0.2 * chaosMult) {
        const sentences = text.split(/(?<=\.)\s+/);
        if (sentences.length > 2) {
            const idx = Math.floor(Math.random() * (sentences.length - 1)) + 1;
            const starters = ['And ', 'But ', 'So '];
            const starter = starters[Math.floor(Math.random() * starters.length)];
            // Don't add if already starts with these
            if (!/^(And|But|So)\s/i.test(sentences[idx])) {
                sentences[idx] = starter + sentences[idx].charAt(0).toLowerCase() + sentences[idx].slice(1);
                text = sentences.join(' ');
                changeLog.push(`Started sentence with "${starter.trim()}"`);
            }
        }
    }
    
    return text;
}

function addFillerWords(text, chaos) {
    const chaosMult = chaos / 3;
    const probability = 0.05 * chaosMult;
    
    // Add filler at start of a random sentence
    if (Math.random() < probability * 2) {
        const sentences = text.split(/(?<=\.)\s+/);
        if (sentences.length > 1) {
            const idx = Math.floor(Math.random() * (sentences.length - 1)) + 1;
            const filler = fillerWords[Math.floor(Math.random() * fillerWords.length)];
            const firstChar = sentences[idx].charAt(0);
            sentences[idx] = filler.charAt(0).toUpperCase() + filler.slice(1) + 
                           firstChar.toLowerCase() + sentences[idx].slice(1);
            text = sentences.join(' ');
            changeLog.push(`Added filler: "${filler.trim()}"`);
        }
    }
    
    return text;
}

function addTypos(text, chaos) {
    const chaosMult = chaos / 3;
    const words = text.split(/(\s+)/);
    const numTypos = Math.floor(Math.random() * chaos) + (chaos > 3 ? 1 : 0);
    
    for (let t = 0; t < numTypos; t++) {
        // Pick a random word (skip short words and punctuation)
        const eligibleIndices = words
            .map((w, i) => ({ word: w, index: i }))
            .filter(({ word }) => /^[a-zA-Z]{4,}$/.test(word));
        
        if (eligibleIndices.length === 0) continue;
        
        const { word, index } = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
        
        // Choose typo type
        const typoType = Math.floor(Math.random() * 4);
        let newWord = word;
        
        switch (typoType) {
            case 0: // Adjacent key typo
                const charIdx = Math.floor(Math.random() * word.length);
                const char = word[charIdx].toLowerCase();
                if (nearbyKeys[char]) {
                    const replacement = nearbyKeys[char][Math.floor(Math.random() * nearbyKeys[char].length)];
                    newWord = word.slice(0, charIdx) + 
                             (word[charIdx] === word[charIdx].toUpperCase() ? replacement.toUpperCase() : replacement) + 
                             word.slice(charIdx + 1);
                    changeLog.push(`Typo (adjacent key): "${word}" → "${newWord}"`);
                }
                break;
                
            case 1: // Double letter
                const doubleIdx = Math.floor(Math.random() * (word.length - 1)) + 1;
                newWord = word.slice(0, doubleIdx) + word[doubleIdx - 1] + word.slice(doubleIdx);
                changeLog.push(`Typo (double letter): "${word}" → "${newWord}"`);
                break;
                
            case 2: // Missing letter
                const missIdx = Math.floor(Math.random() * (word.length - 2)) + 1;
                newWord = word.slice(0, missIdx) + word.slice(missIdx + 1);
                changeLog.push(`Typo (missing letter): "${word}" → "${newWord}"`);
                break;
                
            case 3: // Swapped letters
                const swapIdx = Math.floor(Math.random() * (word.length - 2)) + 1;
                newWord = word.slice(0, swapIdx) + word[swapIdx + 1] + word[swapIdx] + word.slice(swapIdx + 2);
                changeLog.push(`Typo (swapped): "${word}" → "${newWord}"`);
                break;
        }
        
        if (newWord !== word) {
            words[index] = newWord;
        }
    }
    
    return words.join('');
}

function preserveCase(original, replacement) {
    if (original === original.toUpperCase()) {
        return replacement.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement.toLowerCase();
}

function copyOutput() {
    const output = document.getElementById('output-text');
    output.select();
    document.execCommand('copy');
    
    const btn = document.getElementById('copy-btn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
}

function showStats(input, output) {
    const stats = document.getElementById('stats');
    if (changeLog.length === 0) {
        stats.innerHTML = 'No changes made. Try increasing the chaos level!';
    } else {
        stats.innerHTML = `Made <span>${changeLog.length}</span> humanizing change${changeLog.length === 1 ? '' : 's'}<br>
        <small style="color:#666">${changeLog.slice(0, 5).join(' • ')}${changeLog.length > 5 ? ' • ...' : ''}</small>`;
    }
}

// Update chaos level display
document.getElementById('chaos-level').addEventListener('input', function() {
    document.getElementById('chaos-value').textContent = this.value;
});
