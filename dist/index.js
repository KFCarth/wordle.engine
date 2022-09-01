import { WORDS } from './word_list.js';
export class Engine {
    WORDS;
    ANSWER;
    TRIES_LEFT;
    constructor(config) {
        this.ANSWER = config?.ANSWER || this.getRandom(WORDS);
        this.TRIES_LEFT = config?.TRIES_LEFT ?? 6;
        this.WORDS = config?.WORDS || WORDS;
    }
    getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    async isValidWord(word, arr) {
        return new Promise((resolve, reject) => {
            if (!arr.includes(word)) {
                reject({
                    isValid: false,
                    reason: 'That word is not in the list',
                });
            }
            else if (word.length !== 5) {
                reject({
                    isValid: false,
                    reason: `Guess word's length does not match the answer's length`,
                });
            }
            else if (!word.match(/[A-Z]/i)) {
                reject({
                    isValid: false,
                    reason: `Invalid characters used! Please use english letters instead`,
                });
            }
            else {
                resolve({
                    isValid: true,
                    reason: `Valid Word!`,
                });
            }
        });
    }
    loadGame() {
        const answer = this.ANSWER;
        const TRIES_LEFT = this.TRIES_LEFT;
        const gameState = true;
        return {
            answer,
            TRIES_LEFT,
            gameState,
        };
    }
    stopGame() {
        const answer = undefined;
        const TRIES_LEFT = this.TRIES_LEFT;
        const gameState = false;
        return {
            answer,
            TRIES_LEFT,
            gameState,
        };
    }
    async guess(guess, answer) {
        const docs = await this.isValidWord(guess, this.WORDS);
        if (!docs.isValid) {
            return docs.reason;
        }
        let guessableLetters = [...answer];
        let response = [];
        for (let i in guess) {
            if (guess[i] === answer[i]) {
                // CORRECT
                response.push('🟩');
            }
            else if (guessableLetters.includes(guess[i])) {
                // WRONG
                response.push('🟨');
                delete guessableLetters[guessableLetters.indexOf(guess[i])]; // Sets the array to 'null' at that indexOf()
                guessableLetters = guessableLetters.filter((e) => e); // Removes the 'null' value
            }
            else {
                // ABSENT
                response.push('⬛');
            }
        }
        let data = response.join(' ').toString();
        return data;
    }
}
