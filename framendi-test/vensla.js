app = Vue.createApp({
    data() {
        return {
            puzzleDate: null,
            words: [],
            selectedWords: [],
            correctGuesses: [],
            status: '',
            colours: {
                1: 'bg-blue-400',
                2: 'bg-green-400',
                3: 'bg-yellow-400',
                4: 'bg-purple-400',
            },
            emojis: {
                1: '🟦',
                2: '🟩',
                3: '🟨',
                4: '🟪',
            },
            guesses: [],
            result: [],
        };
    },
    computed: {
        needsMore() {
            return this.selectedWords.length === 4 ? false : true
        },
        done() {
            return (this.correctGuesses.length === 4)
        },
        wrongGuesses() {
            return this.guesses.length - this.correctGuesses.length
        }
    },
    watch: {
        done(value) {
            if (value) {
                for (guess of this.guesses) {
                    let guessRow = '';
                    for (word of guess) {
                        for (set of this.correctGuesses) {
                            if (set['words'].includes(word)) {
                                guessRow += this.emojis[set['id']];
                            }
                        }
                    }
                    this.result.push(guessRow);
                }
            }
        }
    },
    methods: {
        async getData() {
            try {
                let response = await fetch('http://127.0.0.1:8000/today');
                let puzzleJson = await response.json();
                this.words = puzzleJson['words'];
                let puzzleDate = new Date(puzzleJson['date']);
                this.puzzleDate = puzzleDate.toLocaleDateString('de-DE');
            } catch (error) {
                console.log(error);
            }
        },
        select(word, event) {
            if (this.selectedWords.includes(word)) {
                this.selectedWords.splice(this.selectedWords.indexOf(word), 1);
            } else if (this.needsMore) {
                this.selectedWords.push(word);
            }
        },
        async checkGuess() {
            let sortedGuess = [...this.selectedWords].sort();
            if (JSON.stringify(this.guesses).includes(JSON.stringify(sortedGuess))) {
                this.status = "Þú hefur nú þegar giskað á þetta!";
                return;
            }
            this.guesses.push([...this.selectedWords].sort());
            const checkUrl = new URL('http://127.0.0.1:8000/check');
            for (word of this.selectedWords) {
                checkUrl.searchParams.append('w', word);
            }
            try {
                let response = await fetch(checkUrl);
                let result = await response.json();
                this.status = result['result'];
                if (result['result'] === 'Rétt!') {
                    this.words = this.words.filter(x => !this.selectedWords.includes(x));
                    this.selectedWords = [];
                    this.correctGuesses.push(result['set']);
                }
            } catch (error) {
                console.log(error);
            }
        },
        clear() {
            this.selectedWords = [];
        },
        shuffle() {
            const shuffleArray = (array) => { 
                for (let i = array.length - 1; i > 0; i--) { 
                  const j = Math.floor(Math.random() * (i + 1)); 
                  [array[i], array[j]] = [array[j], array[i]]; 
                } 
                return array;
            };
            this.words = shuffleArray(this.words);
        },
        copyResult() {
            navigator.clipboard.writeText(this.result.join('\n'));
        }
    },
    created() {
        this.getData();
    },
});

app.mount('#vensla');
