const DEFAULT_HISTORY_SETTING = {
        enabled: true
    };

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { word, lang } = request, 
        url = constructUrl(word.trim().toLowerCase());

    fetch(url)
        .then(res => res.json())
        .then((result) => {
            const content = { word: word, meaning: result[word], audioSrc: null };

            sendResponse({ content });

            content && browser.storage.local.get().then((results) => {
                let history = results.history || DEFAULT_HISTORY_SETTING;
        
                history.enabled && saveWord(content)
            });
        })

    return true;
});

function constructUrl (word) {
    const directory = 'dictionary/' + word.split('').join('/');
    const repository =  'tonymuu/static-english-dictionary';
    const branch = 'main';
    const baseURL = 'https://raw.githubusercontent.com';
    return `${baseURL}/${repository}/${branch}/${directory}/def.json`;
}


function saveWord (content) {
    let word = content.word,
        meaning = content.meaning,
      
        storageItem = browser.storage.local.get('definitions');

        storageItem.then((results) => {
            let definitions = results.definitions || {};

            definitions[word] = meaning;
            browser.storage.local.set({
                definitions
            });
        })
}